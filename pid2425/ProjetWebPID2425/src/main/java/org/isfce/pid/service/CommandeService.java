package org.isfce.pid.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.isfce.pid.dao.ISandwichDao;
import org.isfce.pid.model.*;
import org.isfce.pid.dao.ICommandeDao;
import org.isfce.pid.model.dto.CreateCommandeDto;
import org.isfce.pid.model.dto.CreateLigneCmdDto;
import org.isfce.pid.model.dto.LigneCmdDto;
import org.isfce.pid.model.dto.ListCmdSessionDto;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CommandeService {


    private final ICommandeDao commandeDao;

    private final SessionService sessionService;

    private final UserService userService;

    @Qualifier("ISandwichDao")
    private final ISandwichDao articleDao;

    public CommandeService(ICommandeDao commandeDao, SessionService sessionService, UserService userService, ISandwichDao articleDao) {
        this.commandeDao = commandeDao;
        this.sessionService = sessionService;
        this.userService = userService;
        this.articleDao = articleDao;
    }

    @Transactional
@CacheEvict(value = {"commandes", "commandesBySession", "commandesBySessionAndDate"}, allEntries = true)
public Commande saveCommande(CreateCommandeDto createDto) {
    // Recuperar la sesión activa
    Optional<Session> sessionOpt = sessionService.getActiveSession().stream().findFirst();
    if (sessionOpt.isEmpty()) {
        throw new RuntimeException("Impossible de passer une commande car aucune session n'est active");
    }
    Session session = sessionOpt.get();

    // Crear la commande
    Commande commande = new Commande();
    commande.setSessionNom(session.getNom());
    commande.setDate(LocalDate.now());

    // Recuperar el usuario actual
    String currentUserName = getCurrentUserName();
    if (currentUserName == null || currentUserName.isEmpty()) {
        throw new RuntimeException("Le nom de l'utilisateur ne peut être vide");
    }
    User user = userService.getUserById(currentUserName)
            .orElseThrow(() -> new RuntimeException("User not found: " + currentUserName));
    commande.setUser(user);

    // Procesar cada línea de commande a partir del DTO.
    // Usamos el méodo 'lignesCmd()' del DTO (renombrado para evitar conflictos) para acceder a la lista.
    List<LigneCmd> lignes = createDto.lignesCmd().stream().map((CreateLigneCmdDto createLigne) -> {
        // Recuperar el código del artículo desde el DTO
        String articleCode = createLigne.articleCode();
        // Buscar el artículo en la base de datos; findById retornará Optional<Sandwiches>
        Sandwiches article = articleDao.findById(articleCode)
                .orElseThrow(() -> new RuntimeException("Article not found: " + articleCode));

        // Crear la línea de commande
        LigneCmd ligne = new LigneCmd();
        // Asignar la relación con TARTICLE
        ligne.setArticle(article);
        // Asignar el nombre del artículo y el precio, obtenidos del objeto Article
        ligne.setNomSandwich(article.getNom());
        ligne.setPrix(article.getPrix());
        // Asignar la descripción proporcionada en el DTO
        ligne.setDescription(createLigne.description());
        return ligne;
    }).collect(Collectors.toList());

    // Establecer la relación inversa: cada línea conoce su commande.
    // Utilizamos el setter de la entidad Commande, no accedemos directamente a la propiedad 'lignes'
    lignes.forEach(ligne -> ligne.setCmd(commande));
    commande.setLignes(lignes);

    // Guardar la commande (con sus líneas asociadas)
    return commandeDao.save(commande);
}

    private String getCurrentUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null) ? authentication.getName() : null;
    }

    @Cacheable(value = "commandesBySession", key = "#sessionNom")
    public List<Commande> getAllCommandesBySession(String sessionNom) {
        return commandeDao.findBySessionNom(sessionNom);
    }

    public List<Commande> getAllCommandes() {
        return commandeDao.findAll();
    }

    @Cacheable(value = "commandes", key = "#id")
    public Optional<Commande> getCommandeById(Integer id) {
        return commandeDao.findById(id);
    }

    @Cacheable(value = "commandesBySessionAndDate", key = "#sessionNom + '_' + #date.toString()")
    public List<ListCmdSessionDto> getCommandesBySessionAndDate(String sessionNom, LocalDate date) {

        List<Commande> commandes = commandeDao.findBySessionNomAndDate(sessionNom, date);
        return commandes.stream().map(commande -> {
            List<LigneCmdDto> lignesDTO = commande.getLignes().stream().map(ligne -> new LigneCmdDto(
                    ligne.getNomSandwich(),
                    ligne.getDescription(),
                    ligne.getPrix()
            )).collect(Collectors.toList());

            BigDecimal total = lignesDTO.stream()
                    .map(LigneCmdDto::prix)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);


            return new ListCmdSessionDto(
                    commande.getNum(),
                    commande.getDate(),
                    commande.getUser().getUsername(),
                    commande.getSessionNom(),
                    lignesDTO,
                    total
            );
        }).collect(Collectors.toList());
    }

    // Verifica si la commande se puede eliminar (solo si la sesión asociada está en estado OUVERTE)
    public boolean isDeletable(Commande commande) {
        Optional<Session> sessionOpt = sessionService.getSessions().stream()
                .filter(s -> s.getNom().equalsIgnoreCase(commande.getSessionNom()))
                .findFirst();
        if (sessionOpt.isEmpty()) {
            return false;
        }
        Session session = sessionOpt.get();
        // Se permite eliminar únicamente si la sesión está abierta (OUVERTE)
        return session.getEtat() == Session.EtatSession.OUVERTE;
    }

    private void refund(String username, BigDecimal amount) {
        userService.crediterUser(username, amount);
    }

    // Elimina una commande, procesando el reembolso y verificando la condición de eliminación
    @Transactional
    public void deleteCommande(Integer id) {
        Optional<Commande> commandeOpt = commandeDao.findById(id);
        if (commandeOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Commande not found");
        }
        Commande commande = commandeOpt.get();
        if (!isDeletable(commande)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "La commande no se puede eliminar en este estado");
        }
        // Calcular el total a reembolsar
        BigDecimal total = commande.getLignes().stream()
                .map(ligne -> ligne.getPrix())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        // Procesar el reembolso
        refund(commande.getUser().getUsername(), total);
        // Eliminar la commande
        commandeDao.delete(commande);
    }
}

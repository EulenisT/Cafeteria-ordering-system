package org.isfce.pid.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.isfce.pid.model.Commande;
import org.isfce.pid.model.Session;
import org.isfce.pid.dao.ICommandeDao;
import org.isfce.pid.model.dto.LigneCmdDto;
import org.isfce.pid.model.dto.ListCmdSessionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CommandeService {

    @Autowired
    private ICommandeDao commandeDao;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserService userService;


    @Transactional
    public Commande saveCommande(Commande commande) {
        Optional<Session> sessionOpt = sessionService.getActiveSession().stream().findFirst();
        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Impossible de passer une commande car aucune session n'est active");
        }
        Session session = sessionOpt.get();
        System.out.println("Session active obtenue: " + session);
        commande.setSessionNom(session.getNom());
        commande.setDate(LocalDate.now());

        String currentUserName = getCurrentUserName();
        if (currentUserName == null || currentUserName.isEmpty()) {
            throw new RuntimeException("Le nom de l'utilisateur ne peut être vide");
        }

        // Vérifier le nombre de commandes déjà passées par l'user dans la session active pour le jour actuel
        List<Commande> commandesSession = commandeDao.findBySessionNomAndDate(session.getNom(), LocalDate.now());
        List<Commande> commandesUser = commandesSession.stream()
                .filter(cmd -> cmd.getDate().isEqual(LocalDate.now()))
                .filter(cmd -> currentUserName.equals(cmd.getUsername()))
                .toList();
        if (commandesUser.size() >= 3) {
            throw new RuntimeException("Vous avez déjà atteint le nombre maximum de commandes pour cette session aujourd'hui");
        }

        commande.setUsername(currentUserName);

        if (commande.getLignes() != null) {
            commande.getLignes().forEach(ligne -> ligne.setCmd(commande));
        }
        return commandeDao.save(commande);
    }


    private String getCurrentUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null) ? authentication.getName() : null;
    }

    public List<Commande> getAllCommandesBySession(String sessionNom) {
        return commandeDao.findBySessionNom(sessionNom);
    }

    public List<Commande> getAllCommandes() {
        return commandeDao.findAll();
    }

    public Optional<Commande> getCommandeById(Integer id) {
        return commandeDao.findById(id);
    }

    public List<ListCmdSessionDto> getCommandesBySessionAndDate(String sessionNom, LocalDate date) {

        List<Commande> commandes = commandeDao.findBySessionNomAndDate(sessionNom, date);
        return commandes.stream().map(commande -> {
            List<LigneCmdDto> lignesDTO = commande.getLignes().stream().map(ligne -> new LigneCmdDto(
                    ligne.getNomSandwich(),
                    ligne.getDescription(),
                    BigDecimal.valueOf(ligne.getPrix())
            )).collect(Collectors.toList());

            BigDecimal total = lignesDTO.stream()
                    .map(LigneCmdDto::prix)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);


            return new ListCmdSessionDto(
                    commande.getNum(),
                    commande.getDate(),
                    commande.getUsername(),
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
        // Convierte el importe a Double e invoca el
        userService.crediterUser(username, amount.doubleValue());
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
                .map(ligne -> BigDecimal.valueOf(ligne.getPrix()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        // Procesar el reembolso
        refund(commande.getUsername(), total);
        // Eliminar la commande
        commandeDao.delete(commande);
    }
}

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

    /**
     * Enregistre une commande à partir des informations du DTO.
     * Cette méthode récupère la session active, l'utilisateur courant et traite chaque ligne de commande.
     * Les caches relatifs aux commandes sont vidés après l'enregistrement.
     *
     * @param createDto le DTO contenant les informations de la commande à créer
     * @return la commande enregistrée
     * @throws RuntimeException si aucune session active n'est trouvée ou si l'utilisateur est introuvable
     */

    @Transactional
@CacheEvict(value = {"commandes", "commandesBySession", "commandesBySessionAndDate"}, allEntries = true)
public Commande saveCommande(CreateCommandeDto createDto) {
        // Récupérer la session active
    Optional<Session> sessionOpt = sessionService.getActiveSession().stream().findFirst();
    if (sessionOpt.isEmpty()) {
        throw new RuntimeException("Impossible de passer une commande car aucune session n'est active");
    }
    Session session = sessionOpt.get();

        // Créer une nouvelle commande et définir la session et la date
    Commande commande = new Commande();
    commande.setSessionNom(session.getNom());
    commande.setDate(LocalDate.now());

        // Récupérer l'utilisateur courant
    String currentUserName = getCurrentUserName();
    if (currentUserName == null || currentUserName.isEmpty()) {
        throw new RuntimeException("Le nom de l'utilisateur ne peut être vide");
    }
    User user = userService.getUserById(currentUserName)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + currentUserName));
    commande.setUser(user);

        // Traiter chaque ligne de commande à partir du DTO
    List<LigneCmd> lignes = createDto.lignesCmd().stream().map((CreateLigneCmdDto createLigne) -> {
        // Récupérer le code de l'article depuis le DTO
        String articleCode = createLigne.articleCode();
        // Rechercher l'article (sandwich) correspondant
        Sandwiches article = articleDao.findById(articleCode)
                .orElseThrow(() -> new RuntimeException("Article non trouvé: " + articleCode));

        // Créer une nouvelle ligne de commande et définir ses propriétés
        LigneCmd ligne = new LigneCmd();
        ligne.setArticle(article);
        ligne.setNomSandwich(article.getNom());
        ligne.setPrix(article.getPrix());
        ligne.setDescription(createLigne.description());
        return ligne;
    }).collect(Collectors.toList());

        // Définir la relation entre chaque ligne et la commande
    lignes.forEach(ligne -> ligne.setCmd(commande));
    commande.setLignes(lignes);

        // Enregistrer la commande avec ses lignes associées
    return commandeDao.save(commande);
}

    /**
     * Récupère le nom de l'utilisateur courant à partir du contexte de sécurité.
     */
    private String getCurrentUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null) ? authentication.getName() : null;
    }

    /**
     * Récupère toutes les commandes d'une session donnée, en utilisant le cache.
     *
     * @param sessionNom le nom de la session
     * @return la liste des commandes associées à la session
     */
    @Cacheable(value = "commandesBySession", key = "#sessionNom")
    public List<Commande> getAllCommandesBySession(String sessionNom) {
        return commandeDao.findBySessionNom(sessionNom);
    }

    /**
     * Récupère toutes les commandes.
     * @return la liste de toutes les commandes
     */
    public List<Commande> getAllCommandes() {
        return commandeDao.findAll();
    }

    /**
     * Récupère une commande par son identifiant, en utilisant le cache.
     *
     * @param id l'identifiant de la commande
     */
    @Cacheable(value = "commandes", key = "#id")
    public Optional<Commande> getCommandeById(Integer id) {
        return commandeDao.findById(id);
    }

    /**
     * Récupère les commandes d'une session et d'une date spécifique sous forme de DTO.
     * Utilise le cache pour optimiser la récupération.
     *
     * @param sessionNom le nom de la session
     * @param date la date des commandes
     */
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

    /**
     * Vérifie si une commande est supprimable.
     * Une commande est supprimable uniquement si la session associée est ouverte.
     *
     * @param commande la commande à vérifier
     * @return true si la commande peut être supprimée, false sinon
     */
    public boolean isDeletable(Commande commande) {
        Optional<Session> sessionOpt = sessionService.getSessions().stream()
                .filter(s -> s.getNom().equalsIgnoreCase(commande.getSessionNom()))
                .findFirst();
        if (sessionOpt.isEmpty()) {
            return false;
        }
        Session session = sessionOpt.get();
        return session.getEtat() == Session.EtatSession.OUVERTE;
    }

    /**
     * Effectue un remboursement pour un utilisateur.
     *
     * @param username le nom de l'utilisateur
     * @param amount le montant à rembourser
     */
    private void refund(String username, BigDecimal amount) {
        userService.crediterUser(username, amount);
    }

    /**
     * Supprime une commande.
     * Vérifie si la commande peut être supprimée, effectue le remboursement du total de la commande,
     * et supprime la commande de la base de données.
     *
     * @param id l'identifiant de la commande à supprimer
     */
    @Transactional
    public void deleteCommande(Integer id) {
        Optional<Commande> commandeOpt = commandeDao.findById(id);
        if (commandeOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Commande non trouvée");
        }
        Commande commande = commandeOpt.get();
        if (!isDeletable(commande)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "La commande ne peut pas être supprimée dans cet état");
        }
        // Calculer le total à rembourser
        BigDecimal total = commande.getLignes().stream()
                .map(ligne -> ligne.getPrix())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        // Effectuer le remboursement
        refund(commande.getUser().getUsername(), total);
        // Supprimer la commande
        commandeDao.delete(commande);
    }
}

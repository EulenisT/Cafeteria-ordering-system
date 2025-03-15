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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommandeService {

    @Autowired
    private ICommandeDao commandeDao;

    @Autowired
    private SessionService sessionService;


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

}
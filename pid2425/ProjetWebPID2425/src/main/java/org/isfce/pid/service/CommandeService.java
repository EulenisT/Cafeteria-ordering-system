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
        System.out.println("Session active obtenida: " + session);
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


    public List<ListCmdSessionDto> getPedidosBySessionAndDate(String sessionNom, LocalDate date) {
        List<Commande> commandes = commandeDao.findBySessionNomAndDate(sessionNom, date);
        return commandes.stream().map(commande -> {
            ListCmdSessionDto dto = new ListCmdSessionDto();
            dto.setCommandeNum(commande.getNum());
            dto.setDate(commande.getDate());
            dto.setUsername(commande.getUsername());
            dto.setSessionNom(commande.getSessionNom());

            List<LigneCmdDto> lignesDTO = commande.getLignes().stream().map(ligne -> {
                LigneCmdDto ligneDto = new LigneCmdDto();
                ligneDto.setType(ligne.getType());
                ligneDto.setNomSandwich(ligne.getNomSandwich());
                ligneDto.setDescription(ligne.getDescription());
                ligneDto.setPrix(BigDecimal.valueOf(ligne.getPrix()));
                return ligneDto;
            }).collect(Collectors.toList());
            dto.setSandwiches(lignesDTO);

            BigDecimal total = lignesDTO.stream()
                    .map(LigneCmdDto::getPrix)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dto.setTotal(total);

            return dto;
        }).collect(Collectors.toList());
    }
}

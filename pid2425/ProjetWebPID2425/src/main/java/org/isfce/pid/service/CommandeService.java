package org.isfce.pid.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.isfce.pid.model.Commande;
import org.isfce.pid.model.Session;
import org.isfce.pid.dao.ICommandeDao;
import org.isfce.pid.dao.ISessionDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommandeService {

    @Autowired
    private ICommandeDao commandeDao;

    @Autowired
    private ISessionDao sessionDao;

    @Transactional
    public Commande saveCommande(Commande commande) {
        Optional<Session> sessionOpt = sessionDao.findByActiveTrue().stream().findFirst();

        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Impossible de passer une commande car aucune session n'est active");
        }

        Session session = sessionOpt.get();
        commande.setSession(session);
        commande.setDate(LocalDate.now());

        if (commande.getLignes() != null) {
            commande.getLignes().forEach(ligne -> ligne.setCmd(commande));
        }

        return commandeDao.save(commande);
    }

    public List<Commande> getAllCommandes() {
        return commandeDao.findAll();
    }

    public Optional<Commande> getCommandeById(Integer id) {
        return commandeDao.findById(id);
    }

    public List<Commande> getAllCommandesBySession(Long sessionId) {
        return commandeDao.findBySessionId(sessionId);
    }
}

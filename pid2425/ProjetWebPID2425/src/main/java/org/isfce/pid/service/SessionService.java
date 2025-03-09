package org.isfce.pid.service;

import jakarta.annotation.PostConstruct;
import org.isfce.pid.dao.ISessionDao;
import org.isfce.pid.model.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@EnableScheduling
public class SessionService {

    private final ISessionDao sessionDao;

    private final String cronMatin;
    private final String cronApm;
    private final String cronSoir;

    public SessionService(ISessionDao sessionDao,
                          @Value("${cafet.session.matin.stop-time}") String cronMatin,
                          @Value("${cafet.session.apm.stop-time}") String cronApm,
                          @Value("${cafet.session.soir.stop-time}") String cronSoir) {
        this.sessionDao = sessionDao;
        this.cronMatin = cronMatin;
        this.cronApm = cronApm;
        this.cronSoir = cronSoir;
    }


    private LocalTime extraireHeureDepuisCron(String cron) {
        String[] tokens = cron.split(" ");
        return LocalTime.of(Integer.parseInt(tokens[2]), Integer.parseInt(tokens[1]));
    }

    @PostConstruct
    public void initSessions() {
        if (sessionDao.count() == 0) {
            sessionDao.save(new Session("MATIN", extraireHeureDepuisCron(cronMatin)));
            sessionDao.save(new Session("APM", extraireHeureDepuisCron(cronApm)));
            sessionDao.save(new Session("SOIR", extraireHeureDepuisCron(cronSoir)));
            log.info("Sessions inicializadas en la BD.");
        }
    }

    public List<Session> getToutesSessions() {
        return sessionDao.findAll();
    }

    /**
     * Retorna las sesiones actualmente abiertas.
     */
    public List<Session> getSessionsActives() {
        return sessionDao.findByActiveTrue();
    }

    /**
     * Clôture une session identifiée par son nom.
     */
    public String cloturerSessionParNom(String nomSession) {
        Optional<Session> sessionOpt = sessionDao.findAll().stream()
                .filter(s -> s.getNom().equals(nomSession) && s.estOuverte())
                .findFirst();
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.cloture();
            sessionDao.save(session);
            log.info("Session {} clôturée manuellement.", nomSession);
            return "Session " + nomSession + " clôturée avec succès.";
        } else {
            return "Aucune session ouverte trouvée avec le nom : " + nomSession;
        }
    }

    /**
     * Desactiva una sesión identificada por su nombre, siempre que no esté en estado CLOTUREE.
     */
    public String desactiverSessionParNom(String nomSession) {
        Optional<Session> sessionOpt = sessionDao.findAll().stream()
                .filter(s -> s.getNom().equals(nomSession) && s.estOuverte())
                .findFirst();
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.desactiveSession();
            sessionDao.save(session);
            log.info("Session {} desactivée manuellement.", nomSession);
            return "Session " + nomSession + " désactivée avec succès.";
        } else {
            return "Aucune session active trouvée avec le nom : " + nomSession;
        }
    }

    /**
     * Finalise (ferme) définitivement una sesión identificada por su nombre,
     * si esta ya se encuentra en estado CLOTUREE.
     */
    public String fermerSessionParNom(String nomSession) {
        Optional<Session> sessionOpt = sessionDao.findAll().stream()
                .filter(s -> s.getNom().equals(nomSession) && s.getEtat() == Session.EtatSession.CLOTUREE)
                .findFirst();
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.fermer();
            sessionDao.save(session);
            log.info("Session {} finalisée (fermée) manuellement.", nomSession);
            return "Session " + nomSession + " finalisée avec succès.";
        } else {
            return "Aucune session clôturée trouvée avec le nom : " + nomSession;
        }
    }

    /**
     * Activa las sesiones para que puedan ser abiertas.
     */
    @Scheduled(cron = "${cafet.session.activate.on-time}")
    private void activerSessions() {
        List<Session> sessions = sessionDao.findAll();
        sessions.forEach(Session::setActive);
        sessions.forEach(sessionDao::save);
        log.info("Sessions activées (active=true, état FERmee) : " + sessions);
    }

    /**
     * Verifica cada minuto si la sesión debe abrirse.
     * Si la sesión está activa, en estado FERMEE y la hora de cierre no ha pasado,
     * pasa a estado OUVERTE.
     */
    @Scheduled(cron = "0 * * * * ?")
    private void verifierEtOuvrirSessions() {
        List<Session> sessions = sessionDao.findAll();
        sessions.forEach(session -> {
            session.ouvrir();
            sessionDao.save(session);
        });
        log.info("Sessions vérifiées pour ouverture : " + sessions);
    }

    /**
     * Clôture automatiquement la session du MATIN.
     */
    @Scheduled(cron = "${cafet.session.matin.stop-time}")
    private void cloturerMatin() {
        List<Session> sessions = sessionDao.findAll();
        // Se asume que la primera sesión es la del MATIN.
        Session session = sessions.get(0);
        session.cloture();
        sessionDao.save(session);
        log.info("Session MATIN clôturée : " + session);
    }

    /**
     * Clôture automatiquement la session de l'APM.
     */
    @Scheduled(cron = "${cafet.session.apm.stop-time}")
    private void cloturerAPM() {
        List<Session> sessions = sessionDao.findAll();
        Session session = sessions.get(1);
        session.cloture();
        sessionDao.save(session);
        log.info("Session APM clôturée : " + session);
    }

    /**
     * Clôture automatiquement la session du SOIR.
     */
    @Scheduled(cron = "${cafet.session.soir.stop-time}")
    private void cloturerSoir() {
        List<Session> sessions = sessionDao.findAll();
        Session session = sessions.get(2);
        session.cloture();
        sessionDao.save(session);
        log.info("Session SOIR clôturée : " + session);
    }

    /**
     * Activa y abre manualmente una sesión identificada por su nombre.
     */
    public String activerEtOuvrirSessionParNom(String nomSession) {
        Optional<Session> sessionOpt = sessionDao.findAll().stream()
                .filter(s -> s.getNom().equals(nomSession))
                .findFirst();
        if (!sessionOpt.isPresent()) {
            return "Aucune session trouvée avec le nom : " + nomSession;
        }
        Session session = sessionOpt.get();
        if (!session.getActive()) {
            session.setActive();
            sessionDao.save(session);
            log.info("Session {} activée manuellement.", nomSession);
        }
        session.ouvrir();
        sessionDao.save(session);
        if (session.getEtat() == Session.EtatSession.OUVERTE) {
            log.info("Session {} ouverte manuellement après activation.", nomSession);
            return "Session " + nomSession + " activée et ouverte avec succès.";
        } else {
            return "Session " + nomSession + " activée mais n'a pas pu être ouverte (peut-être l'heure de clôture est passée).";
        }
    }

    /**
     * Fuerza la desactivación de una sesión
     */
    public String forcerDesactiverSessionParNom(String nomSession) {
        Optional<Session> sessionOpt = sessionDao.findAll().stream()
                .filter(s -> s.getNom().equals(nomSession) && s.getActive())
                .findFirst();
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.desactiveSession();  // Este método cambiará active a false si el estado no es CLOTUREE.
            sessionDao.save(session);
            log.info("Session {} forcée désactivée.", nomSession);
            return "Session " + nomSession + " désactivée avec succès.";
        } else {
            return "Aucune session active trouvée avec le nom : " + nomSession;
        }
    }
}

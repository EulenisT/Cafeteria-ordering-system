package org.isfce.pid.service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.annotation.PostConstruct;
import org.isfce.pid.model.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@EnableScheduling
public class SessionService {

    private List<Session> sessions = new ArrayList<>(3);

    public SessionService(@Value("${cafet.session.matin.stop-time}") String cronMatin,
                          @Value("${cafet.session.apm.stop-time}") String cronApm,
                          @Value("${cafet.session.soir.stop-time}") String cronSoir) {
        sessions.add(new Session("MATIN", extractHeureFromCron(cronMatin)));
        sessions.add(new Session("APM", extractHeureFromCron(cronApm)));
        sessions.add(new Session("SOIR", extractHeureFromCron(cronSoir)));
    }

    private LocalTime extractHeureFromCron(String cron) {
        String[] tokens = cron.split(" ");
        return LocalTime.of(Integer.parseInt(tokens[2]), Integer.parseInt(tokens[1]));
    }

    @PostConstruct
    public void initSessionState() {
        updateSessions();
    }

    /**
     * Se actualiza el estado de las sesiones cada minuto según la hora.
     */
    @Scheduled(cron = "0 * * * * ?")
    public void updateSessions() {
        LocalTime now = LocalTime.now();
        log.info("Mise à jour des sessions à l'heure: {}", now);


        sessions.forEach(session -> {
            if (session.estOuverte() || session.getEtat().equals(Session.EtatSession.FERMEE)) {
                session.desactiveSession();
            }
        });

        LocalTime activationTime = LocalTime.of(8, 0);
        if (!now.isBefore(activationTime) && now.isBefore(sessions.get(0).getHeureCloture())) {
            sessions.get(0).setActive();
            sessions.get(0).ouvrir();
            log.info("Session MATIN activée (état: {})", sessions.get(0).getEtat());
        } else if (now.isAfter(sessions.get(0).getHeureCloture()) && now.isBefore(sessions.get(1).getHeureCloture())) {
            sessions.get(1).setActive();
            sessions.get(1).ouvrir();
            log.info("Session APM activée (état: {})", sessions.get(1).getEtat());
        } else if (now.isAfter(sessions.get(1).getHeureCloture()) && now.isBefore(sessions.get(2).getHeureCloture())) {
            sessions.get(2).setActive();
            sessions.get(2).ouvrir();
            log.info("Session SOIR activée (état: {})", sessions.get(2).getEtat());
        } else {
            log.info("Aucune session activée à l'heure: {}", now);
        }
    }

    public List<Session> getActiveSession() {
        return sessions.stream().filter(Session::estOuverte).toList();
    }

    public List<Session> getToutesSessions() {
        return sessions;
    }


    public String openSessionManually(String sessionNom) {
        for (Session s : sessions) {
            if (s.getNom().equalsIgnoreCase(sessionNom)) {
                s.setActive();
                s.forceOpen();
                log.info("Session {} ouverte manuellement.", sessionNom);
                return "Session " + sessionNom + " ouverte manuellement.";
            }
        }
        return "Session " + sessionNom + " non trouvée.";
    }

    public String cloturerSessionManually(String sessionNom) {
        for (Session s : sessions) {
            if (s.getNom().equalsIgnoreCase(sessionNom)) {

                s.forceCloturer();
                log.info("Session {} clôturée manuellement.", sessionNom);
                return "Session " + sessionNom + " clôturée manuellement.";
            }
        }
        return "Session " + sessionNom + " non trouvée.";
    }

    public String fermerSessionManually(String sessionNom) {
        for (Session s : sessions) {
            if (s.getNom().equalsIgnoreCase(sessionNom)) {
                // Solo se puede fermer si la sesión está en estado CLOTUREE
                s.forceFermer();
                log.info("Session {} fermée manuellement.", sessionNom);
                return "Session " + sessionNom + " fermée manuellement.";
            }
        }
        return "Session " + sessionNom + " non trouvée.";
    }

    @Scheduled(cron = "${cafet.session.matin.stop-time}")
    private void closeMatin() {
        sessions.get(0).cloture();
        log.info("Session MATIN clôturée: " + sessions);
    }

    @Scheduled(cron = "${cafet.session.apm.stop-time}")
    private void closeApm() {
        sessions.get(1).cloture();
        log.info("Session APM clôturée: " + sessions);
    }

    @Scheduled(cron = "${cafet.session.soir.stop-time}")
    private void closeSoir() {
        sessions.get(2).cloture();
        log.info("Session SOIR clôturée: " + sessions);
    }
}

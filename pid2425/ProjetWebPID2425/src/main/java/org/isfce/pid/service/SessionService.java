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
        // Création des sessions dans l'ordre chronologique
        sessions.add(new Session("MATIN", extractHeureFromCron(cronMatin)));
        sessions.add(new Session("APM", extractHeureFromCron(cronApm)));
        sessions.add(new Session("SOIR", extractHeureFromCron(cronSoir)));
    }

    /**
     * Extraction de l'heure à partir du cron (les tokens doivent contenir des valeurs horaires).
     * Exemple: "0 30 9 * 0 1-6" crée 9h30.
     *
     * @param cron La chaîne de cron.
     * @return L'heure correspondante.
     */
    private LocalTime extractHeureFromCron(String cron) {
        String[] tokens = cron.split(" ");
        return LocalTime.of(Integer.parseInt(tokens[2]), Integer.parseInt(tokens[1]));
    }

    @PostConstruct
    public void initSessionState() {
        LocalTime now = LocalTime.now();
        // Definimos el hora de activación para MATIN (por ejemplo, 08:00)
        LocalTime activationTime = LocalTime.of(8, 0);

        // Si la hora actual es entre 08:00 y la hora de cierre de MATIN (09:30)
        if (!now.isBefore(activationTime) && now.isBefore(sessions.get(0).getHeureCloture())) {
            sessions.get(0).setActive();
            sessions.get(0).ouvrir();
            log.info("Session MATIN activée lors de l'initialisation (heure actuelle: {})", now);
        }
        // Si la hora actual es entre el cierre de MATIN (09:30) y el cierre de APM (14:30)
        else if (now.isAfter(sessions.get(0).getHeureCloture()) && now.isBefore(sessions.get(1).getHeureCloture())) {
            sessions.get(1).setActive();
            sessions.get(1).ouvrir();
            log.info("Session APM activée lors de l'initialisation (heure actuelle: {})", now);
        }
        // Si la hora actual es entre el cierre de APM (14:30) y el cierre de SOIR (19:30)
        else if (now.isAfter(sessions.get(1).getHeureCloture()) && now.isBefore(sessions.get(2).getHeureCloture())) {
            sessions.get(2).setActive();
            sessions.get(2).ouvrir();
            log.info("Session SOIR activée lors de l'initialisation (heure actuelle: {})", now);
        } else {
            log.info("Aucune session activée lors de l'initialisation (heure actuelle: {})", now);
        }
    }


    /**
     * Retourne les sessions actives.
     *
     * @return Liste des sessions actives.
     */
    public List<Session> getActiveSession() {
        return sessions.stream().filter(Session::estOuverte).toList();
    }

    /**
     * Active les sessions selon le cron défini.
     */
    @Scheduled(cron = "${cafet.session.activate.on-time}")
    private void activateSession() {
        sessions.forEach(Session::setActive);
        log.info("Activation programmée des sessions exécutée.");
    }

    /**
     * Clôture la session du matin.
     */
    @Scheduled(cron = "${cafet.session.matin.stop-time}")
    private void closeMatin() {
        sessions.get(0).cloture();
        log.info("Session MATIN clôturée: " + sessions);
    }

    /**
     * Clôture la session de l'après-midi.
     */
    @Scheduled(cron = "${cafet.session.apm.stop-time}")
    private void closeApm() {
        sessions.get(1).cloture();
        log.info("Session APM clôturée: " + sessions);
    }

    /**
     * Clôture la session du soir.
     */
    @Scheduled(cron = "${cafet.session.soir.stop-time}")
    private void closeSoir() {
        sessions.get(2).cloture();
        log.info("Session SOIR clôturée: " + sessions);
    }
}

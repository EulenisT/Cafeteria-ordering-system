package org.isfce.pid.service;

import org.isfce.pid.dao.ISessionDao;
import org.isfce.pid.model.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SessionService {

	private final ISessionDao sessionDao;

	public SessionService(ISessionDao sessionDao,
						  @Value("${cafet.session.matin.stop-time}") String cronMatin,
						  @Value("${cafet.session.apm.stop-time}") String cronApm,
						  @Value("${cafet.session.soir.stop-time}") String cronSoir) {
		this.sessionDao = sessionDao;
	}

	/**
	 * Inicializa las sesiones en la BD si no existen.
	 */
	@PostConstruct
	public void initSessions() {
		if (sessionDao.count() == 0) {
			LocalTime heureOuvertureMatin = LocalTime.of(7, 0);
			LocalTime heureClotureMatin = LocalTime.of(9, 30);
			LocalTime heureOuvertureApm = LocalTime.of(9, 30);
			LocalTime heureClotureApm = LocalTime.of(14, 30);
			LocalTime heureOuvertureSoir = LocalTime.of(14, 30);
			LocalTime heureClotureSoir = LocalTime.of(19, 30);

			sessionDao.save(new Session("MATIN", heureOuvertureMatin, heureClotureMatin));
			sessionDao.save(new Session("APM", heureOuvertureApm, heureClotureApm));
			sessionDao.save(new Session("SOIR", heureOuvertureSoir, heureClotureSoir));
		}
	}

	public List<Session> getActiveSessions() {
		return sessionDao.findByActiveTrue();
	}

	public List<Session> getAllSessions() {
		return sessionDao.findAll();
	}

	public String closeSessionByName(String sessionNom) {
		Optional<Session> sessionOpt = sessionDao.findByNomAndActiveTrue(sessionNom);
		if (sessionOpt.isEmpty()) {
			return "Aucune session active trouvée avec le nom: " + sessionNom;
		}
		Session session = sessionOpt.get();
		session.close();
		sessionDao.save(session);
		log.info("Session '{}' fermée manuellement.", sessionNom);
		return "Session " + sessionNom + " fermée avec succès.";
	}

	/**
	 * Tarea programada que se ejecuta cada minuto para activar las sesiones.
	 * Activa la sesión si la hora actual es >= heureOuverture y < heureCloture.
	 */
	@Scheduled(cron = "0 * * * * ?")
	public void checkAndActivateSessions() {
		LocalTime now = LocalTime.now();
		List<Session> sessions = sessionDao.findAll();
		for (Session session : sessions) {
			if (!session.isActive() && !now.isBefore(session.getHeureOuverture()) && now.isBefore(session.getHeureCloture())) {
				session.activate();
				sessionDao.save(session);
				log.info("Session '{}' activée automatiquement à {}", session.getNom(), now);

			}
		}
	}

	/**
	 * Tarea programada que se ejecuta cada minuto para cerrar las sesiones.
	 * Cierra la sesión si la hora actual es >= heureCloture.
	 */
	@Scheduled(cron = "0 * * * * ?")
	public void checkAndCloseSessions() {
		LocalTime now = LocalTime.now();
		List<Session> sessions = sessionDao.findByActiveTrue();
		for (Session session : sessions) {
			if (!now.isBefore(session.getHeureCloture())) { // now >= heureCloture
				session.close();
				sessionDao.save(session);
				log.info("Session '{}' fermée automatiquement à {}", session.getNom(), now);
			}
		}
	}
}

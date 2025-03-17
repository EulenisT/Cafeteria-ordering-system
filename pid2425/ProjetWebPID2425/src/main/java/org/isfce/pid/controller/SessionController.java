package org.isfce.pid.controller;

import org.isfce.pid.model.Session;
import org.isfce.pid.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping
    public List<Session> getAllSessions() {
        return sessionService.getSessions();
    }

    @GetMapping("/active")
    public List<Session> getActiveSessions() {
        return sessionService.getActiveSession();
    }

    @PostMapping("/{name}/activate")
    public ResponseEntity<Session> activateSession(@PathVariable("name") String name) {
        Session session = findSession(name);
        if (session != null) {
            session.setActive();
            return ResponseEntity.ok(session);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{name}/force-open")
    public ResponseEntity<Session> forceOpenSession(@PathVariable("name") String name) {
        Session session = findSession(name);
        if (session != null) {
            session.forceOuvrir();
            return ResponseEntity.ok(session);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{name}/force-close")
    public ResponseEntity<Session> forceCloseSession(@PathVariable("name") String name) {
        Session session = findSession(name);
        if (session != null) {
            session.forceCloturer();
            return ResponseEntity.ok(session);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{name}/force-finalize")
    public ResponseEntity<Session> forceFinalizeSession(@PathVariable("name") String name) {
        Session session = findSession(name);
        if (session != null) {
            session.forceFermer();
            return ResponseEntity.ok(session);
        }
        return ResponseEntity.notFound().build();
    }

    private Session findSession(String name) {
        return sessionService.getSessions().stream()
                .filter(s -> s.getNom().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
    }
}

package org.isfce.pid.controller;

import java.util.List;

import org.isfce.pid.model.Session;
import org.isfce.pid.service.SessionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/all")
    public List<Session> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @GetMapping("/active")
    public List<Session> getActiveSessions() {
        return sessionService.getActiveSessions();
    }

    @GetMapping("/close/{sessionNom}")
    public String closeSession(@PathVariable String sessionNom) {
        return sessionService.closeSessionByName(sessionNom);
    }
}

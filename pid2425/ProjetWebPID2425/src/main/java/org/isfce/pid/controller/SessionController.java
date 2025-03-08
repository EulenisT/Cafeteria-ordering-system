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
    public List<Session> getToutesSessions() {
        return sessionService.getToutesSessions();
    }

    @GetMapping("/active")
    public List<Session> getSessionsActives() {
        return sessionService.getSessionsActives();
    }

    @GetMapping("/close/{sessionNom}")
    public String cloturerSession(@PathVariable String sessionNom) {
        return sessionService.cloturerSessionParNom(sessionNom);
    }

    @GetMapping("/deactivate/{sessionNom}")
    public String desactiverSession(@PathVariable String sessionNom) {
        return sessionService.desactiverSessionParNom(sessionNom);
    }

    @GetMapping("/finalize/{sessionNom}")
    public String fermerSession(@PathVariable String sessionNom) {
        return sessionService.fermerSessionParNom(sessionNom);
    }
}

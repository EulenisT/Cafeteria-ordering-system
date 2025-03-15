package org.isfce.pid.controller;

import java.util.List;
import org.isfce.pid.model.Session;
import org.isfce.pid.service.SessionService;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping("/active")
    public List<Session> getActiveSessions() {
        return sessionService.getActiveSession();
    }

    @GetMapping("/all")
    public List<Session> getToutesSessions() {
        return sessionService.getToutesSessions();
    }


    @GetMapping("/open/{sessionNom}")
    @PreAuthorize("hasAnyRole('CAFET','ADMIN')")
    public String openSessionManually(@PathVariable String sessionNom) {
        return sessionService.openSessionManually(sessionNom);
    }


    @GetMapping("/cloturer/{sessionNom}")
    @PreAuthorize("hasAnyRole('CAFET','ADMIN')")
    public String cloturerSessionManually(@PathVariable String sessionNom) {
        return sessionService.cloturerSessionManually(sessionNom);
    }


    @GetMapping("/fermer/{sessionNom}")
    @PreAuthorize("hasAnyRole('CAFET','ADMIN')")
    public String fermerSessionManually(@PathVariable String sessionNom) {
        return sessionService.fermerSessionManually(sessionNom);
    }
}

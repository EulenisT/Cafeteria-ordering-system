//package org.isfce.pid.controller;
//
//import java.util.List;
//import org.isfce.pid.model.Session;
//import org.isfce.pid.service.SessionService;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/sessions")
//public class SessionController {
//
//    private final SessionService sessionService;
//
//    public SessionController(SessionService sessionService) {
//        this.sessionService = sessionService;
//    }
//
//    @GetMapping("/all")
//    public List<Session> getToutesSessions() {
//        return sessionService.getToutesSessions();
//    }
//
//    @GetMapping("/active")
//    public List<Session> getSessionsActives() {
//        return sessionService.getSessionsActives();
//    }
//
//    @GetMapping("/cloturer/{sessionNom}")
//    public String cloturerSession(@PathVariable String sessionNom) {
//        return sessionService.cloturerSessionParNom(sessionNom);
//    }
//
//    @GetMapping("/desactiver/{sessionNom}")
//    public String desactiverSession(@PathVariable String sessionNom) {
//        return sessionService.desactiverSessionParNom(sessionNom);
//    }
//
//    @GetMapping("/fermer/{sessionNom}")
//    public String fermerSession(@PathVariable String sessionNom) {
//        return sessionService.fermerSessionParNom(sessionNom);
//    }
//
//    @GetMapping("/activerEtOuvrir/{sessionNom}")
//    public String activerEtOuvrirSession(@PathVariable String sessionNom) {
//        return sessionService.activerEtOuvrirSessionParNom(sessionNom);
//    }
//
//    @GetMapping("/forcerDesactiver/{sessionNom}")
//    public String forcerDesactiverSession(@PathVariable String sessionNom) {
//        return sessionService.forcerDesactiverSessionParNom(sessionNom);
//    }
//
//}

package org.isfce.pid.controller;

import java.util.List;

import org.isfce.pid.model.Session;
import org.isfce.pid.service.SessionService;
import org.springframework.web.bind.annotation.GetMapping;
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

    // Puedes agregar otros endpoints para, por ejemplo, activar o cerrar manualmente una sesión
    // @PostMapping("/activate")
    // public ResponseEntity<String> activateSessions() {
    //     sessionService.activateSession();
    //     return ResponseEntity.ok("Sesiones activadas");
    // }

    // @PostMapping("/close/matin")
    // public ResponseEntity<String> closeMatin() {
    //     sessionService.closeMatin();
    //     return ResponseEntity.ok("Sesión MATIN cerrada");
    // }

    // De la misma forma, podrías definir endpoints para APM y SOIR o cualquier otra acción.
}

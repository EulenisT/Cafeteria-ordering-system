package org.isfce.pid.controller;

import java.time.LocalDate;
import java.util.List;

import org.isfce.pid.model.dto.ListCmdSessionDto;
import org.isfce.pid.service.CommandeService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")

public class ListCmdSessionController {

    private final CommandeService commandeService;

    public ListCmdSessionController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    /**
     * Récupère les commandes d'une session pour une date donnée.
     * Accessible aux rôles CAFET et ADMIN.
     *
     * @param sessionNom le nom de la session
     * @param date la date des commandes (format ISO)
     * @return la liste des commandes correspondant à la session et à la date
     */
    @GetMapping("/pedidos/session/{sessionNom}/date/{date}")
    @PreAuthorize("hasAnyRole('CAFET','ADMIN')")
    public List<ListCmdSessionDto> getPedidosBySessionAndDate(
            @PathVariable String sessionNom,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return commandeService.getCommandesBySessionAndDate(sessionNom, date);
    }
}

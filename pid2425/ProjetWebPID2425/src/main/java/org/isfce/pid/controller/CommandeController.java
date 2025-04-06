package org.isfce.pid.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.isfce.pid.model.Commande;
import org.isfce.pid.model.dto.CreateCommandeDto;
import org.isfce.pid.model.dto.ListCmdSessionDto;
import org.isfce.pid.service.CommandeService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {

    private CommandeService commandeService;

    public CommandeController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }


    /**
     * Retourne toutes les commandes.
     */
    @GetMapping
    public ResponseEntity<List<Commande>> getAllCommandes() {
        List<Commande> commandes = commandeService.getAllCommandes();
        return ResponseEntity.ok(commandes);
    }

    /**
     * Retourne une commande par son ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable Integer id) {
        Optional<Commande> commandeOpt = commandeService.getCommandeById(id);
        return commandeOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Retourne toutes les commandes d'une session spécifique (identifiée par son nom).
     */
    @GetMapping("/session/{sessionNom}")
    @PreAuthorize("hasAnyRole('CAFET','ADMIN')")
    public ResponseEntity<List<Commande>> getCommandesBySession(@PathVariable String sessionNom) {
        List<Commande> commandes = commandeService.getAllCommandesBySession(sessionNom);
        return ResponseEntity.ok(commandes);
    }

    @GetMapping("/session/{sessionNom}/{date}")
    @PreAuthorize("hasAnyRole('CAFET','ADMIN')")
    public ResponseEntity<List<ListCmdSessionDto>> getCommandesBySessionAndDate(@PathVariable String sessionNom,
                                                                                @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ListCmdSessionDto> commandes = commandeService.getCommandesBySessionAndDate(sessionNom, date);
        return ResponseEntity.ok(commandes);
    }

    /**
     * Crée une nouvelle commande.
     */

    @PostMapping
    public ResponseEntity<?> createCommande(@RequestBody CreateCommandeDto createCommandeDto) {
        try {
            Commande savedCommande = commandeService.saveCommande(createCommandeDto);
            return ResponseEntity.ok(savedCommande);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /**
     * Supprime une commande.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommande(@PathVariable Integer id) {
        try {
            commandeService.deleteCommande(id);
            return ResponseEntity.ok().build();
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        }
    }

}
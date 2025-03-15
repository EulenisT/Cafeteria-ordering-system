package org.isfce.pid.controller;

import java.util.List;
import java.util.Optional;

import org.isfce.pid.model.Commande;
import org.isfce.pid.service.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;

    /**
     * Crée une nouvelle commande.
     */
    @PostMapping
    public ResponseEntity<Commande> createCommande(@RequestBody Commande commande) {
        Commande savedCommande = commandeService.saveCommande(commande);
        return ResponseEntity.ok(savedCommande);
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
}

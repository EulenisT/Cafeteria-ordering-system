package org.isfce.pid.controller;

import java.util.List;
import java.util.Optional;

import org.isfce.pid.dao.IGarnitureDao;
import org.isfce.pid.model.Garniture;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/api/garniture", produces = "application/json")
public class GarnitureController {

	IGarnitureDao dao;

	public GarnitureController(IGarnitureDao dao) {
		this.dao = dao;
	}

	/**
	 * Récupère une garniture par son code.
	 * @param code le code de la garniture
	 */
	@GetMapping("/{code}")
	public ResponseEntity<Garniture> getGarniture(@PathVariable("code") String code) {
		Optional<Garniture> oGarn = dao.findById(code);

		if (oGarn.isPresent())
			return new ResponseEntity<>(oGarn.get(), HttpStatus.OK);
		else
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	}

	/**
	 * Récupère la liste de toutes les garnitures.
	 */
	@GetMapping(params = "all")
	ResponseEntity<List<Garniture>> getListeGarniture() {
		return new ResponseEntity<>(dao.findAll(), HttpStatus.OK);
	}

	/**
	 * Récupère la liste des garnitures selon leur disponibilité.
	 * @param dispo la disponibilité (par défaut true)
	 */
	@GetMapping(params = "dispo")
	ResponseEntity<List<Garniture>> getListeGarnitureDispo(
			@RequestParam(name = "dispo", defaultValue = "true", required = false) boolean dispo) {
		return new ResponseEntity<>(dao.garnitureDiponibles(dispo), HttpStatus.OK);
	}

	/**
	 * Ajoute une nouvelle garniture.
	 * Accessible uniquement aux rôles CAFET et ADMIN.
	 *
	 * @param garniture la garniture à ajouter
	 */

	@PostMapping(path = "/add", consumes = "application/json")
	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	public ResponseEntity<Garniture> addGarniture(@Valid @RequestBody Garniture garniture) {
		garniture = dao.save(garniture);
		return ResponseEntity.ok(garniture);
	}

	/**
	 * Supprime une garniture par son code.
	 * Accessible uniquement aux rôles CAFET et ADMIN.
	 *
	 * @param code le code de la garniture à supprimer
	 */
	@DeleteMapping("/{code}/delete")
	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	public ResponseEntity<String> deleteGarniture(@PathVariable("code") String code) {
		if (dao.existsById(code)) {
			dao.deleteById(code);
			return new ResponseEntity<>(code, HttpStatus.OK);
		} else
			return new ResponseEntity<>(code, HttpStatus.NOT_FOUND);
	}

	/**
	 * Méthode PUT pour mettre à jour la disponibilité d’une garniture.
	 *
	 * @param code le code de la garniture
	 * @param disponible la nouvelle disponibilité
	 */
	@PutMapping("/{code}/disponible")
	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	public ResponseEntity<Garniture> mettreAJourDisponibiliteGarniture(
			@PathVariable("code") String code,
			@RequestParam("disponible") boolean disponible) {

		Optional<Garniture> oGarn = dao.findById(code);
		if (oGarn.isPresent()) {
			Garniture garniture = oGarn.get();
			garniture.setDisponible(disponible);
			dao.save(garniture);
			return ResponseEntity.ok(garniture);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	/**
	 * Méthode de test pour afficher l'utilisateur authentifié.
	 *
	 * @param a l'objet d'authentification
	 * @return l'objet Authentication de l'utilisateur
	 */
	@GetMapping("/demo")
	public Authentication demo(Authentication a) {
	return a;
	}

}

package org.isfce.pid.controller;

import java.util.List;
import java.util.Optional;

import jakarta.validation.Valid;
import org.isfce.pid.dao.ISandwichDao;
import org.isfce.pid.model.Sandwiches;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/sandwichs", produces = "application/json")
@CrossOrigin("*")
public class SandwichsController {
	ISandwichDao dao;

	public SandwichsController(ISandwichDao sandwichDao) {
		this.dao = sandwichDao;
	}

	/**
	 * Récupère un sandwich par son code.
	 * @param code le code du sandwich
	 */
	@GetMapping("/{code}")
	public ResponseEntity<Sandwiches> getSandwichs(@PathVariable("code") String code) {
		Optional<Sandwiches> oSand = dao.findById(code);

		if (oSand.isPresent())
			return new ResponseEntity<>(oSand.get(), HttpStatus.OK);
		else
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	}

	/**
	 * Récupère la liste de tous les sandwichs.
	 */
	@GetMapping(params = "all")
	ResponseEntity<List<Sandwiches>> getListeSandwichs() {
		return new ResponseEntity<>(dao.findAll(), HttpStatus.OK);
	}


	/**
	 * Récupère la liste des sandwichs selon leur disponibilité.
	 * @param dispo la disponibilité (par défaut true)
	 */
	@GetMapping(params = "dispo")
	ResponseEntity<List<Sandwiches>> getListeSandwichsDispo(
			@RequestParam(name = "dispo", defaultValue = "true") boolean dispo) {
		return new ResponseEntity<>(dao.sandwichDiponibles(dispo), HttpStatus.OK);
	}

	/**
	 * Ajoute un nouveau sandwich.
	 * Accessible uniquement aux rôles CAFET et ADMIN.
	 *
	 * @param sandwiches le sandwich à ajouter
	 */
	@PostMapping(path = "/add", consumes = "application/json")
	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	public ResponseEntity<Sandwiches> addSandwiches(@Valid @RequestBody Sandwiches sandwiches) {
		sandwiches = dao.save(sandwiches);
		return ResponseEntity.ok(sandwiches);
	}

	/**
	 * Supprime un sandwich par son code.
	 * Accessible uniquement aux rôles CAFET et ADMIN.
	 *
	 * @param code le code du sandwich à supprimer
	 */
	@DeleteMapping("/{code}/delete")
	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	public ResponseEntity<String> deleteSandwiches(@PathVariable("code") String code) {
		if (dao.existsById(code)) {
			dao.deleteById(code);
			return new ResponseEntity<>(code, HttpStatus.OK);
		} else
			return new ResponseEntity<>(code, HttpStatus.NOT_FOUND);
	}

	/**
	 * Méthode PUT pour mettre à jour la disponibilité d'un sandwich.
	 *
	 * @param code le code du sandwich
	 * @param disponible la nouvelle disponibilité
	 */
	@PutMapping("/{code}/disponible")
	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	public ResponseEntity<Sandwiches> mettreAJourDisponibilite(
			@PathVariable("code") String code,
			@RequestParam("disponible") boolean disponible) {

		Optional<Sandwiches> optSandwich = dao.findById(code);
		if (optSandwich.isPresent()) {
			Sandwiches sandwich = optSandwich.get();
			sandwich.setDisponible(disponible);
			dao.save(sandwich);
			return ResponseEntity.ok(sandwich);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

}

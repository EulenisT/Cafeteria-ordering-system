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

	@GetMapping("/{code}")
	public ResponseEntity<Sandwiches> getSandwichs(@PathVariable("code") String code) {
		Optional<Sandwiches> oSand = dao.findById(code);

		if (oSand.isPresent())
			return new ResponseEntity<>(oSand.get(), HttpStatus.OK);
		else
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	}

	@GetMapping(params = "all")
	ResponseEntity<List<Sandwiches>> getListeSandwichs() {
		return new ResponseEntity<>(dao.findAll(), HttpStatus.OK);
	}
	
//	@PreAuthorize(value="hasAnyRole('USER','CAFET')")
	@GetMapping(params = "dispo")
	ResponseEntity<List<Sandwiches>> getListeSandwichsDispo(
			@RequestParam(name = "dispo", defaultValue = "true") boolean dispo) {
		return new ResponseEntity<>(dao.sandwichDiponibles(dispo), HttpStatus.OK);
	}


	@PostMapping(path = "/add", consumes = "application/json") // précise le format du cours
	public ResponseEntity<Sandwiches> addSandwiches(@Valid @RequestBody Sandwiches sandwiches) {
		sandwiches = dao.save(sandwiches);
		return ResponseEntity.ok(sandwiches);
	}

	@DeleteMapping("/{code}/delete")
	public ResponseEntity<String> deleteSandwiches(@PathVariable("code") String code) {
		if (dao.existsById(code)) {
			dao.deleteById(code);
			return new ResponseEntity<>(code, HttpStatus.OK);
		} else
			return new ResponseEntity<>(code, HttpStatus.NOT_FOUND);
	}

	/**
	 * Méthode PUT pour mettre à jour la disponibilité.
	 */
	@PutMapping("/{code}/disponible")
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

	//test pour voir la personne authentifiée TO DO

}

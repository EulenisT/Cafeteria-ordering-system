package org.isfce.pid.controller;

import java.util.List;
import java.util.Optional;

import org.isfce.pid.dao.IGarnitureDao;
import org.isfce.pid.model.Garniture;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

	@GetMapping("/{code}")
	public ResponseEntity<Garniture> getGarniture(@PathVariable("code") String code) {
		Optional<Garniture> oGarn = dao.findById(code);

		if (oGarn.isPresent())
			return new ResponseEntity<>(oGarn.get(), HttpStatus.OK);
		else
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	}

	@GetMapping(params = "all")
	ResponseEntity<List<Garniture>> getListeGarniture() {
		return new ResponseEntity<>(dao.findAll(), HttpStatus.OK);
	}

	@GetMapping(params = "dispo")
	ResponseEntity<List<Garniture>> getListeGarnitureDispo(
			@RequestParam(name = "dispo", defaultValue = "true", required = false) boolean dispo) {
		return new ResponseEntity<>(dao.garnitureDiponibles(dispo), HttpStatus.OK);
	}

	@PostMapping(path = "/add", consumes = "application/json")
	public ResponseEntity<Garniture> addGarniture(@Valid @RequestBody Garniture garniture) {
		garniture = dao.save(garniture);
		return ResponseEntity.ok(garniture);
	}

	@DeleteMapping("/{code}/delete")
	public ResponseEntity<String> deleteGarniture(@PathVariable("code") String code) {
		if (dao.existsById(code)) {
			dao.deleteById(code);
			return new ResponseEntity<>(code, HttpStatus.OK);
		} else
			return new ResponseEntity<>(code, HttpStatus.NOT_FOUND);
	}

	/**
	 * Méthode PUT pour mettre à jour la disponibilité d’une garniture.
	 */
	@PutMapping("/{code}/disponible")
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
	
	//test pour voir la personne authentifiée
	@GetMapping("/demo")
	public Authentication demo(Authentication a) {
	return a;
	}

}

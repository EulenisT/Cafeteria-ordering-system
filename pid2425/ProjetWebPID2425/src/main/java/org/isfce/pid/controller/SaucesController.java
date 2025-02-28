package org.isfce.pid.controller;
import java.util.List;
import java.util.Optional;
import org.isfce.pid.dao.ISaucesDao;
import org.isfce.pid.model.Sauces;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/api/sauces", produces = "application/json")
public class SaucesController {

    ISaucesDao dao;

    public SaucesController(ISaucesDao dao) {
        this.dao = dao;
    }

    @GetMapping("/{code}")
    public ResponseEntity<Sauces> getSauces(@PathVariable("code") String code) {
        Optional<Sauces> oSau = dao.findById(code);

        if (oSau.isPresent())
            return new ResponseEntity<>(oSau.get(), HttpStatus.OK);
        else
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @GetMapping(params = "all")
    ResponseEntity<List<Sauces>> getListeSauces() {
        return new ResponseEntity<>(dao.findAll(), HttpStatus.OK);
    }

    @GetMapping(params = "dispo")
    ResponseEntity<List<Sauces>> getListeSaucesDispo(
            @RequestParam(name = "dispo", defaultValue = "true", required = false) boolean dispo) {
        return new ResponseEntity<>(dao.saucesDiponibles(dispo), HttpStatus.OK);
    }

    @PostMapping(path = "/add", consumes = "application/json") // précise le format du cours
    public ResponseEntity<Sauces> addGarniture(@Valid @RequestBody Sauces sauces) {
        sauces = dao.save(sauces);
        return ResponseEntity.ok(sauces);
    }

    @DeleteMapping("/{code}/delete")
    public ResponseEntity<String> deleteSauces(@PathVariable("code") String code) {
        if (dao.existsById(code)) {
            dao.deleteById(code);
            return new ResponseEntity<>(code, HttpStatus.OK);
        } else
            return new ResponseEntity<>(code, HttpStatus.NOT_FOUND);
    }

    //test pour voir la personne authentifiée
    @GetMapping("/demo")
    public Authentication demo(Authentication a) {
        return a;
    }

}

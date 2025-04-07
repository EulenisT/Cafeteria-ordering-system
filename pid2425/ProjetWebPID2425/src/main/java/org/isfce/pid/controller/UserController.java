package org.isfce.pid.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.isfce.pid.model.User;
import org.isfce.pid.model.dto.UserDto;
import org.isfce.pid.model.dto.UserRegistrationDto;
import org.isfce.pid.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path = "/api/user", produces = "application/json")
@CrossOrigin("*")
@Slf4j
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	/**
	 * Crédite le solde d'un utilisateur.
	 * Accessible uniquement aux rôles CAFET et ADMIN.
	 *
	 * @param username le nom d'utilisateur
	 * @param montant le montant à créditer
	 */
	@PostMapping(path = "/incsolde")
	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	public ResponseEntity<BigDecimal> updateSolde(@RequestParam("username") String username,
											  @RequestParam("montant") BigDecimal montant) {
		log.info("Crediter: " + username + " montant: " + montant);
		BigDecimal solde = userService.crediterUser(username, montant);
		return ResponseEntity.ok(solde);
	}

	/**
	 * Récupère la liste de tous les utilisateurs.
	 * Accessible uniquement aux rôles CAFET et ADMIN.
	 */
	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	@GetMapping(params = "all")
	public ResponseEntity<List<UserDto>> getAllUser() {
		return ResponseEntity.ok(userService.getAllUserDto());
	}

	/**
	 * Récupère le profil d'un utilisateur.
	 * Accessible pour CAFET ou si le nom d'utilisateur correspond à l'utilisateur authentifié.
	 *
	 * @param username le nom d'utilisateur (identifiant)
	 * @param auth le token d'authentification JWT
	 */
	@GetMapping("/profile/{id}")
	@PreAuthorize("hasRole('CAFET') or #username == authentication.name")
	public ResponseEntity<UserDto> getUserInfo(@PathVariable("id") String username, JwtAuthenticationToken auth) {
		var oUser = userService.getUserById(username);
		UserDto userDto;
		User u;
		if (oUser.isPresent())
			u = oUser.get();
		else {
			var token = auth.getToken();
			String email = token.getClaimAsString("email");
			String nom = token.getClaimAsString("family_name");
			String prenom = token.getClaimAsString("given_name");
			u = userService.addUser(new User(username, email, nom, prenom, BigDecimal.ZERO, new ArrayList<>()));
		}
		userDto = new UserDto(username, u.getEmail(), u.getSolde());
		return ResponseEntity.ok(userDto);
	}

	/**
	 * Débite le solde d'un utilisateur.
	 *
	 * @param username le nom d'utilisateur
	 * @param montant le montant à débiter
	 */
	@PostMapping(path = "/updatesolde")
	public ResponseEntity<BigDecimal> updateSoldeDes(@RequestParam("username") String username,
													 @RequestParam("montant") BigDecimal montant) {
		log.info("Débiter: " + username + " montant: " + montant);
		BigDecimal solde = userService.debiterUser(username, montant);
		return ResponseEntity.ok(solde);
	}

	/**
	 * Enregistre un nouvel utilisateur.
	 * @param registrationDto les informations d'enregistrement de l'utilisateur
	 */
	@PostMapping("/register")
	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	public ResponseEntity<UserDto> registerUser(@RequestBody UserRegistrationDto registrationDto) {
		User savedUser = userService.registerUser(registrationDto);
		UserDto userDto = new UserDto(savedUser.getUsername(), savedUser.getEmail(), savedUser.getSolde());
		return ResponseEntity.ok(userDto);
	}
}

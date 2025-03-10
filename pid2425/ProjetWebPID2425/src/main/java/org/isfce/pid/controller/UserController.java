package org.isfce.pid.controller;

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

	@PostMapping(path = "/incsolde")
	public ResponseEntity<Double> updateSolde(@RequestParam("username") String username,
											  @RequestParam("montant") Double montant) {
		log.info("Crediter: " + username + " montant: " + montant);
		Double solde = userService.crediterUser(username, montant);
		return ResponseEntity.ok(solde);
	}

	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	@GetMapping(params = "all")
	public ResponseEntity<List<UserDto>> getAllUser() {
		return ResponseEntity.ok(userService.getAllUserDto());
	}

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
			u = userService.addUser(new User(username, email, nom, prenom, 0.0));
		}
		userDto = new UserDto(username, u.getEmail(), u.getSolde());
		return ResponseEntity.ok(userDto);
	}

	@PostMapping(path = "/updatesolde")
	public ResponseEntity<Double> updateSoldeDes(@RequestParam("username") String username,
												 @RequestParam("montant") Double montant) {
		log.info("Débiter: " + username + " montant: " + montant);
		Double solde = userService.debiterUser(username, montant);
		return ResponseEntity.ok(solde);
	}

	@PostMapping("/register")
	@PreAuthorize("hasAnyRole('CAFET','ADMIN')")
	public ResponseEntity<UserDto> registerUser(@RequestBody UserRegistrationDto registrationDto) {
		User savedUser = userService.registerUser(registrationDto);
		UserDto userDto = new UserDto(savedUser.getUsername(), savedUser.getEmail(), savedUser.getSolde());
		return ResponseEntity.ok(userDto);
	}
}

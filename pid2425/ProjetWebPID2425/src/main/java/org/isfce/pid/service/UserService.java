package org.isfce.pid.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.ws.rs.core.Response;
import org.isfce.pid.controller.exceptions.NotExistException;
import org.isfce.pid.dao.IUserDao;
import org.isfce.pid.model.User;
import org.isfce.pid.model.dto.UserDto;
import org.isfce.pid.model.dto.UserRegistrationDto;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

@Transactional
@Service
@Slf4j
public class UserService {
	private final IUserDao daoUser;

	public UserService(IUserDao daoUser) {
		this.daoUser = daoUser;
	}

	public Double crediterUser(String username, Double montant) {
		var oUser = daoUser.findById(username);
		User user = oUser.orElseThrow(() -> new NotExistException(username));
		Double solde = user.crediter(montant);
		daoUser.save(user);
		return solde;
	}

	public Double debiterUser(String username, Double montant) {
		var oUser = daoUser.findById(username);
		User user = oUser.orElseThrow(() -> new NotExistException(username));
		if (user.getSolde() >= montant) {
			Double solde = user.debiter(montant);
			daoUser.save(user);
			return solde;
		} else {
			throw new IllegalArgumentException("Fonds insuffisants pour l'utilisateur: " + username);
		}
	}

	public List<UserDto> getAllUserDto() {
		return daoUser.getAllUserDto();
	}

	public Optional<User> getUserById(String username) {
		return daoUser.findById(username);
	}

	public User addUser(User user) {
		return daoUser.save(user);
	}

	public User registerUser(UserRegistrationDto registrationDto) {
		// Configura el Keycloak Admin Client para el realm "CAFET"
		Keycloak keycloakAdmin = KeycloakBuilder.builder()
				.serverUrl("http://localhost:8084/")  // URL de Keycloak
				.realm("master")                      // Se conecta al realm master para administración
				.username("admin")                    // Usuario administrador
				.password("admin")                    // Contraseña del administrador
				.clientId("admin-cli")                // ClientID para administración
				.build();

		// Crear la representación del usuario para Keycloak
		UserRepresentation userRep = new UserRepresentation();
		userRep.setUsername(registrationDto.username());
		userRep.setEmail(registrationDto.email());
		userRep.setFirstName(registrationDto.prenom());
		userRep.setLastName(registrationDto.nom());
		userRep.setEnabled(true);

		// Crear el usuario en el realm deseado ("CAFET")
		Response response = keycloakAdmin.realm("CAFET").users().create(userRep);
		if (response.getStatus() != 201) {
			throw new RuntimeException("Erreur lors de l’enregistrement de l’utilisateur dans Keycloak: " + response.getStatusInfo());
		}
		// Extraer el ID del usuario creado (a partir de la URL de la cabecera Location)
		String userId = response.getLocation().getPath().replaceAll(".*/", "");

		// Configurar la contraseña en Keycloak
		CredentialRepresentation credential = new CredentialRepresentation();
		credential.setTemporary(false);
		credential.setType(CredentialRepresentation.PASSWORD);
		credential.setValue(registrationDto.password());
		keycloakAdmin.realm("CAFET").users().get(userId).resetPassword(credential);

		// Asignar el rol "USER" al usuario
		RoleRepresentation userRole = keycloakAdmin.realm("CAFET").roles().get("USER").toRepresentation();
		keycloakAdmin.realm("CAFET").users().get(userId).roles().realmLevel().add(List.of(userRole));

		// Registrar el usuario en la base de datos (sin almacenar la contraseña)
		User newUser = new User(
				registrationDto.username(),
				registrationDto.email(),
				registrationDto.nom(),
				registrationDto.prenom(),
				0.0,
				new ArrayList<>()
		);
		return daoUser.save(newUser);
	}

}

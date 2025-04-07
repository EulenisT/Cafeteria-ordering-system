package org.isfce.pid.service;

import java.math.BigDecimal;
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

	/**
	 * Crédite le solde d'un utilisateur.
	 *
	 * @param username le nom de l'utilisateur
	 * @param montant le montant à créditer
	 * @return le nouveau solde de l'utilisateur
	 * @throws NotExistException si l'utilisateur n'existe pas
	 */
	public BigDecimal crediterUser(String username, BigDecimal montant) {
		var oUser = daoUser.findById(username);
		User user = oUser.orElseThrow(() -> new NotExistException(username));
		BigDecimal solde = user.crediter(montant);
		daoUser.save(user);
		return solde;
	}

	/**
	 * Débite le solde d'un utilisateur.
	 *
	 * @param username le nom de l'utilisateur
	 * @param montant le montant à débiter
	 * @return le nouveau solde de l'utilisateur
	 * @throws NotExistException si l'utilisateur n'existe pas
	 * @throws IllegalArgumentException si les fonds sont insuffisants
	 */
	public BigDecimal debiterUser(String username, BigDecimal montant) {
		var oUser = daoUser.findById(username);
		User user = oUser.orElseThrow(() -> new NotExistException(username));
		if (user.getSolde().compareTo(montant) >= 0) {
			BigDecimal solde = user.debiter(montant);
			daoUser.save(user);
			return solde;
		} else {
			throw new IllegalArgumentException("Fonds insuffisants pour l'utilisateur: " + username);
		}
	}

	/**
	 * Récupère la liste de tous les utilisateurs sous forme de UserDto.
	 */
	public List<UserDto> getAllUserDto() {
		return daoUser.getAllUserDto();
	}

	/**
	 * Récupère un utilisateur par son identifiant.
	 * @param username le nom de l'utilisateur
	 */
	public Optional<User> getUserById(String username) {
		return daoUser.findById(username);
	}

	/**
	 * Ajoute un nouvel utilisateur dans la base de données.
	 * @param user l'utilisateur à ajouter
	 */
	public User addUser(User user) {
		return daoUser.save(user);
	}

	/**
	 * Enregistre un nouvel utilisateur dans Keycloak et dans la base de données.
	 * Cette méthode effectue les opérations suivantes :
	 * - Configuration du Keycloak Admin Client pour le realm "CAFET".
	 * - Création de la représentation de l'utilisateur pour Keycloak.
	 * - Création de l'utilisateur dans le realm "CAFET".
	 * - Configuration du mot de passe de l'utilisateur dans Keycloak.
	 * - Attribution du rôle "USER" à l'utilisateur dans Keycloak.
	 * - Enregistrement de l'utilisateur dans la base de données (sans mot de passe).
	 *
	 * @param registrationDto le DTO contenant les informations d'enregistrement de l'utilisateur
	 * @return l'utilisateur enregistré dans la base de données
	 * @throws RuntimeException si une erreur survient lors de l'enregistrement dans Keycloak
	 */
	public User registerUser(UserRegistrationDto registrationDto) {
		// Configuration du client d'administration Keycloak pour le realm "CAFET"
		Keycloak keycloakAdmin = KeycloakBuilder.builder()
				.serverUrl("http://localhost:8084/")   // URL de Keycloak
				.realm("master")                       // Connexion au realm master pour l'administration
				.username("admin")                     // Nom d'utilisateur administrateur
				.password("admin")                     // Mot de passe administrateur
				.clientId("admin-cli")                 // ClientId pour l'administration
				.build();

		// Création de la représentation de l'utilisateur pour Keycloak
		UserRepresentation userRep = new UserRepresentation();
		userRep.setUsername(registrationDto.username());
		userRep.setEmail(registrationDto.email());
		userRep.setFirstName(registrationDto.prenom());
		userRep.setLastName(registrationDto.nom());
		userRep.setEnabled(true);

		// Création de l'utilisateur dans le realm "CAFET"
		Response response = keycloakAdmin.realm("CAFET").users().create(userRep);
		if (response.getStatus() != 201) {
			throw new RuntimeException("Erreur lors de l’enregistrement de l’utilisateur dans Keycloak: " + response.getStatusInfo());
		}
		// Extraction de l'ID de l'utilisateur créé à partir de l'URL de la réponse
		String userId = response.getLocation().getPath().replaceAll(".*/", "");

		// Configuration du mot de passe dans Keycloak
		CredentialRepresentation credential = new CredentialRepresentation();
		credential.setTemporary(false);
		credential.setType(CredentialRepresentation.PASSWORD);
		credential.setValue(registrationDto.password());
		keycloakAdmin.realm("CAFET").users().get(userId).resetPassword(credential);

		// Attribution du rôle "USER" à l'utilisateur dans Keycloak
		RoleRepresentation userRole = keycloakAdmin.realm("CAFET").roles().get("USER").toRepresentation();
		keycloakAdmin.realm("CAFET").users().get(userId).roles().realmLevel().add(List.of(userRole));

		// Enregistrement de l'utilisateur dans la base de données (sans mot de passe)
		User newUser = new User(
				registrationDto.username(),
				registrationDto.email(),
				registrationDto.nom(),
				registrationDto.prenom(),
				BigDecimal.ZERO,
				new ArrayList<>()
		);
		return daoUser.save(newUser);
	}

}

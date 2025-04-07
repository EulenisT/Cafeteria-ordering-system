package org.isfce.pid.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "TUSER")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Getter
@Setter
public class User {
	@EqualsAndHashCode.Include
	@Id
	@Column(name = "USER_NAME", length = 50, nullable = false)
	private String username;
	@Column(name = "EMAIL", length = 50, nullable = false)
	@Email
	private String email;
	@Column(name = "NOM", length = 30, nullable = false)
	private String nom;
	@Column(name = "PRENOM", length = 30)
	private String prenom;
	@Column(name = "SOLDE", precision = 6, scale = 2, nullable = false)
	private BigDecimal solde;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<Commande> commandes = new ArrayList<>();

	public User(String email, String username, String nom, String prenom, BigDecimal solde) {
		this.email = email;
		this.username = username;
		this.nom = nom;
		this.prenom = prenom;
		this.solde = solde;
	}

	public BigDecimal crediter(BigDecimal montant) {
		if (montant.compareTo(BigDecimal.ZERO) < 0) {
			throw new IllegalArgumentException("Le montant doit être positif");
		}
		solde = solde.add(montant);
		return solde;
	}

	public BigDecimal debiter(BigDecimal montant) {
		if (montant.compareTo(BigDecimal.ZERO) < 0) {
			throw new IllegalArgumentException("Le montant doit être positif");
		}
		if (solde.compareTo(montant) < 0) {
			throw new IllegalArgumentException("Fonds insuffisants pour l'utilisateur");
		}
		solde = solde.subtract(montant);
		return solde;
	}
}
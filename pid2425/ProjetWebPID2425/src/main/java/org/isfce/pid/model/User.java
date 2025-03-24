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
	@Column(length = 50, nullable = false)
	private String username;
	@Column(length = 50, nullable = false)
	@Email
	private String email;
	@Column(length = 30, nullable = false)
	private String nom;
	@Column(length = 30)
	private String prenom;
	@Column
	private Double solde;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<Commande> commandes = new ArrayList<>();

	public Double crediter(Double montant) {
		assert montant >= 0 : "Le montant doit être positif";
		solde = solde + montant;
		return solde;
	}

	public Double debiter(Double montant) {
		assert montant >= 0 : "Le montant doit être positif";
		this.solde -= montant;
		return this.solde;
	}

}

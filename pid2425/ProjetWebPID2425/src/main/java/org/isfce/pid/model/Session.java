package org.isfce.pid.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TSESSION")
public class Session {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "NOM", nullable = false, unique = true)
	private String nom;

	@Column(name = "ACTIVE", nullable = false)
	private boolean active;

	@Column(name = "HEURE_OUVERTURE", nullable = false)
	private LocalTime heureOuverture;

	@Column(name = "HEURE_CLOTURE", nullable = false)
	private LocalTime heureCloture;

	public Session(String nom, LocalTime heureOuverture, LocalTime heureCloture) {
		this.nom = nom;
		this.heureOuverture = heureOuverture;
		this.heureCloture = heureCloture;
		this.active = false;
	}

	public boolean isActive() {
		return active;
	}

	public void activate() {
		this.active = true;
	}

	public void close() {
		this.active = false;
	}
}

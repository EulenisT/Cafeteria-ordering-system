package org.isfce.pid.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalTime;

@Getter
@ToString
@NoArgsConstructor
@Entity
@Table(name = "TSESSION")
public class Session {

	public enum EtatSession {
		OUVERTE,
		CLOTUREE,
		FERME
	};

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "NOM", nullable = false, unique = true)
	private String nom;

	@Enumerated(EnumType.STRING)
	@Column(name = "ETAT", nullable = false)
	private EtatSession etat;

	@Column(name = "ACTIVE", nullable = false)
	private Boolean active;

	@Column(name = "HEURE_CLOTURE", nullable = false)
	private LocalTime heureCloture;

	/**
	 * Constructor que recibe el nombre y la hora de cierre.
	 * Se inicializa active a false y el estado a FERMEE.
	 */
	public Session(String nom, LocalTime heureCloture) {
		this.nom = nom;
		this.heureCloture = heureCloture;
		this.active = false;
		this.etat = EtatSession.FERME;
	}

	/**
	 * Activa la sesión, pero mantiene el estado en FERMEE.
	 * Luego se podrá abrir mediante abrir().
	 */
	public void setActive() {
		this.active = true;
		this.etat = EtatSession.FERME;
	}

	/**
	 * Desactiva la sesión siempre que no esté en estado CLOTUREE.
	 */
	public void desactiveSession() {
		if (!EtatSession.CLOTUREE.equals(etat)) {
			this.active = false;
		}
	}

	/**
	 * Indica si la sesión está realmente abierta para operaciones.
	 * Se requiere que esté activa y en estado OUVERTE.
	 */
	public boolean estOuverte() {
		return active && etat == EtatSession.OUVERTE;
	}

	/**
	 * Abre la sesión. Solo se abre si está activa, en estado FERMEE
	 * y la hora de cierre aún no ha pasado.
	 */
	public void ouvrir() {
		if (active && EtatSession.FERME.equals(etat) && this.heureCloture.isAfter(LocalTime.now())) {
			etat = EtatSession.OUVERTE;
		}
	}

	/**
	 * Cierra la sesión de forma automática.
	 * Solo se cierra si la sesión está activa y en estado OUVERTE.
	 */
	public void cloture() {
		if (active && EtatSession.OUVERTE.equals(etat)) {
			etat = EtatSession.CLOTUREE;
		}
	}

	/**
	 * Cierra definitivamente la sesión (por acción manual, por ejemplo).
	 * Solo se permite si la sesión estaba ya en estado CLOTUREE.
	 */
	public void fermer() {
		if (active && EtatSession.CLOTUREE.equals(etat)) {
			etat = EtatSession.FERME;
		}
	}
}

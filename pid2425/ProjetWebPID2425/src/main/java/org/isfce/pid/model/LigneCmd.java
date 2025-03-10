package org.isfce.pid.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TLIGNE_CMD")
public class LigneCmd {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer num;

	@ManyToOne
	@JoinColumn(name = "FK_COMMANDE", nullable = false)
	@JsonBackReference
	private Commande cmd;

	@Column(name = "TYPE", nullable = false)
	private String type;

	@Column(name = "NOM_SANDWICH", nullable = false)
	private String nomSandwich;

	@Column(name = "DESCRIPTION")
	private String description;

	@Column(name = "PRIX", nullable = false)
	private Double prix;

	public LigneCmd(Commande cmd, String nomSandwich, String type, String description, Double prix) {
		this.cmd = cmd;
		this.nomSandwich = nomSandwich;
		this.type = type;
		this.description = description;
		this.prix = prix;
	}

	@PrePersist
	@PreUpdate
	private void prePersistOrUpdate() {
		if (nomSandwich == null || nomSandwich.trim().isEmpty()) {
			nomSandwich = "Personnalise";
		}
		if (description == null) {
			description = "Sandwich tout préparé";
		}
	}
}

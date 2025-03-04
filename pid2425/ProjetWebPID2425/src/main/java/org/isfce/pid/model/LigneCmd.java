package org.isfce.pid.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
	private Commande cmd;

	@Column(name = "TYPE", nullable = false)
	private String type;

	@Column(name = "NOM_SANDWICH")
	private String nomSandwich;

	@Column(name = "DESCRIPTION")
	private String description;

	@Column(name = "PRIX", nullable = false)
	private Double prix;

	@Column(name = "QT", nullable = false)
	private int qt;

	public LigneCmd(Commande cmd, String nomSandwich, String type, String description, Double prix, int qt) {
		this.cmd = cmd;
		this.nomSandwich = nomSandwich;
		this.type = type;
		this.description = description;
		this.prix = prix;
		this.qt = qt;
	}

	@PrePersist
	public void prePersist() {
		if (this.nomSandwich == null) {
			this.nomSandwich = "Sandwich personnalisé";
		}

	}
}

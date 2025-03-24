package org.isfce.pid.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

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

	@Column(name = "NOM_SANDWICH", nullable = false)
	private String nomSandwich;

	@Column(name = "DESCRIPTION")
	private String description;

	@Column(name = "PRIX", nullable = false, precision = 8, scale = 2)
	private BigDecimal prix;

	public LigneCmd(Commande cmd, String nomSandwich,String description, BigDecimal prix) {
		this.cmd = cmd;
		this.nomSandwich = nomSandwich;
		this.description = description;
		this.prix = prix;
	}

}

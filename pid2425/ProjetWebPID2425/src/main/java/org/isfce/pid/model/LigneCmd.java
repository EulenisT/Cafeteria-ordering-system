package org.isfce.pid.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "TLIGNE_CMD")
public class LigneCmd {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "NUM", nullable = false)
	private Integer num;

	@ManyToOne
	@JoinColumn(name = "FK_COMMANDE", referencedColumnName = "NUM", nullable = false)
	@JsonBackReference
	private Commande cmd;

	@Column(name = "NOM_SANDWICH", nullable = false)
	private String nomSandwich;

	@Column(name = "DESCRIPTION")
	private String description;

	@Column(name = "PRIX", nullable = false, precision = 6, scale = 2)
	private BigDecimal prix;

	@ManyToOne
	@JoinColumn(name = "FK_ARTICLE", referencedColumnName = "CODE", nullable = false)
	private Article article;


}

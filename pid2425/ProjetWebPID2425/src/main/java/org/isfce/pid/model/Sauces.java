package org.isfce.pid.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.*;

import java.math.BigDecimal;

@Entity(name = "TSAUCES")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class Sauces extends Article {
	public Sauces(String code, String nom, boolean dispo, BigDecimal prix) {
		super(code, nom, dispo);
		this.prix = prix;
	}

	@Getter
	@Setter
	@Column(precision = 4, scale = 2)
	private BigDecimal prix;
}

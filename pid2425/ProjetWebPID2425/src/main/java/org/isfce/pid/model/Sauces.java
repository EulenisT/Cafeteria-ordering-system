package org.isfce.pid.model;

import jakarta.persistence.Entity;
import lombok.*;


@Entity(name = "TSAUCES")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class Sauces extends Article {
	public Sauces(String code, String nom, boolean dispo) {
		super(code, nom, dispo);
	}
}

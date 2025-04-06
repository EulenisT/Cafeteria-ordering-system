package org.isfce.pid.model;

import jakarta.persistence.Entity;
import lombok.*;

@Entity(name = "TGARNITURE")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class Garniture extends Article {
	public Garniture(String code, String nom, boolean dispo) {
		super(code, nom, dispo);
	}
}

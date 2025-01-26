package org.isfce.pid.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity(name = "TGARNITURE")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Garniture {
	@Id
	@Column(length = 4,updatable = false)
	@NotBlank
	private String code;
	
	@Column(length = 30,nullable = false,updatable = false )
	@NotBlank
	private String nom;
	
	@Column
	private boolean disponible;
}

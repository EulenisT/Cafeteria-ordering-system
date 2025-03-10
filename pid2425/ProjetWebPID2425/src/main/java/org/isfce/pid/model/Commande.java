package org.isfce.pid.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TCOMMANDE")
public class Commande {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CODE")
	private Integer num;

	@Column(name = "DATE", nullable = false)
	private LocalDate date;

	@Column(name = "SESSION_NOM", nullable = false)
	private String sessionNom;

	@OneToMany(cascade = CascadeType.PERSIST, mappedBy = "cmd", fetch = FetchType.EAGER)
	private List<LigneCmd> lignes = new ArrayList<>();

	public Commande(LocalDate date, String sessionNom) {
		this.date = date;
		this.sessionNom = sessionNom;
	}
}

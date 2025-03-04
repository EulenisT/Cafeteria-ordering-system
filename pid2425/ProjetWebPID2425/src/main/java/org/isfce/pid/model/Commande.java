package org.isfce.pid.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@ToString(exclude = {"lignes"})
@EqualsAndHashCode(exclude = {"lignes"})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "TCOMMANDE")
public class Commande {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CODE")
	private Integer num;

	@Column(name = "DATE", nullable = false)
	private LocalDate date;

	@OneToMany(cascade = CascadeType.PERSIST, mappedBy = "cmd", fetch = FetchType.EAGER)
	private List<LigneCmd> lignes = new ArrayList<>();

	public Commande(LocalDate date) {
		super();
		this.date = date;
	}
}

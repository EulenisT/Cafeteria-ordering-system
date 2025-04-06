package org.isfce.pid.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "TCOMMANDE")
public class Commande {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "NUM")
	private Integer num;

	@Column(name = "DATE", nullable = false)
	private LocalDate date;

	@Column(name = "SESSION_NOM", nullable = false)
	private String sessionNom;

	@ManyToOne(optional = false)
	@JoinColumn(name = "USERNAME", referencedColumnName = "USER_NAME")
	private User user;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "cmd", fetch = FetchType.EAGER)
	@JsonManagedReference
	private List<LigneCmd> lignes = new ArrayList<>();

}

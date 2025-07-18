package org.isfce.pid.dao;

import org.isfce.pid.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ICommandeDao extends JpaRepository<Commande, Integer> {

    List<Commande> findBySessionNom(String sessionNom);

    List<Commande> findBySessionNomAndDate(String sessionNom, LocalDate date);
}

package org.isfce.pid.dao;

import org.isfce.pid.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ICommandeDao extends JpaRepository<Commande, Integer> {

    List<Commande> findBySessionNom(String sessionNom);
}

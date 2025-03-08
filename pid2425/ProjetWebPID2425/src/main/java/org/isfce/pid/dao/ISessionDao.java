package org.isfce.pid.dao;

import org.isfce.pid.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ISessionDao extends JpaRepository<Session, Long> {

    List<Session> findByActiveTrue();

    Optional<Session> findByNomAndActiveTrue(String nom);
}

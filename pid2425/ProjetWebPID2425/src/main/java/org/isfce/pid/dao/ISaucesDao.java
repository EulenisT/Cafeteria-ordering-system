package org.isfce.pid.dao;

import org.isfce.pid.model.Sauces;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ISaucesDao extends IArticleDao<Sauces>{
    @Query("from TSAUCES s where s.disponible=:dispo")
    List<Sauces> saucesDiponibles(boolean dispo);
}

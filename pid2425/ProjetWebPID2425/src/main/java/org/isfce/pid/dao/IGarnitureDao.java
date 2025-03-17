package org.isfce.pid.dao;

import java.util.List;

import org.isfce.pid.model.Garniture;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IGarnitureDao extends IArticleDao<Garniture> {

	@Query("from TGARNITURE  g where g.disponible=:dispo")
	List<Garniture> garnitureDiponibles(boolean dispo);

}

package com.eam.document.repository;

import com.eam.document.entity.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RapportRepository extends JpaRepository<Rapport, Long> {
	List<Rapport> findByInterventionId(Long interventionId);
}

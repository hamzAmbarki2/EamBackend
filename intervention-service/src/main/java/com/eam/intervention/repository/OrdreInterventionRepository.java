package com.eam.intervention.repository;

import com.eam.intervention.entity.OrdreIntervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdreInterventionRepository extends JpaRepository<OrdreIntervention, Long> {
    // You can add custom query methods here if needed
}
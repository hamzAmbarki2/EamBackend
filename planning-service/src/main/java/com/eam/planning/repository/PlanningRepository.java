package com.eam.planning.repository;

import com.eam.planning.entity.Planning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long> {
    // You can add custom query methods here if needed
}
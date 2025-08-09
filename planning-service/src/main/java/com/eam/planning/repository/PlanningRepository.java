package com.eam.planning.repository;

import com.eam.planning.entity.Planning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.eam.common.enums.DepartmentType;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long> {
    // You can add custom query methods here if needed
    List<Planning> findByDepartment(DepartmentType department);
}
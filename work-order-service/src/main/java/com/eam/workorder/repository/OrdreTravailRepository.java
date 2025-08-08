package com.eam.workorder.repository;

import com.eam.workorder.entity.OrdreTravail;
import com.eam.common.enums.DepartmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdreTravailRepository extends JpaRepository<OrdreTravail, Long> {
    // You can add custom query methods here if needed
    List<OrdreTravail> findByDepartment(DepartmentType department);
    List<OrdreTravail> findByAssignedTo(Long assignedTo);
}
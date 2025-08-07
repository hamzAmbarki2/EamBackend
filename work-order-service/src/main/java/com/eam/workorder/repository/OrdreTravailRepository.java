package com.eam.workorder.repository;

import com.eam.workorder.entity.OrdreTravail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdreTravailRepository extends JpaRepository<OrdreTravail, Long> {
    // You can add custom query methods here if needed
}
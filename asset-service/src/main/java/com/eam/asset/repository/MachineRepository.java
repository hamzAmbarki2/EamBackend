package com.eam.asset.repository;

import com.eam.asset.entity.Machine;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    
    // ===== ODOO INTEGRATION QUERIES =====
    
    /**
     * Find machine by Odoo Asset ID
     */
    Optional<Machine> findByOdooAssetId(Integer odooAssetId);
    
    /**
     * Find machines that are synced with Odoo (have odooAssetId)
     */
    @Query("SELECT m FROM Machine m WHERE m.odooAssetId IS NOT NULL")
    List<Machine> findMachinesSyncedWithOdoo();
    
    /**
     * Find machines that are NOT synced with Odoo (no odooAssetId)
     */
    @Query("SELECT m FROM Machine m WHERE m.odooAssetId IS NULL")
    List<Machine> findMachinesNotSyncedWithOdoo();
    
    /**
     * Find machines imported from Odoo
     */
    @Query("SELECT m FROM Machine m WHERE m.importedFromOdoo = true")
    List<Machine> findMachinesImportedFromOdoo();
    
    /**
     * Count machines synced with Odoo
     */
    @Query("SELECT COUNT(m) FROM Machine m WHERE m.odooAssetId IS NOT NULL")
    long countMachinesSyncedWithOdoo();
    
    /**
     * Count machines NOT synced with Odoo
     */
    @Query("SELECT COUNT(m) FROM Machine m WHERE m.odooAssetId IS NULL")
    long countMachinesNotSyncedWithOdoo();
    
    /**
     * Count machines imported from Odoo
     */
    @Query("SELECT COUNT(m) FROM Machine m WHERE m.importedFromOdoo = true")
    long countMachinesImportedFromOdoo();
    
    /**
     * Find machines with pagination for sync operations
     */
    @Query("SELECT m FROM Machine m ORDER BY m.id")
    List<Machine> findMachinesPaginated(Pageable pageable);
    
    /**
     * Find machines by name (for Odoo sync matching)
     */
    List<Machine> findByNomContainingIgnoreCase(String nom);
    
    /**
     * Find machines by type (for Odoo sync filtering)
     */
    List<Machine> findByType(String type);
    
    /**
     * Find machines by status (for Odoo sync filtering)
     */
    List<Machine> findByStatut(com.eam.asset.enums.Statut statut);
    
    /**
     * Find machines that need sync (modified after last sync)
     */
    @Query("SELECT m FROM Machine m WHERE m.lastOdooSync IS NULL OR m.lastOdooSync < :lastModified")
    List<Machine> findMachinesNeedingSync(@Param("lastModified") java.util.Date lastModified);
    
    /**
     * Find machines by Odoo state
     */
    List<Machine> findByOdooState(String odooState);
    
    /**
     * Check if machine exists by name and location (for duplicate prevention)
     */
    @Query("SELECT m FROM Machine m WHERE m.nom = :nom AND m.emplacement = :emplacement")
    Optional<Machine> findByNomAndEmplacement(@Param("nom") String nom, @Param("emplacement") String emplacement);
}

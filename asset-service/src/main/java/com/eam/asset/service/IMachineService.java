package com.eam.asset.service;

import com.eam.asset.entity.Machine;
import java.util.List;
import java.util.Map;

public interface IMachineService {
    
    // ===== EXISTING EAM METHODS (PRESERVED) =====
    List<Machine> retrieveAllMachines();
    Machine retrieveMachine(Long id);
    Machine addMachine(Machine machineDto);
    void removeMachine(Long id);
    Machine modifyMachine(Machine machineDto);
    
    // ===== NEW ODOO INTEGRATION METHODS =====
    
    /**
     * Find machine by Odoo Asset ID
     */
    Machine findByOdooAssetId(Integer odooAssetId);
    
    /**
     * Get machines with pagination for sync operations
     */
    List<Machine> findMachinesPaginated(int page, int size);
    
    /**
     * Find machines that are synced with Odoo
     */
    List<Machine> findMachinesSyncedWithOdoo();
    
    /**
     * Find machines that are NOT synced with Odoo
     */
    List<Machine> findMachinesNotSyncedWithOdoo();
    
    /**
     * Mark machine as synced with Odoo
     */
    Machine markAsSyncedWithOdoo(Long machineId, Integer odooAssetId, String odooState, Double assetValue);
    
    /**
     * Create machine from Odoo data
     */
    Machine createFromOdooData(Map<String, Object> odooData);
    
    /**
     * Count methods for statistics
     */
    long countAllMachines();
    long countMachinesSyncedWithOdoo();
    long countMachinesNotSyncedWithOdoo();
    long countMachinesImportedFromOdoo();
    
    /**
     * Bulk update for sync operations
     */
    int bulkUpdateForSync(List<Map<String, Object>> machineUpdates);
}

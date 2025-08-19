package com.eam.asset.service;

import com.eam.asset.entity.Machine;
import com.eam.asset.repository.MachineRepository;
import com.eam.asset.enums.Statut;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.text.ParseException;

@Service
@AllArgsConstructor
public class MachineServiceImpl implements IMachineService {

    private final MachineRepository machineRepository;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    // ===== EXISTING EAM METHODS (PRESERVED) =====

    @Override
    public List<Machine> retrieveAllMachines() {
        return machineRepository.findAll();
    }

    @Override
    public Machine retrieveMachine(Long id) {
        return machineRepository.findById(id).orElse(null);
    }

    @Override
    public Machine addMachine(Machine machine) {
        return machineRepository.save(machine);
    }

    @Override
    public void removeMachine(Long id) {
        machineRepository.deleteById(id);
    }

    @Override
    public Machine modifyMachine(Machine machine) {
        return machineRepository.save(machine);
    }

    // ===== NEW ODOO INTEGRATION METHODS =====

    @Override
    public Machine findByOdooAssetId(Integer odooAssetId) {
        return machineRepository.findByOdooAssetId(odooAssetId).orElse(null);
    }

    @Override
    public List<Machine> findMachinesPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return machineRepository.findMachinesPaginated(pageable);
    }

    @Override
    public List<Machine> findMachinesSyncedWithOdoo() {
        return machineRepository.findMachinesSyncedWithOdoo();
    }

    @Override
    public List<Machine> findMachinesNotSyncedWithOdoo() {
        return machineRepository.findMachinesNotSyncedWithOdoo();
    }

    @Override
    @Transactional
    public Machine markAsSyncedWithOdoo(Long machineId, Integer odooAssetId, String odooState, Double assetValue) {
        Machine machine = machineRepository.findById(machineId).orElse(null);
        if (machine != null) {
            machine.markSyncedWithOdoo(odooAssetId);
            machine.setOdooState(odooState);
            if (assetValue != null) {
                machine.setAssetValue(assetValue);
            }
            return machineRepository.save(machine);
        }
        return null;
    }

    @Override
    @Transactional
    public Machine createFromOdooData(Map<String, Object> odooData) {
        Machine machine = new Machine();
        
        // Map Odoo data to EAM Machine fields
        machine.setNom((String) odooData.get("nom"));
        machine.setEmplacement((String) odooData.getOrDefault("emplacement", "Imported from Odoo"));
        machine.setType((String) odooData.getOrDefault("type", "Asset"));
        
        // Map status
        String statutStr = (String) odooData.get("statut");
        if (statutStr != null) {
            try {
                machine.setStatut(Statut.valueOf(statutStr));
            } catch (IllegalArgumentException e) {
                machine.setStatut(Statut.EN_ATTENTE); // Default status
            }
        } else {
            machine.setStatut(Statut.EN_ATTENTE);
        }
        
        // Handle dates
        Date maintenanceDate = parseDate(odooData.get("dateDernièreMaintenance"));
        if (maintenanceDate != null) {
            machine.setDateDernièreMaintenance(maintenanceDate);
        } else {
            // Set a default past date
            machine.setDateDernièreMaintenance(new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000));
        }
        
        Date nextMaintenanceDate = parseDate(odooData.get("dateProchaineMainenance"));
        if (nextMaintenanceDate != null) {
            machine.setDateProchaineMainenance(nextMaintenanceDate);
        } else {
            // Set a default future date (30 days from now)
            machine.setDateProchaineMainenance(new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000));
        }
        
        // Set Odoo-specific fields
        machine.setOdooAssetId((Integer) odooData.get("odooAssetId"));
        machine.setOdooState((String) odooData.get("odooState"));
        machine.markAsImportedFromOdoo();
        
        if (odooData.get("assetValue") != null) {
            machine.setAssetValue(((Number) odooData.get("assetValue")).doubleValue());
        }
        
        return machineRepository.save(machine);
    }

    @Override
    public long countAllMachines() {
        return machineRepository.count();
    }

    @Override
    public long countMachinesSyncedWithOdoo() {
        return machineRepository.countMachinesSyncedWithOdoo();
    }

    @Override
    public long countMachinesNotSyncedWithOdoo() {
        return machineRepository.countMachinesNotSyncedWithOdoo();
    }

    @Override
    public long countMachinesImportedFromOdoo() {
        return machineRepository.countMachinesImportedFromOdoo();
    }

    @Override
    @Transactional
    public int bulkUpdateForSync(List<Map<String, Object>> machineUpdates) {
        int updated = 0;
        
        for (Map<String, Object> updateData : machineUpdates) {
            try {
                Long machineId = ((Number) updateData.get("id")).longValue();
                Machine machine = machineRepository.findById(machineId).orElse(null);
                
                if (machine != null) {
                    // Update Odoo sync fields
                    if (updateData.containsKey("odooAssetId")) {
                        machine.setOdooAssetId((Integer) updateData.get("odooAssetId"));
                    }
                    
                    if (updateData.containsKey("odooState")) {
                        machine.setOdooState((String) updateData.get("odooState"));
                    }
                    
                    if (updateData.containsKey("assetValue")) {
                        machine.setAssetValue(((Number) updateData.get("assetValue")).doubleValue());
                    }
                    
                    machine.setLastOdooSync(new Date());
                    machineRepository.save(machine);
                    updated++;
                }
            } catch (Exception e) {
                // Log error but continue with other updates
                System.err.println("Error updating machine: " + e.getMessage());
            }
        }
        
        return updated;
    }

    // ===== HELPER METHODS =====

    private Date parseDate(Object dateObj) {
        if (dateObj == null) return null;
        
        if (dateObj instanceof Date) {
            return (Date) dateObj;
        }
        
        if (dateObj instanceof String) {
            try {
                return dateFormat.parse((String) dateObj);
            } catch (ParseException e) {
                return null;
            }
        }
        
        return null;
    }

    /**
     * Additional helper methods for Odoo integration
     */
    
    public List<Machine> findMachinesByName(String name) {
        return machineRepository.findByNomContainingIgnoreCase(name);
    }
    
    public List<Machine> findMachinesByType(String type) {
        return machineRepository.findByType(type);
    }
    
    public List<Machine> findMachinesByStatus(Statut statut) {
        return machineRepository.findByStatut(statut);
    }
    
    public Machine findMachineByNameAndLocation(String nom, String emplacement) {
        return machineRepository.findByNomAndEmplacement(nom, emplacement).orElse(null);
    }
    
    public List<Machine> findMachinesNeedingSync() {
        Date oneHourAgo = new Date(System.currentTimeMillis() - 60 * 60 * 1000);
        return machineRepository.findMachinesNeedingSync(oneHourAgo);
    }
}

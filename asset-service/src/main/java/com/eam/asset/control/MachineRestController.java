package com.eam.asset.control;

import com.eam.asset.entity.Machine;
import com.eam.asset.service.IMachineService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.eam.common.security.RoleAllowed;

@RestController
@RequestMapping("/api/machine")
@AllArgsConstructor
public class MachineRestController {

    private final IMachineService machineService;
    
    // ===== EXISTING EAM ENDPOINTS (PRESERVED) =====
    
    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-all-machines")
    public List<Machine> getMachines() {
        return machineService.retrieveAllMachines();
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-machine/{id}")
    public ResponseEntity<Machine> getMachine(@PathVariable Long id) {
        Machine dto = machineService.retrieveMachine(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PostMapping("/add-machine")
    public Machine addMachine(@Valid @RequestBody Machine machine) {
        return machineService.addMachine(machine);
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PutMapping("/update-machine")
    public Machine updateMachine(@Valid @RequestBody Machine machine) {
        return machineService.modifyMachine(machine);
    }

    @RoleAllowed({"ADMIN"})
    @DeleteMapping("/delete-machine/{id}")
    public void deleteMachine(@PathVariable Long id) {
        machineService.removeMachine(id);
    }

    // ===== NEW ODOO INTEGRATION ENDPOINTS =====
    
    /**
     * Find machine by Odoo Asset ID
     * Used by Odoo sync service to check if machine already exists
     */
    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @GetMapping("/by-odoo-id/{odooAssetId}")
    public ResponseEntity<Machine> getMachineByOdooId(@PathVariable Integer odooAssetId) {
        try {
            Machine machine = machineService.findByOdooAssetId(odooAssetId);
            return machine != null ? ResponseEntity.ok(machine) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get machines with pagination for sync operations
     * Used by Odoo sync service to get batches of machines
     */
    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @GetMapping("/paginated")
    public ResponseEntity<List<Machine>> getMachinesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            List<Machine> machines = machineService.findMachinesPaginated(page, size);
            return ResponseEntity.ok(machines);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get machines that are synced with Odoo
     */
    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @GetMapping("/synced-with-odoo")
    public ResponseEntity<List<Machine>> getMachinesSyncedWithOdoo() {
        try {
            List<Machine> machines = machineService.findMachinesSyncedWithOdoo();
            return ResponseEntity.ok(machines);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get machines that are NOT synced with Odoo
     */
    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @GetMapping("/not-synced-with-odoo")
    public ResponseEntity<List<Machine>> getMachinesNotSyncedWithOdoo() {
        try {
            List<Machine> machines = machineService.findMachinesNotSyncedWithOdoo();
            return ResponseEntity.ok(machines);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Update machine with Odoo sync information
     * Used by sync service to mark machines as synced
     */
    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PutMapping("/{id}/sync-with-odoo")
    public ResponseEntity<Machine> markMachineAsSynced(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> syncData) {
        try {
            Integer odooAssetId = (Integer) syncData.get("odooAssetId");
            String odooState = (String) syncData.get("odooState");
            Double assetValue = syncData.get("assetValue") != null ? 
                               ((Number) syncData.get("assetValue")).doubleValue() : null;
            
            Machine machine = machineService.markAsSyncedWithOdoo(id, odooAssetId, odooState, assetValue);
            return machine != null ? ResponseEntity.ok(machine) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Create machine from Odoo data
     * Used by sync service when importing from Odoo
     */
    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PostMapping("/from-odoo")
    public ResponseEntity<Machine> createMachineFromOdoo(@RequestBody Map<String, Object> odooData) {
        try {
            Machine machine = machineService.createFromOdooData(odooData);
            return ResponseEntity.ok(machine);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get sync statistics
     */
    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @GetMapping("/sync-stats")
    public ResponseEntity<Map<String, Object>> getSyncStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalMachines", machineService.countAllMachines());
            stats.put("syncedWithOdoo", machineService.countMachinesSyncedWithOdoo());
            stats.put("notSyncedWithOdoo", machineService.countMachinesNotSyncedWithOdoo());
            stats.put("importedFromOdoo", machineService.countMachinesImportedFromOdoo());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Bulk update machines for sync operations
     */
    @RoleAllowed({"ADMIN"})
    @PutMapping("/bulk-sync-update")
    public ResponseEntity<Map<String, Object>> bulkUpdateForSync(
            @RequestBody List<Map<String, Object>> machineUpdates) {
        try {
            int updated = machineService.bulkUpdateForSync(machineUpdates);
            Map<String, Object> result = new HashMap<>();
            result.put("updated", updated);
            result.put("success", true);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("success", false);
            return ResponseEntity.internalServerError().body(error);
        }
    }
}

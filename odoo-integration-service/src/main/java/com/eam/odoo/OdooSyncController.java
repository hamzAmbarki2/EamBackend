package com.eam.odoo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for Odoo synchronization operations
 * Provides endpoints for bidirectional sync between EAM and Odoo
 */
@RestController
@RequestMapping("/api/integrations/odoo/sync")
public class OdooSyncController {

    @Autowired
    private OdooSyncService syncService;

    /**
     * Synchronize assets from Odoo to EAM system
     * Creates/updates EAM machines based on Odoo assets
     */
    @PostMapping("/assets/from-odoo")
    public ResponseEntity<Map<String, Object>> syncAssetsFromOdoo(
            @RequestParam(defaultValue = "50") int limit) {
        try {
            Map<String, Object> result = syncService.syncAssetsFromOdoo(limit);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage(), "success", false));
        }
    }

    /**
     * Synchronize assets from EAM to Odoo system
     * Creates/updates Odoo assets based on EAM machines
     */
    @PostMapping("/assets/to-odoo")
    public ResponseEntity<Map<String, Object>> syncAssetsToOdoo(
            @RequestParam(defaultValue = "50") int limit) {
        try {
            Map<String, Object> result = syncService.syncAssetsToOdoo(limit);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage(), "success", false));
        }
    }

    /**
     * Synchronize maintenance requests from Odoo to EAM work orders
     * Creates/updates EAM work orders based on Odoo maintenance requests
     */
    @PostMapping("/maintenance/from-odoo")
    public ResponseEntity<Map<String, Object>> syncMaintenanceFromOdoo(
            @RequestParam(defaultValue = "50") int limit) {
        try {
            Map<String, Object> result = syncService.syncMaintenanceFromOdoo(limit);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage(), "success", false));
        }
    }

    /**
     * Full bidirectional synchronization
     * Syncs both assets and maintenance data in both directions
     */
    @PostMapping("/full-sync")
    public ResponseEntity<Map<String, Object>> fullSync(
            @RequestParam(defaultValue = "50") int limit) {
        try {
            Map<String, Object> assetsFromOdoo = syncService.syncAssetsFromOdoo(limit);
            Map<String, Object> assetsToOdoo = syncService.syncAssetsToOdoo(limit);
            Map<String, Object> maintenanceFromOdoo = syncService.syncMaintenanceFromOdoo(limit);

            return ResponseEntity.ok(Map.of(
                    "assetsFromOdoo", assetsFromOdoo,
                    "assetsToOdoo", assetsToOdoo,
                    "maintenanceFromOdoo", maintenanceFromOdoo,
                    "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage(), "success", false));
        }
    }

    /**
     * Get sync status and statistics
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSyncStatus() {
        // This could be enhanced to show last sync times, counts, etc.
        return ResponseEntity.ok(Map.of(
                "status", "ready",
                "services", Map.of(
                        "odoo-integration", "active",
                        "asset-service", "connected",
                        "work-order-service", "connected"
                ),
                "lastSync", "Not implemented yet"
        ));
    }
}

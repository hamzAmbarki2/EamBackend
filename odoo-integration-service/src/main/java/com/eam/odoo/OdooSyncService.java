package com.eam.odoo;

import com.eam.odoo.dto.AssetDTO;
import com.eam.odoo.dto.MaintenanceRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

/**
 * Service for bidirectional synchronization between EAM system and Odoo
 * Preserves existing EAM structure while enabling Odoo integration
 */
@Service
public class OdooSyncService {

    private static final Logger logger = LoggerFactory.getLogger(OdooSyncService.class);

    @Autowired
    private OdooAssetService odooAssetService;

    @Autowired
    private OdooMaintenanceService odooMaintenanceService;

    @Autowired
    private OdooMappingService mappingService;

    private final RestTemplate restTemplate = new RestTemplate();

    // EAM service URLs (through API Gateway)
    private static final String EAM_GATEWAY_URL = "http://localhost:8080";
    private static final String ASSET_SERVICE_URL = EAM_GATEWAY_URL + "/api/assets";
    private static final String WORK_ORDER_SERVICE_URL = EAM_GATEWAY_URL + "/api/work-orders";

    /**
     * Synchronizes assets from Odoo to EAM system
     * Creates or updates EAM machines based on Odoo assets
     */
    public Map<String, Object> syncAssetsFromOdoo(int limit) {
        logger.info("Starting asset synchronization from Odoo to EAM (limit: {})", limit);
        
        try {
            // Get assets from Odoo
            List<AssetDTO> odooAssets = odooAssetService.listAssets(limit);
            logger.info("Retrieved {} assets from Odoo", odooAssets.size());

            List<Map<String, Object>> syncResults = new ArrayList<>();
            int created = 0, updated = 0, errors = 0;

            for (AssetDTO odooAsset : odooAssets) {
                try {
                    // Map Odoo asset to EAM machine format
                    Map<String, Object> machineData = mappingService.mapOdooAssetToMachine(odooAsset);
                    
                    // Check if machine already exists in EAM
                    Map<String, Object> existingMachine = findEamMachineByOdooId(odooAsset.id);
                    
                    if (existingMachine != null) {
                        // Update existing machine
                        Long machineId = (Long) existingMachine.get("id");
                        updateEamMachine(machineId, machineData);
                        updated++;
                        logger.debug("Updated EAM machine {} from Odoo asset {}", machineId, odooAsset.id);
                    } else {
                        // Create new machine
                        Map<String, Object> createdMachine = createEamMachine(machineData);
                        created++;
                        logger.debug("Created EAM machine from Odoo asset {}", odooAsset.id);
                    }

                    syncResults.add(Map.of(
                        "odooAssetId", odooAsset.id,
                        "status", existingMachine != null ? "updated" : "created",
                        "success", true
                    ));

                } catch (Exception e) {
                    errors++;
                    logger.error("Error syncing Odoo asset {}: {}", odooAsset.id, e.getMessage());
                    syncResults.add(Map.of(
                        "odooAssetId", odooAsset.id,
                        "status", "error",
                        "success", false,
                        "error", e.getMessage()
                    ));
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("totalProcessed", odooAssets.size());
            result.put("created", created);
            result.put("updated", updated);
            result.put("errors", errors);
            result.put("details", syncResults);

            logger.info("Asset sync completed: {} created, {} updated, {} errors", created, updated, errors);
            return result;

        } catch (Exception e) {
            logger.error("Failed to sync assets from Odoo: {}", e.getMessage());
            throw new RuntimeException("Asset synchronization failed", e);
        }
    }

    /**
     * Synchronizes assets from EAM to Odoo
     * Creates or updates Odoo assets based on EAM machines
     */
    public Map<String, Object> syncAssetsToOdoo(int limit) {
        logger.info("Starting asset synchronization from EAM to Odoo (limit: {})", limit);
        
        try {
            // Get machines from EAM
            List<Map<String, Object>> eamMachines = getEamMachines(limit);
            logger.info("Retrieved {} machines from EAM", eamMachines.size());

            List<Map<String, Object>> syncResults = new ArrayList<>();
            int created = 0, updated = 0, errors = 0;

            for (Map<String, Object> eamMachine : eamMachines) {
                try {
                    Integer odooAssetId = (Integer) eamMachine.get("odooAssetId");
                    
                    // Map EAM machine to Odoo asset format
                    AssetDTO assetData = mappingService.mapMachineToOdooAsset(eamMachine);
                    
                    if (odooAssetId != null) {
                        // Update existing Odoo asset (if update API exists)
                        // For now, we'll skip updates as the basic Odoo service doesn't have update
                        logger.debug("Skipping update for existing Odoo asset {}", odooAssetId);
                    } else {
                        // Create new Odoo asset
                        Map<String, Object> createData = new HashMap<>();
                        createData.put("name", assetData.name);
                        createData.put("value", assetData.value);
                        createData.put("acquisitionDate", assetData.acquisitionDate);
                        
                        Integer newOdooId = odooAssetService.createAsset(
                            assetData.name, 
                            assetData.value, 
                            assetData.acquisitionDate
                        );
                        
                        // Update EAM machine with Odoo ID
                        eamMachine.put("odooAssetId", newOdooId);
                        updateEamMachine((Long) eamMachine.get("id"), eamMachine);
                        
                        created++;
                        logger.debug("Created Odoo asset {} from EAM machine {}", newOdooId, eamMachine.get("id"));
                    }

                    syncResults.add(Map.of(
                        "eamMachineId", eamMachine.get("id"),
                        "status", odooAssetId != null ? "skipped" : "created",
                        "success", true
                    ));

                } catch (Exception e) {
                    errors++;
                    logger.error("Error syncing EAM machine {}: {}", eamMachine.get("id"), e.getMessage());
                    syncResults.add(Map.of(
                        "eamMachineId", eamMachine.get("id"),
                        "status", "error",
                        "success", false,
                        "error", e.getMessage()
                    ));
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("totalProcessed", eamMachines.size());
            result.put("created", created);
            result.put("updated", updated);
            result.put("errors", errors);
            result.put("details", syncResults);

            logger.info("Asset sync to Odoo completed: {} created, {} updated, {} errors", created, updated, errors);
            return result;

        } catch (Exception e) {
            logger.error("Failed to sync assets to Odoo: {}", e.getMessage());
            throw new RuntimeException("Asset synchronization to Odoo failed", e);
        }
    }

    /**
     * Synchronizes maintenance requests from Odoo to EAM work orders
     */
    public Map<String, Object> syncMaintenanceFromOdoo(int limit) {
        logger.info("Starting maintenance synchronization from Odoo to EAM (limit: {})", limit);
        
        try {
            // Get maintenance requests from Odoo
            List<MaintenanceRequestDTO> odooRequests = odooMaintenanceService.listRequests(limit);
            logger.info("Retrieved {} maintenance requests from Odoo", odooRequests.size());

            List<Map<String, Object>> syncResults = new ArrayList<>();
            int created = 0, updated = 0, errors = 0;

            for (MaintenanceRequestDTO odooRequest : odooRequests) {
                try {
                    // Map Odoo request to EAM work order format
                    Map<String, Object> workOrderData = mappingService.mapMaintenanceRequestToOrdreTravail(odooRequest);
                    
                    // Check if work order already exists
                    Map<String, Object> existingWorkOrder = findEamWorkOrderByOdooId(odooRequest.id);
                    
                    if (existingWorkOrder != null) {
                        // Update existing work order
                        Long workOrderId = (Long) existingWorkOrder.get("id");
                        updateEamWorkOrder(workOrderId, workOrderData);
                        updated++;
                        logger.debug("Updated EAM work order {} from Odoo request {}", workOrderId, odooRequest.id);
                    } else {
                        // Create new work order
                        Map<String, Object> createdWorkOrder = createEamWorkOrder(workOrderData);
                        created++;
                        logger.debug("Created EAM work order from Odoo request {}", odooRequest.id);
                    }

                    syncResults.add(Map.of(
                        "odooRequestId", odooRequest.id,
                        "status", existingWorkOrder != null ? "updated" : "created",
                        "success", true
                    ));

                } catch (Exception e) {
                    errors++;
                    logger.error("Error syncing Odoo maintenance request {}: {}", odooRequest.id, e.getMessage());
                    syncResults.add(Map.of(
                        "odooRequestId", odooRequest.id,
                        "status", "error",
                        "success", false,
                        "error", e.getMessage()
                    ));
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("totalProcessed", odooRequests.size());
            result.put("created", created);
            result.put("updated", updated);
            result.put("errors", errors);
            result.put("details", syncResults);

            logger.info("Maintenance sync completed: {} created, {} updated, {} errors", created, updated, errors);
            return result;

        } catch (Exception e) {
            logger.error("Failed to sync maintenance from Odoo: {}", e.getMessage());
            throw new RuntimeException("Maintenance synchronization failed", e);
        }
    }

    // Helper methods for EAM service communication
    private List<Map<String, Object>> getEamMachines(int limit) {
        try {
            String url = ASSET_SERVICE_URL + "?limit=" + limit;
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            return response.getBody();
        } catch (Exception e) {
            logger.error("Failed to get EAM machines: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private Map<String, Object> findEamMachineByOdooId(Integer odooId) {
        try {
            String url = ASSET_SERVICE_URL + "/by-odoo-id/" + odooId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getBody();
        } catch (Exception e) {
            // Machine not found or error - return null
            return null;
        }
    }

    private Map<String, Object> createEamMachine(Map<String, Object> machineData) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(machineData, headers);
        
        ResponseEntity<Map> response = restTemplate.postForEntity(ASSET_SERVICE_URL, request, Map.class);
        return response.getBody();
    }

    private void updateEamMachine(Long machineId, Map<String, Object> machineData) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(machineData, headers);
        
        String url = ASSET_SERVICE_URL + "/" + machineId;
        restTemplate.exchange(url, HttpMethod.PUT, request, Map.class);
    }

    private Map<String, Object> findEamWorkOrderByOdooId(Integer odooId) {
        try {
            String url = WORK_ORDER_SERVICE_URL + "/by-odoo-id/" + odooId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getBody();
        } catch (Exception e) {
            return null;
        }
    }

    private Map<String, Object> createEamWorkOrder(Map<String, Object> workOrderData) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(workOrderData, headers);
        
        ResponseEntity<Map> response = restTemplate.postForEntity(WORK_ORDER_SERVICE_URL, request, Map.class);
        return response.getBody();
    }

    private void updateEamWorkOrder(Long workOrderId, Map<String, Object> workOrderData) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(workOrderData, headers);
        
        String url = WORK_ORDER_SERVICE_URL + "/" + workOrderId;
        restTemplate.exchange(url, HttpMethod.PUT, request, Map.class);
    }
}

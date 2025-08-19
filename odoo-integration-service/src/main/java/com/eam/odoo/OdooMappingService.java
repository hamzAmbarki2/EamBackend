package com.eam.odoo;

import com.eam.odoo.dto.AssetDTO;
import com.eam.odoo.dto.MaintenanceRequestDTO;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.text.ParseException;

/**
 * Service to map between EAM entities and Odoo DTOs
 * Preserves existing EAM structure while enabling Odoo integration
 */
@Service
public class OdooMappingService {

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    /**
     * Maps EAM Machine entity fields to Odoo Asset DTO
     * Preserves all existing EAM fields while adding Odoo compatibility
     */
    public AssetDTO mapMachineToOdooAsset(Map<String, Object> machineData) {
        AssetDTO asset = new AssetDTO();
        
        // Map EAM Machine fields to Odoo Asset fields
        asset.name = (String) machineData.get("nom"); // EAM 'nom' -> Odoo 'name'
        asset.id = machineData.get("odooAssetId") != null ? 
                   (Integer) machineData.get("odooAssetId") : null;
        
        // Map EAM status to Odoo state
        String eamStatut = (String) machineData.get("statut");
        asset.state = mapEamStatutToOdooState(eamStatut);
        
        // Set default value if not provided
        asset.value = machineData.get("value") != null ? 
                     ((Number) machineData.get("value")).doubleValue() : 0.0;
        
        // Map maintenance date
        Date maintenanceDate = (Date) machineData.get("dateDernièreMaintenance");
        if (maintenanceDate != null) {
            asset.acquisitionDate = dateFormat.format(maintenanceDate);
        }
        
        return asset;
    }

    /**
     * Maps Odoo Asset DTO to EAM Machine compatible data
     * Ensures compatibility with existing EAM Machine entity
     */
    public Map<String, Object> mapOdooAssetToMachine(AssetDTO asset) {
        Map<String, Object> machineData = new HashMap<>();
        
        // Map Odoo fields to EAM Machine fields
        machineData.put("nom", asset.name); // Odoo 'name' -> EAM 'nom'
        machineData.put("odooAssetId", asset.id); // Store Odoo ID for sync
        machineData.put("statut", mapOdooStateToEamStatut(asset.state));
        
        // Parse acquisition date to maintenance date
        if (asset.acquisitionDate != null) {
            try {
                Date date = dateFormat.parse(asset.acquisitionDate);
                machineData.put("dateDernièreMaintenance", date);
            } catch (ParseException e) {
                // Handle parsing error gracefully
                machineData.put("dateDernièreMaintenance", new Date());
            }
        }
        
        // Set default values for required EAM fields
        machineData.put("emplacement", "Imported from Odoo");
        machineData.put("type", "Asset");
        machineData.put("dateProchaineMainenance", new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000)); // 30 days from now
        
        return machineData;
    }

    /**
     * Maps EAM OrdreTravail to Odoo Maintenance Request
     */
    public MaintenanceRequestDTO mapOrdreTravailToMaintenanceRequest(Map<String, Object> ordreTravailData) {
        MaintenanceRequestDTO request = new MaintenanceRequestDTO();
        
        request.name = (String) ordreTravailData.get("titre");
        request.description = (String) ordreTravailData.get("description");
        request.equipmentId = (Integer) ordreTravailData.get("odooEquipmentId");
        
        // Map EAM date to Odoo format
        Date dateCreation = (Date) ordreTravailData.get("dateCreation");
        if (dateCreation != null) {
            request.requestDate = dateFormat.format(dateCreation);
        }
        
        // Map EAM status to Odoo stage
        String eamStatut = (String) ordreTravailData.get("statut");
        request.stage = mapEamStatutToOdooStage(eamStatut);
        
        return request;
    }

    /**
     * Maps Odoo Maintenance Request to EAM OrdreTravail compatible data
     */
    public Map<String, Object> mapMaintenanceRequestToOrdreTravail(MaintenanceRequestDTO request) {
        Map<String, Object> ordreTravailData = new HashMap<>();
        
        ordreTravailData.put("titre", request.name);
        ordreTravailData.put("description", request.description);
        ordreTravailData.put("odooRequestId", request.id);
        ordreTravailData.put("odooEquipmentId", request.equipmentId);
        
        // Parse request date
        if (request.requestDate != null) {
            try {
                Date date = dateFormat.parse(request.requestDate);
                ordreTravailData.put("dateCreation", date);
            } catch (ParseException e) {
                ordreTravailData.put("dateCreation", new Date());
            }
        }
        
        // Map Odoo stage to EAM status
        ordreTravailData.put("statut", mapOdooStageToEamStatut(request.stage));
        
        // Set default EAM fields
        ordreTravailData.put("priorité", "MOYENNE");
        ordreTravailData.put("dateEcheance", new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000)); // 7 days from now
        
        return ordreTravailData;
    }

    // Status mapping methods
    private String mapEamStatutToOdooState(String eamStatut) {
        if (eamStatut == null) return "draft";
        
        switch (eamStatut) {
            case "EN_ATTENTE": return "draft";
            case "EN_COURS": return "running";
            case "TERMINE": return "close";
            case "ANNULE": return "cancelled";
            default: return "draft";
        }
    }

    private String mapOdooStateToEamStatut(String odooState) {
        if (odooState == null) return "EN_ATTENTE";
        
        switch (odooState.toLowerCase()) {
            case "draft": return "EN_ATTENTE";
            case "running": return "EN_COURS";
            case "close": return "TERMINE";
            case "cancelled": return "ANNULE";
            default: return "EN_ATTENTE";
        }
    }

    private String mapEamStatutToOdooStage(String eamStatut) {
        if (eamStatut == null) return "New";
        
        switch (eamStatut) {
            case "EN_ATTENTE": return "New";
            case "EN_COURS": return "In Progress";
            case "TERMINE": return "Done";
            case "ANNULE": return "Cancelled";
            default: return "New";
        }
    }

    private String mapOdooStageToEamStatut(String odooStage) {
        if (odooStage == null) return "EN_ATTENTE";
        
        switch (odooStage.toLowerCase()) {
            case "new": return "EN_ATTENTE";
            case "in progress": return "EN_COURS";
            case "done": return "TERMINE";
            case "cancelled": return "ANNULE";
            default: return "EN_ATTENTE";
        }
    }
}

package com.eam.odoo;

import com.eam.odoo.dto.AssetDTO;
import com.eam.odoo.dto.MaintenanceRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/integrations/odoo")
public class OdooProxyController {

    private final OdooAssetService assetService;
    private final OdooMaintenanceService maintenanceService;
    private final OdooAuthService authService;

    public OdooProxyController(OdooAssetService assetService, OdooMaintenanceService maintenanceService, OdooAuthService authService) {
        this.assetService = assetService;
        this.maintenanceService = maintenanceService;
        this.authService = authService;
    }

    @GetMapping("/assets")
    public List<AssetDTO> listAssets(@RequestParam(defaultValue = "50") int limit) {
        return assetService.listAssets(limit);
    }

    @PostMapping("/assets")
    public Map<String, Object> createAsset(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        Number value = (Number) body.getOrDefault("value", 0);
        String acquisitionDate = (String) body.get("acquisitionDate"); // format: YYYY-MM-DD
        Integer id = assetService.createAsset(name, value.doubleValue(), acquisitionDate);
        return Map.of("id", id);
    }

    @GetMapping("/maintenance/requests")
    public List<MaintenanceRequestDTO> listRequests(@RequestParam(defaultValue = "50") int limit) {
        return maintenanceService.listRequests(limit);
    }

    @PostMapping("/maintenance/requests")
    public Map<String, Object> createRequest(@RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        Number eq = (Number) body.get("equipmentId");
        String desc = (String) body.get("description");
        Integer id = maintenanceService.createRequest(title, eq == null ? null : eq.intValue(), desc);
        return Map.of("id", id);
    }

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        try {
            int uid = authService.authenticate();
            return ResponseEntity.ok(Map.of("odoo", "ok", "uid", uid));
        } catch (Exception ex) {
            return ResponseEntity.status(503).body(Map.of("odoo", "error", "message", ex.getMessage()));
        }
    }
}
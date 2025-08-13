package com.example.odoo;

import com.example.odoo.dto.MaintenanceRequestDTO;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OdooMaintenanceService {

    private final OdooXmlRpc rpc;

    public OdooMaintenanceService(OdooXmlRpc rpc) {
        this.rpc = rpc;
    }

    public List<MaintenanceRequestDTO> listRequests(int limit) {
        Object[] rows = rpc.searchRead(
                "maintenance.request",
                new Object[]{},
                new String[]{"name","equipment_id","description","request_date","stage_id","create_uid"},
                0, limit, "id desc"
        );
        List<MaintenanceRequestDTO> out = new ArrayList<>();
        for (Object row : rows) {
            @SuppressWarnings("unchecked")
            Map<String, Object> m = (Map<String, Object>) row;
            MaintenanceRequestDTO dto = new MaintenanceRequestDTO();
            dto.id = (Integer) m.get("id");
            dto.name = (String) m.get("name");
            Object[] equipment = (Object[]) m.get("equipment_id"); // many2one returns [id, display_name]
            dto.equipmentId = equipment != null && equipment.length > 0 && equipment[0] instanceof Number
                    ? ((Number) equipment[0]).intValue() : null;
            dto.description = (String) m.get("description");
            dto.requestDate = (String) m.get("request_date");
            Object[] stage = (Object[]) m.get("stage_id");
            dto.stage = stage != null && stage.length > 1 ? String.valueOf(stage[1]) : null;
            Object[] creator = (Object[]) m.get("create_uid");
            dto.createdBy = creator != null && creator.length > 0 && creator[0] instanceof Number
                    ? ((Number) creator[0]).intValue() : null;
            out.add(dto);
        }
        return out;
    }

    public Integer createRequest(String title, Integer equipmentId, String description) {
        Map<String, Object> vals = new HashMap<>();
        vals.put("name", title);
        if (equipmentId != null) vals.put("equipment_id", equipmentId);
        if (description != null) vals.put("description", description);
        return rpc.create("maintenance.request", vals);
    }
}

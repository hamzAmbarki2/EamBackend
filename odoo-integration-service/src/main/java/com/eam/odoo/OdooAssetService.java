package com.eam.odoo;

import com.eam.odoo.dto.AssetDTO;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OdooAssetService {

    private final OdooXmlRpc rpc;

    public OdooAssetService(OdooXmlRpc rpc) {
        this.rpc = rpc;
    }

    public List<AssetDTO> listAssets(int limit) {
        Object[] rows = rpc.searchRead(
                "account.asset",
                new Object[]{},
                new String[]{"name", "original_value", "acquisition_date", "state"},
                0, limit, "id desc"
        );
        List<AssetDTO> out = new ArrayList<>();
        for (Object row : rows) {
            @SuppressWarnings("unchecked")
            Map<String, Object> m = (Map<String, Object>) row;
            AssetDTO dto = new AssetDTO();
            dto.id = (Integer) m.get("id");
            dto.name = (String) m.get("name");
            Object val = m.get("original_value");
            dto.value = val instanceof Number ? ((Number) val).doubleValue() : null;
            dto.acquisitionDate = (String) m.get("acquisition_date");
            dto.state = (String) m.get("state");
            out.add(dto);
        }
        return out;
    }

    public Integer createAsset(String name, double value, String acquisitionDate) {
        Map<String, Object> vals = new HashMap<>();
        vals.put("name", name);
        vals.put("original_value", value);
        if (acquisitionDate != null) vals.put("acquisition_date", acquisitionDate);
        // Depending on Odoo version/model you may need 'model_id', 'method', etc.
        return rpc.create("account.asset", vals);
    }
}
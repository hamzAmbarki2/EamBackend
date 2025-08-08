package com.eam.intervention.control;

import com.eam.intervention.entity.OrdreIntervention;
import com.eam.intervention.service.IOrdreInterventionService;
import com.eam.common.security.annotations.RoleAllowed;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RequestMapping("/api/ordreIntervention")
@AllArgsConstructor
@RestController

public class OrdreInterventionRestController {

    private final IOrdreInterventionService ordreInterventionService;

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-all-ordreInterventions")
    public List<OrdreIntervention> getOrdreInterventions() {
        return ordreInterventionService.retrieveAllOrdreInterventions();
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-ordreIntervention/{id}")
    public ResponseEntity<OrdreIntervention> getOrdreIntervention(@PathVariable Long id) {
        OrdreIntervention dto = ordreInterventionService.retrieveOrdreIntervention(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PostMapping("/add-ordreIntervention")
    public OrdreIntervention addOrdreIntervention(@Valid @RequestBody OrdreIntervention ordreIntervention) {
        return ordreInterventionService.addOrdreIntervention(ordreIntervention);
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @PutMapping("/update-ordreIntervention")
    public OrdreIntervention updateOrdreIntervention(@Valid @RequestBody OrdreIntervention ordreIntervention) {
        return ordreInterventionService.modifyOrdreIntervention(ordreIntervention);
    }

    @RoleAllowed({"ADMIN"})
    @DeleteMapping("/delete-ordreIntervention/{id}")
    public void deleteOrdreIntervention(@PathVariable Long id) {
        ordreInterventionService.removeOrdreIntervention(id);
    }
}

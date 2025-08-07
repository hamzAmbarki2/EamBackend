package com.eam.intervention.control;

import com.eam.intervention.entity.OrdreIntervention;
import com.eam.intervention.service.IOrdreInterventionService;
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

    @GetMapping("/retrieve-all-ordreInterventions")
    public List<OrdreIntervention> getOrdreInterventions() {
        return ordreInterventionService.retrieveAllOrdreInterventions();
    }

    @GetMapping("/retrieve-ordreIntervention/{id}")
    public ResponseEntity<OrdreIntervention> getOrdreIntervention(@PathVariable Long id) {
        OrdreIntervention dto = ordreInterventionService.retrieveOrdreIntervention(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/add-ordreIntervention")
    public OrdreIntervention addOrdreIntervention(@Valid @RequestBody OrdreIntervention ordreIntervention) {
        return ordreInterventionService.addOrdreIntervention(ordreIntervention);
    }

    @PutMapping("/update-ordreIntervention")
    public OrdreIntervention updateOrdreIntervention(@Valid @RequestBody OrdreIntervention ordreIntervention) {
        return ordreInterventionService.modifyOrdreIntervention(ordreIntervention);
    }

    @DeleteMapping("/delete-ordreIntervention/{id}")
    public void deleteOrdreIntervention(@PathVariable Long id) {
        ordreInterventionService.removeOrdreIntervention(id);
    }
}

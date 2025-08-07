package com.eam.planning.control;

import com.eam.planning.entity.Planning;
import com.eam.planning.service.IPlanningService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/planning")
@AllArgsConstructor
public class PlanningRestController {

    private final IPlanningService planningService;
    
    @GetMapping("/retrieve-all-plannings")
    public List<Planning> getPlannings() {
        return planningService.retrieveAllPlannings();
    }

    @GetMapping("/retrieve-planning/{id}")
    public ResponseEntity<Planning> getPlanning(@PathVariable Long id) {
        Planning dto = planningService.retrievePlanning(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/add-planning")
    public Planning addPlanning(@Valid @RequestBody Planning planning) {
        return planningService.addPlanning(planning);
    }

    @PutMapping("/update-planning")
    public Planning updatePlanning(@Valid @RequestBody Planning planning) {
        return planningService.modifyPlanning(planning);
    }

    @DeleteMapping("/delete-planning/{id}")
    public void deletePlanning(@PathVariable Long id) {
        planningService.removePlanning(id);
    }
}
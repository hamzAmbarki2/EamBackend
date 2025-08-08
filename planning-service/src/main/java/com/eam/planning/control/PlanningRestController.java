package com.eam.planning.control;

import com.eam.planning.entity.Planning;
import com.eam.planning.service.IPlanningService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api/planning")
@AllArgsConstructor
public class PlanningRestController {

    private final IPlanningService planningService;
    
    @GetMapping("/retrieve-all-plannings")
    public List<Planning> getPlannings(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        // TODO: Extract department from JWT and filter accordingly
        return planningService.retrieveAllPlannings();
    }

    @GetMapping("/retrieve-planning/{id}")
    public ResponseEntity<Planning> getPlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        // TODO: Extract department from JWT and check access
        Planning dto = planningService.retrievePlanning(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/add-planning")
    public Planning addPlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody Planning planning) {
        // TODO: Extract department from JWT and set on planning
        return planningService.addPlanning(planning);
    }

    @PutMapping("/update-planning")
    public Planning updatePlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody Planning planning) {
        // TODO: Extract department from JWT and check access
        return planningService.modifyPlanning(planning);
    }

    @DeleteMapping("/delete-planning/{id}")
    public void deletePlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        // TODO: Extract department from JWT and check access
        planningService.removePlanning(id);
    }
}
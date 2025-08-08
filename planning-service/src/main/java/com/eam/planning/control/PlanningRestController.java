package com.eam.planning.control;

import com.eam.planning.entity.Planning;
import com.eam.planning.service.IPlanningService;
import com.eam.common.security.annotations.RoleAllowed;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/planning")
@AllArgsConstructor
public class PlanningRestController {

    private final IPlanningService planningService;
    
    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-all-plannings")
    public List<Planning> getPlannings(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size) {
        return planningService.retrieveAllPlannings();
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-planning/{id}")
    public ResponseEntity<Planning> getPlanning(@PathVariable Long id) {
        Planning dto = planningService.retrievePlanning(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PostMapping("/add-planning")
    public Planning addPlanning(@Valid @RequestBody Planning planning) {
        return planningService.addPlanning(planning);
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PutMapping("/update-planning")
    public Planning updatePlanning(@Valid @RequestBody Planning planning) {
        return planningService.modifyPlanning(planning);
    }

    @RoleAllowed({"ADMIN"})
    @DeleteMapping("/delete-planning/{id}")
    public void deletePlanning(@PathVariable Long id) {
        planningService.removePlanning(id);
    }
}
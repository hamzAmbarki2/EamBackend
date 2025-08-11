package com.eam.planning.control;

import com.eam.planning.entity.Planning;
import com.eam.planning.service.IPlanningService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import com.eam.common.security.RoleAllowed;
import org.springframework.security.access.AccessDeniedException;

@RestController
@RequestMapping("/api/planning")
@AllArgsConstructor
public class PlanningRestController {

    private final IPlanningService planningService;

    private final com.eam.planning.config.JwtUtil jwtUtil;

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-all-plannings")
    public List<Planning> getPlannings(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @RequestParam(name = "page", required = false) Integer page,
            @RequestParam(name = "size", required = false) Integer size,
            @RequestParam(name = "sortBy", required = false) String sortBy,
            @RequestParam(name = "direction", required = false) String direction
    ) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        if (role == null) throw new AccessDeniedException("Missing role in token.");
        if (role.equals("ADMIN")) {
            return planningService.retrieveAllPlannings();
        } else if (role.equals("CHEFOP") || role.equals("CHEFTECH") || role.equals("TECHNICIEN")) {
            if (department == null) throw new AccessDeniedException("Department information missing from token.");
            return planningService.retrievePlanningsByDepartment(com.eam.common.enums.DepartmentType.valueOf(department));
        } else {
            throw new AccessDeniedException("Access denied: role not allowed to list plannings.");
        }
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-planning/{id}")
    public ResponseEntity<Planning> getPlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        Planning planning = planningService.retrievePlanning(id);
        if (planning == null) return ResponseEntity.notFound().build();
        if (role == null) throw new AccessDeniedException("Missing role in token.");
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(planning);
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH") || role.equals("TECHNICIEN")) && department != null && planning.getDepartment() != null && planning.getDepartment().name().equals(department)) {
            return ResponseEntity.ok(planning);
        } else {
            throw new AccessDeniedException("Access denied: Non-admins can only access plannings within their department.");
        }
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PostMapping("/add-planning")
    public ResponseEntity<Planning> addPlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody Planning planning) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        if (role == null) throw new AccessDeniedException("Missing role in token.");
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(planningService.addPlanning(planning));
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null) {
            planning.setDepartment(com.eam.common.enums.DepartmentType.valueOf(department));
            return ResponseEntity.ok(planningService.addPlanning(planning));
        } else {
            throw new AccessDeniedException("Only ADMIN, CHEFOP, or CHEFTECH can add plannings. CHEF roles can only add to their own department.");
        }
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PutMapping("/update-planning")
    public ResponseEntity<Planning> updatePlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody Planning planning) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        if (role == null) throw new AccessDeniedException("Missing role in token.");
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(planningService.modifyPlanning(planning));
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null && planning.getDepartment() != null && planning.getDepartment().name().equals(department)) {
            return ResponseEntity.ok(planningService.modifyPlanning(planning));
        } else {
            throw new AccessDeniedException("Only ADMIN, CHEFOP, or CHEFTECH can update plannings. CHEF roles can only modify plannings in their own department.");
        }
    }

    @RoleAllowed({"ADMIN"})
    @DeleteMapping("/delete-planning/{id}")
    public ResponseEntity<Void> deletePlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        if (role == null) throw new AccessDeniedException("Missing role in token.");
        if (role.equals("ADMIN")) {
            planningService.removePlanning(id);
            return ResponseEntity.ok().build();
        } else {
            throw new AccessDeniedException("Access denied: Only ADMIN can delete plannings.");
        }
    }
}
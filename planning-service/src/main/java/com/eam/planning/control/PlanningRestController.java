package com.eam.planning.control;

import com.eam.planning.entity.Planning;
import com.eam.planning.service.IPlanningService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/planning")
@AllArgsConstructor
public class PlanningRestController {

    private final IPlanningService planningService;
    
    @Autowired
    private com.eam.planning.config.JwtUtil jwtUtil;

    @GetMapping("/retrieve-all-plannings")
    public List<Planning> getPlannings(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        if (role == null) return List.of();
        if (role.equals("ADMIN")) {
            return planningService.retrieveAllPlannings();
        } else if (role.equals("CHEFOP") || role.equals("CHEFTECH") || role.equals("TECHNICIEN")) {
            if (department == null) return List.of();
            return planningService.retrievePlanningsByDepartment(com.eam.common.enums.DepartmentType.valueOf(department));
        } else {
            return List.of();
        }
    }

    @GetMapping("/retrieve-planning/{id}")
    public ResponseEntity<Planning> getPlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        Planning planning = planningService.retrievePlanning(id);
        if (planning == null) return ResponseEntity.notFound().build();
        if (role == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(planning);
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH") || role.equals("TECHNICIEN")) && department != null && planning.getDepartment() != null && planning.getDepartment().name().equals(department)) {
            return ResponseEntity.ok(planning);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping("/add-planning")
    public ResponseEntity<Planning> addPlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody Planning planning) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        if (role == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(planningService.addPlanning(planning));
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null) {
            planning.setDepartment(com.eam.common.enums.DepartmentType.valueOf(department));
            return ResponseEntity.ok(planningService.addPlanning(planning));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PutMapping("/update-planning")
    public ResponseEntity<Planning> updatePlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody Planning planning) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        if (role == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(planningService.modifyPlanning(planning));
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null && planning.getDepartment() != null && planning.getDepartment().name().equals(department)) {
            return ResponseEntity.ok(planningService.modifyPlanning(planning));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/delete-planning/{id}")
    public ResponseEntity<Void> deletePlanning(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        if (role == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        if (role.equals("ADMIN")) {
            planningService.removePlanning(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
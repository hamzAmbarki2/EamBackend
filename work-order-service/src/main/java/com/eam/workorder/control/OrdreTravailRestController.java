package com.eam.workorder.control;

import com.eam.workorder.entity.OrdreTravail;
import com.eam.workorder.service.IOrdreTravailService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.http.HttpStatus;
import com.eam.common.enums.DepartmentType;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/ordreTravail")
@AllArgsConstructor
public class OrdreTravailRestController {

    private final IOrdreTravailService ordreTravailService;
    
    @Autowired
    private com.eam.workorder.config.JwtUtil jwtUtil;

    private static final Logger log = LoggerFactory.getLogger(OrdreTravailRestController.class);

    @GetMapping("/retrieve-all-ordreTravails")
    public List<OrdreTravail> getOrdreTravails(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? jwtUtil.getUserIdFromToken(token) : null;
        if (role == null) {
            log.warn("Access denied (missing role) for getOrdreTravails. Token: {}", token);
            return List.of();
        }
        if (role.equals("ADMIN")) {
            return ordreTravailService.retrieveAllOrdreTravails();
        } else if (role.equals("CHEFOP") || role.equals("CHEFTECH")) {
            if (department == null) return List.of();
            return ordreTravailService.retrieveOrdreTravailsByDepartment(DepartmentType.valueOf(department));
        } else if (role.equals("TECHNICIEN")) {
            if (userId == null) return List.of();
            return ordreTravailService.retrieveOrdreTravailsByAssignedTo(userId);
        } else {
            return List.of();
        }
    }

    @GetMapping("/retrieve-ordreTravail/{id}")
    public ResponseEntity<OrdreTravail> getOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? jwtUtil.getUserIdFromToken(token) : null;
        OrdreTravail ordre = ordreTravailService.retrieveOrdreTravail(id);
        if (ordre == null) return ResponseEntity.notFound().build();
        if (role == null) {
            log.warn("Access denied (missing role) for getOrdreTravail id={}. Token: {}", id, token);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: missing or invalid role."));
        }
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(ordre);
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null && ordre.getDepartment() != null && ordre.getDepartment().name().equals(department)) {
            return ResponseEntity.ok(ordre);
        } else if (role.equals("TECHNICIEN") && userId != null && ordre.getAssignedTo() != null && ordre.getAssignedTo().equals(userId)) {
            return ResponseEntity.ok(ordre);
        } else {
            log.warn("Access denied for getOrdreTravail id={} by userId={}, role={}, department={}", id, userId, role, department);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: insufficient permissions for this work order."));
        }
    }

    @PostMapping("/add-ordreTravail")
    public ResponseEntity<OrdreTravail> addOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody OrdreTravail ordreTravail) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        if (role == null) {
            log.warn("Access denied (missing role) for addOrdreTravail. Token: {}", token);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: missing or invalid role."));
        }
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(ordreTravailService.addOrdreTravail(ordreTravail));
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null) {
            ordreTravail.setDepartment(DepartmentType.valueOf(department));
            return ResponseEntity.ok(ordreTravailService.addOrdreTravail(ordreTravail));
        } else {
            log.warn("Access denied for addOrdreTravail by userId={}, role={}, department={}", userId, role, department);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: insufficient permissions to add work order."));
        }
    }

    @PutMapping("/update-ordreTravail")
    public ResponseEntity<OrdreTravail> updateOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody OrdreTravail ordreTravail) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? jwtUtil.getUserIdFromToken(token) : null;
        if (role == null) {
            log.warn("Access denied (missing role) for updateOrdreTravail. Token: {}", token);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: missing or invalid role."));
        }
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(ordreTravailService.modifyOrdreTravail(ordreTravail));
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null && ordreTravail.getDepartment() != null && ordreTravail.getDepartment().name().equals(department)) {
            return ResponseEntity.ok(ordreTravailService.modifyOrdreTravail(ordreTravail));
        } else if (role.equals("TECHNICIEN") && userId != null && ordreTravail.getAssignedTo() != null && ordreTravail.getAssignedTo().equals(userId)) {
            return ResponseEntity.ok(ordreTravailService.modifyOrdreTravail(ordreTravail));
        } else {
            log.warn("Access denied for updateOrdreTravail id={} by userId={}, role={}, department={}", ordreTravail.getId(), userId, role, department);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: insufficient permissions to update work order."));
        }
    }

    @PutMapping("/assign-ordreTravail/{id}")
    public ResponseEntity<OrdreTravail> assignOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id, @RequestParam Long technicienId) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        if (role == null) {
            log.warn("Access denied (missing role) for assignOrdreTravail. Token: {}", token);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: missing or invalid role."));
        }
        OrdreTravail ordre = ordreTravailService.retrieveOrdreTravail(id);
        if (ordre == null) return ResponseEntity.notFound().build();
        if (role.equals("ADMIN") || ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null && ordre.getDepartment() != null && ordre.getDepartment().name().equals(department))) {
            ordre.setAssignedTo(technicienId);
            log.info("Work order id={} assigned to technicienId={} by userId={}, role={}, department={}", id, technicienId, userId, role, department);
            return ResponseEntity.ok(ordreTravailService.modifyOrdreTravail(ordre));
        } else {
            log.warn("Access denied for assignOrdreTravail id={} by userId={}, role={}, department={}", id, userId, role, department);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: insufficient permissions to assign work order."));
        }
    }

    @PutMapping("/update-status-ordreTravail/{id}")
    public ResponseEntity<OrdreTravail> updateStatusOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id, @RequestParam String statut) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        Long userId = token != null ? jwtUtil.getUserIdFromToken(token) : null;
        OrdreTravail ordre = ordreTravailService.retrieveOrdreTravail(id);
        if (ordre == null) return ResponseEntity.notFound().build();
        if (role == null) {
            log.warn("Access denied (missing role) for updateStatusOrdreTravail. Token: {}", token);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: missing or invalid role."));
        }
        if (role.equals("ADMIN") || role.equals("CHEFOP") || role.equals("CHEFTECH") || (role.equals("TECHNICIEN") && userId != null && ordre.getAssignedTo() != null && ordre.getAssignedTo().equals(userId))) {
            // Assume statut is a valid enum value; add validation as needed
            ordre.setStatut(com.eam.common.enums.Statut.valueOf(statut));
            log.info("Work order id={} status updated to {} by userId={}, role={}, department={}", id, statut, userId, role, department);
            return ResponseEntity.ok(ordreTravailService.modifyOrdreTravail(ordre));
        } else {
            log.warn("Access denied for updateStatusOrdreTravail id={} by userId={}, role={}, department={}", id, userId, role, department);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: insufficient permissions to update status."));
        }
    }

    @DeleteMapping("/delete-ordreTravail/{id}")
    public ResponseEntity<Void> deleteOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        if (role == null) {
            log.warn("Access denied (missing role) for deleteOrdreTravail. Token: {}", token);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: missing or invalid role."));
        }
        if (role.equals("ADMIN")) {
            ordreTravailService.removeOrdreTravail(id);
            log.info("Work order id={} deleted by userId={}, role={}, department={}", id, userId, role, department);
            return ResponseEntity.ok().build();
        } else {
            log.warn("Access denied for deleteOrdreTravail id={} by userId={}, role={}, department={}", id, userId, role, department);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: insufficient permissions to delete work order."));
        }
    }
}
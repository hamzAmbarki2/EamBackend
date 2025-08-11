package com.eam.workorder.control;

import com.eam.workorder.config.WorkOrderJwtUtil;
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
import com.eam.common.security.RoleAllowed;
import org.springframework.security.access.AccessDeniedException;

@RestController
@RequestMapping("/api/ordreTravail")
@AllArgsConstructor
public class OrdreTravailRestController {

    private final IOrdreTravailService ordreTravailService;
    
    @Autowired
    private WorkOrderJwtUtil workOrderJwtUtil;

    private static final Logger log = LoggerFactory.getLogger(OrdreTravailRestController.class);

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-all-ordreTravails")
    public List<OrdreTravail> getOrdreTravails(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? workOrderJwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? workOrderJwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? workOrderJwtUtil.getUserIdFromToken(token) : null;
        if (role.equals("ADMIN")) {
            return ordreTravailService.retrieveAllOrdreTravails();
        } else if (role.equals("CHEFOP") || role.equals("CHEFTECH") || role.equals("TECHNICIEN")) {
            if (department == null) return List.of();
            return ordreTravailService.retrieveOrdreTravailsByDepartment(DepartmentType.valueOf(department));
        } else {
            String msg = "Access denied: Only ADMIN, CHEFOP, CHEFTECH, or TECHNICIEN with a department can list work orders (non-admins limited to their department).";
            log.warn(msg);
            throw new AccessDeniedException(msg);
        }
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-ordreTravail/{id}")
    public ResponseEntity<OrdreTravail> getOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? workOrderJwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? workOrderJwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? workOrderJwtUtil.getUserIdFromToken(token) : null;
        OrdreTravail ordre = ordreTravailService.retrieveOrdreTravail(id);
        if (ordre == null) return ResponseEntity.notFound().build();
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(ordre);
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH") || role.equals("TECHNICIEN")) && department != null && ordre.getDepartment() != null && ordre.getDepartment().name().equals(department)) {
            return ResponseEntity.ok(ordre);
        } else {
            String msg = "Access denied: Non-admins can only access work orders within their department.";
            log.warn("{}", msg);
            throw new AccessDeniedException(msg);
        }
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PostMapping("/add-ordreTravail")
    public ResponseEntity<OrdreTravail> addOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody OrdreTravail ordreTravail) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? workOrderJwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? workOrderJwtUtil.getDepartmentFromToken(token) : null;
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(ordreTravailService.addOrdreTravail(ordreTravail));
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null) {
            ordreTravail.setDepartment(DepartmentType.valueOf(department));
            return ResponseEntity.ok(ordreTravailService.addOrdreTravail(ordreTravail));
        } else {
            String msg = "Access denied: Only ADMIN, or CHEF roles within their department, can add work orders.";
            log.warn("{}", msg);
            throw new AccessDeniedException(msg);
        }
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @PutMapping("/update-ordreTravail")
    public ResponseEntity<OrdreTravail> updateOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody OrdreTravail ordreTravail) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? workOrderJwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? workOrderJwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? workOrderJwtUtil.getUserIdFromToken(token) : null;
        if (ordreTravail.getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        OrdreTravail existing = ordreTravailService.retrieveOrdreTravail(ordreTravail.getId());
        if (existing == null) return ResponseEntity.notFound().build();
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(ordreTravailService.modifyOrdreTravail(ordreTravail));
        } else if ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null && existing.getDepartment() != null && existing.getDepartment().name().equals(department)) {
            // enforce department scope on existing record and prevent department change
            ordreTravail.setDepartment(existing.getDepartment());
            return ResponseEntity.ok(ordreTravailService.modifyOrdreTravail(ordreTravail));
        } else if (role.equals("TECHNICIEN") && userId != null && existing.getAssignedTo() != null && existing.getAssignedTo().equals(userId)) {
            // allow only if persisted assignment is to current user
            return ResponseEntity.ok(ordreTravailService.modifyOrdreTravail(ordreTravail));
        } else {
            String msg = "Access denied: ADMIN can update any work order; CHEF roles only within their department; TECHNICIEN only if assigned.";
            log.warn("{}", msg);
            throw new AccessDeniedException(msg);
        }
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PutMapping("/assign-ordreTravail/{id}")
    public ResponseEntity<OrdreTravail> assignOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id, @RequestParam Long technicienId) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? workOrderJwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? workOrderJwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? workOrderJwtUtil.getUserIdFromToken(token) : null;
        OrdreTravail ordre = ordreTravailService.retrieveOrdreTravail(id);
        if (ordre == null) return ResponseEntity.notFound().build();
        if (role.equals("ADMIN") || ((role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null && ordre.getDepartment() != null && ordre.getDepartment().name().equals(department))) {
            ordre.setAssignedTo(technicienId);
            log.info("Work order id={} assigned to technicienId={} by userId={}, role={}, department={}", id, technicienId, userId, role, department);
            return ResponseEntity.ok(ordreTravailService.modifyOrdreTravail(ordre));
        } else {
            String msg = "Access denied: Only ADMIN, or CHEF roles within their department, can assign work orders.";
            log.warn("{}", msg);
            throw new AccessDeniedException(msg);
        }
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @PutMapping("/update-status-ordreTravail/{id}")
    public ResponseEntity<OrdreTravail> updateStatusOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id, @RequestParam String statut) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? workOrderJwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? workOrderJwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? workOrderJwtUtil.getUserIdFromToken(token) : null;
        OrdreTravail ordre = ordreTravailService.retrieveOrdreTravail(id);
        if (ordre == null) return ResponseEntity.notFound().build();
        boolean isChefWithDept = (role.equals("CHEFOP") || role.equals("CHEFTECH")) && department != null && ordre.getDepartment() != null && ordre.getDepartment().name().equals(department);
        if (role.equals("ADMIN") || isChefWithDept || (role.equals("TECHNICIEN") && userId != null && ordre.getAssignedTo() != null && ordre.getAssignedTo().equals(userId))) {
            ordre.setStatut(com.eam.common.enums.Statut.valueOf(statut));
            log.info("Work order id={} status updated to {} by userId={}, role={}, department={}", id, statut, userId, role, department);
            return ResponseEntity.ok(ordreTravailService.modifyOrdreTravail(ordre));
        } else {
            String msg = "Access denied: Only ADMIN, CHEF roles within their department, or assigned TECHNICIEN can update status.";
            log.warn("{}", msg);
            throw new AccessDeniedException(msg);
        }
    }

    @RoleAllowed({"ADMIN"})
    @DeleteMapping("/delete-ordreTravail/{id}")
    public ResponseEntity<Void> deleteOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? workOrderJwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? workOrderJwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? workOrderJwtUtil.getUserIdFromToken(token) : null;
        if (role.equals("ADMIN")) {
            ordreTravailService.removeOrdreTravail(id);
            log.info("Work order id={} deleted by userId={}, role={}, department={}", id, userId, role, department);
            return ResponseEntity.ok().build();
        } else {
            String msg = "Access denied: Only ADMIN can delete work orders.";
            log.warn("{}", msg);
            throw new AccessDeniedException(msg);
        }
    }
}
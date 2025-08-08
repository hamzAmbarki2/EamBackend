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

@RestController
@RequestMapping("/api/ordreTravail")
@AllArgsConstructor
public class OrdreTravailRestController {

    private final IOrdreTravailService ordreTravailService;
    
    @Autowired
    private com.eam.workorder.config.JwtUtil jwtUtil;

    @GetMapping("/retrieve-all-ordreTravails")
    public List<OrdreTravail> getOrdreTravails(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? jwtUtil.getUserIdFromToken(token) : null;
        // TODO: Enforce permissions matrix here
        return ordreTravailService.retrieveAllOrdreTravails();
    }

    @GetMapping("/retrieve-ordreTravail/{id}")
    public ResponseEntity<OrdreTravail> getOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? jwtUtil.getUserIdFromToken(token) : null;
        // TODO: Enforce permissions matrix here
        OrdreTravail dto = ordreTravailService.retrieveOrdreTravail(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/add-ordreTravail")
    public OrdreTravail addOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody OrdreTravail ordreTravail) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? jwtUtil.getUserIdFromToken(token) : null;
        // TODO: Set ordreTravail.department and enforce permissions matrix here
        return ordreTravailService.addOrdreTravail(ordreTravail);
    }

    @PutMapping("/update-ordreTravail")
    public OrdreTravail updateOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @Valid @RequestBody OrdreTravail ordreTravail) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? jwtUtil.getUserIdFromToken(token) : null;
        // TODO: Enforce permissions matrix here
        return ordreTravailService.modifyOrdreTravail(ordreTravail);
    }

    @DeleteMapping("/delete-ordreTravail/{id}")
    public void deleteOrdreTravail(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtUtil.getRoleFromToken(token) : null;
        String department = token != null ? jwtUtil.getDepartmentFromToken(token) : null;
        Long userId = token != null ? jwtUtil.getUserIdFromToken(token) : null;
        // TODO: Enforce permissions matrix here
        ordreTravailService.removeOrdreTravail(id);
    }
}
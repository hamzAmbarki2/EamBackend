package com.eam.user.controller;

import com.eam.user.entity.User;
import com.eam.user.service.IUserService;
import com.eam.user.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import com.eam.user.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import com.eam.common.security.RoleAllowed;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserRestController {

    private final IUserService userService;

    @Autowired
    private JwtProvider jwtProvider;

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @GetMapping("/retrieve-all-users")
    public List<UserDto> getUsers(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtProvider.getRoleFromToken(token) : null;
        String department = token != null ? jwtProvider.getDepartmentFromToken(token) : null;
        if ("ADMIN".equals(role)) {
            return userService.retrieveAllUsers();
        }
        if (("CHEFOP".equals(role) || "CHEFTECH".equals(role)) && department != null) {
            return userService.retrieveUsersByDepartment(com.eam.common.enums.DepartmentType.valueOf(department));
        }
        return List.of();
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-user/{id}")
    public ResponseEntity<UserDto> getUser(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        String role = token != null ? jwtProvider.getRoleFromToken(token) : null;
        String department = token != null ? jwtProvider.getDepartmentFromToken(token) : null;
        Long userId = token != null ? jwtProvider.getUserIdFromToken(token) : null;
        UserDto dto = userService.retrieveUser(id);
        if (dto == null) return ResponseEntity.notFound().build();
        if ("ADMIN".equals(role)) return ResponseEntity.ok(dto);
        if (("CHEFOP".equals(role) || "CHEFTECH".equals(role)) && department != null && dto.getDepartment() != null && dto.getDepartment().name().equals(department)) {
            return ResponseEntity.ok(dto);
        }
        if ("TECHNICIEN".equals(role) && userId != null && dto.getId() != null && dto.getId().equals(userId)) {
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.status(403).build();
    }

    @RoleAllowed({"ADMIN", "CHEFOP"})
    @PostMapping("/add-user")
    public UserDto addUser(@Valid @RequestBody UserDto userDto) {
        return userService.addUser(userDto);
    }

    @RoleAllowed({"ADMIN", "CHEFOP"})
    @PutMapping("/update-user")
    public UserDto updateUser(@Valid @RequestBody UserDto userDto) {
        return userService.modifyUser(userDto);
    }

    @RoleAllowed({"ADMIN"})
    @DeleteMapping("/delete-user/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.removeUser(id);
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        if (token == null) {
            return ResponseEntity.status(401).build();
        }
        String email = jwtProvider.getEmailFromToken(token);
        UserDto user = userService.getCurrentUserProfile(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateOwnProfile(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody UserDto update) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        if (token == null) {
            return ResponseEntity.status(401).build();
        }
        Long userId = jwtProvider.getUserIdFromToken(token);
        if (userId == null) return ResponseEntity.status(401).build();
        UserDto saved = userService.updateOwnProfile(userId, update);
        return ResponseEntity.ok(saved);
    }
}


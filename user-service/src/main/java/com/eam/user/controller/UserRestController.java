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

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserRestController {

    private final IUserService userService;

    @Autowired
    private JwtProvider jwtProvider;

    @GetMapping("/retrieve-all-users")
    public List<UserDto> getUsers() {
        return userService.retrieveAllUsers();
    }

    @GetMapping("/retrieve-user/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        UserDto dto = userService.retrieveUser(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/add-user")
    public UserDto addUser(@Valid @RequestBody UserDto userDto) {
        return userService.addUser(userDto);
    }

    @PutMapping("/update-user")
    public UserDto updateUser(@Valid @RequestBody UserDto userDto) {
        return userService.modifyUser(userDto);
    }

    @DeleteMapping("/delete-user/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.removeUser(id);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        if (token == null) {
            return ResponseEntity.status(401).build();
        }
        String email = jwtProvider.getEmailFromToken(token);
        String role = jwtProvider.getRoleFromToken(token);
        // All roles can access their own profile
        UserDto user = userService.getCurrentUserProfile(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        // No further department check needed for self-profile
        return ResponseEntity.ok(user);
    }
}


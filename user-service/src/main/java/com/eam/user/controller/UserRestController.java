package com.eam.user.controller;

import com.eam.user.entity.User;
import com.eam.user.service.IUserService;
import com.eam.user.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserRestController {

    private final IUserService userService;

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
    public UserDto getProfile() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.getCurrentUserProfile(email);
    }

    @PutMapping("/profile")
    public UserDto updateProfile(@Valid @RequestBody UserDto userDto) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.updateCurrentUserProfile(email, userDto);
    }

    @PostMapping("/logout")
    public void logout() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userService.logout(email);
    }
}


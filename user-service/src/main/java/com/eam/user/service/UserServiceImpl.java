package com.eam.user.service;

import com.eam.user.dto.UserDto;
import com.eam.user.entity.User;
import com.eam.user.enums.DepartmentType;
import com.eam.user.enums.Role;
import com.eam.user.enums.StatusType;
import com.eam.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDto> retrieveAllUsers() {
        String currentEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(currentEmail).orElseThrow(() -> new RuntimeException("Current user not found"));
        if (currentUser.getRole() == Role.ADMIN) {
            return userRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
        } else if (currentUser.getRole() == Role.CHEFOP || currentUser.getRole() == Role.CHEFTECH) {
            return userRepository.findAllByDepartment(currentUser.getDepartment()).stream().map(this::convertToDto).collect(Collectors.toList());
        } else {
            // TECHNICIEN: no access
            throw new RuntimeException("Access denied");
        }
    }

    @Override
    public UserDto retrieveUser(Long id) {
        String currentEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(currentEmail).orElseThrow(() -> new RuntimeException("Current user not found"));
        if (currentUser.getRole() == Role.ADMIN) {
            return userRepository.findById(id).map(this::convertToDto).orElse(null);
        } else if (currentUser.getRole() == Role.CHEFOP || currentUser.getRole() == Role.CHEFTECH) {
            return userRepository.findByIdAndDepartment(id, currentUser.getDepartment()).map(this::convertToDto).orElse(null);
        } else if (currentUser.getRole() == Role.TECHNICIEN) {
            if (currentUser.getId().equals(id)) {
                return convertToDto(currentUser);
            } else {
                throw new RuntimeException("Access denied");
            }
        } else {
            throw new RuntimeException("Access denied");
        }
    }

    @Override
    public UserDto addUser(UserDto userDto) {
        String currentEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(currentEmail).orElseThrow(() -> new RuntimeException("Current user not found"));
        if (currentUser.getRole() == Role.ADMIN || currentUser.getRole() == Role.CHEFOP) {
            // Only allow adding users to own department for CHEFOP
            if (currentUser.getRole() != Role.ADMIN) {
                userDto.setDepartment(currentUser.getDepartment());
            }
            User user = convertToEntity(userDto);
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            User savedUser = userRepository.save(user);
            return convertToDto(savedUser);
        } else {
            throw new RuntimeException("Access denied");
        }
    }

    @Override
    public void removeUser(Long id) {
        String currentEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(currentEmail).orElseThrow(() -> new RuntimeException("Current user not found"));
        if (currentUser.getRole() == Role.ADMIN) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("Access denied");
        }
    }

    @Override
    public UserDto modifyUser(UserDto userDto) {
        String currentEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(currentEmail).orElseThrow(() -> new RuntimeException("Current user not found"));
        User existingUser = userRepository.findById(userDto.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        if (currentUser.getRole() == Role.ADMIN || (currentUser.getRole() == Role.CHEFOP && existingUser.getDepartment() == currentUser.getDepartment())) {
            // Only allow CHEFOP to update users in their department
            existingUser.setEmail(userDto.getEmail());
            if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
            }
            existingUser.setRole(userDto.getRole());
            existingUser.setPhone(userDto.getPhone());
            existingUser.setCIN(userDto.getCIN());
            existingUser.setDepartment(userDto.getDepartment());
            existingUser.setStatus(userDto.getStatus());
            existingUser.setAvatar(userDto.getAvatar());
            User savedUser = userRepository.save(existingUser);
            return convertToDto(savedUser);
        } else {
            throw new RuntimeException("Access denied");
        }
    }

    @Override
    public UserDto getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }

    @Override
    public UserDto updateCurrentUserProfile(String email, UserDto userDto) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        user.setPhone(userDto.getPhone());
        user.setCIN(userDto.getCIN());
        user.setAvatar(userDto.getAvatar());
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public void logout(String email) {
        // Stateless JWT: nothing to do server-side, but method exists for frontend compatibility
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPhone(user.getPhone());
        dto.setCIN(user.getCIN());
        dto.setDepartment(user.getDepartment());
        dto.setStatus(user.getStatus());
        dto.setAvatar(user.getAvatar());
        return dto;
    }

    private User convertToEntity(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole() != null ? dto.getRole() :Role.TECHNICIEN);
        user.setPhone(dto.getPhone());
        user.setCIN(dto.getCIN());
        user.setDepartment(dto.getDepartment());
        user.setStatus(dto.getStatus() != null ? dto.getStatus() : StatusType.ACTIVE);
        user.setAvatar(dto.getAvatar());
        return user;
    }
}


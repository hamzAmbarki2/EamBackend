package com.eam.user.service;

import com.eam.user.dto.UserDto;
import com.eam.user.entity.User;
import com.eam.user.enums.Role;
import com.eam.user.enums.StatusType;
import com.eam.user.repository.UserRepository;
import lombok.AllArgsConstructor;
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
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto retrieveUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        return user != null ? convertToDto(user) : null;
    }

    @Override
    public UserDto addUser(UserDto userDto) {
        User user = convertToEntity(userDto);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public void removeUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDto modifyUser(UserDto userDto) {
        User existingUser = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

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
    }

    @Override
    public UserDto getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        return user != null ? convertToDto(user) : null;
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


package com.eam.user.service;

import com.eam.user.dto.UserDto;
import com.eam.user.dto.CredentialsDto;
import com.eam.user.entity.User;
import com.eam.user.entity.VerificationToken;
import com.eam.user.enums.Role;
import com.eam.user.enums.StatusType;
import com.eam.user.repository.UserRepository;
import com.eam.user.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final EmailService emailService;
    private final TokenService tokenService;

    @Override
    public UserDto register(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(userDto.getRole() != null ? userDto.getRole() : Role.TECHNICIEN);
        user.setPhone(userDto.getPhone());
        user.setCIN(userDto.getCIN());
        user.setDepartment(userDto.getDepartment());
        user.setStatus(StatusType.PENDING);
        user.setAvatar(userDto.getAvatar());

        User savedUser = userRepository.save(user);

        log.debug("Attempting to send verification email to: {}", savedUser.getEmail());
        sendVerificationEmail(savedUser.getEmail());
        log.info("Verification email sent for user: {}", savedUser.getEmail());

        return convertToDto(savedUser);
    }

    @Override
    public String login(CredentialsDto credentialsDto) {
        User user = userRepository.findByEmail(credentialsDto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(credentialsDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (user.getStatus() == StatusType.PENDING) {
            throw new RuntimeException("Account pending. Please verify your email.");
        }

        if (user.getStatus() == StatusType.INACTIVE || user.getStatus() == StatusType.SUSPENDED) {
            throw new RuntimeException("Account is inactive or suspended. Please contact support.");
        }

        log.info("Connexion réussie pour l'utilisateur : {}", user.getEmail());
        return jwtProvider.generateToken(user.getEmail(), user.getRole().toString(),
                user.getDepartment() != null ? user.getDepartment().name() : null);
    }

    @Override
    public void resetPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        VerificationToken resetToken = tokenService.generatePasswordResetToken(user);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), user.getEmail(), resetToken.getToken());
            log.info("E-mail de réinitialisation de mot de passe envoyé pour : {}", user.getEmail());
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'e-mail de réinitialisation pour : {}", user.getEmail(), e);
            throw new RuntimeException("Erreur lors de l'envoi de l'e-mail de réinitialisation");
        }
    }

    @Override
    public void verifyEmail(String token) {
        Optional<User> userOptional = tokenService.validateEmailVerificationToken(token);
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid or expired verification token");
        }

        User user = userOptional.get();
        
        if (user.getStatus() == StatusType.PENDING) {
            user.setStatus(StatusType.ACTIVE);
            userRepository.save(user);
            log.info("Compte vérifié avec succès pour l'utilisateur : {}", user.getEmail());
        } else {
            throw new RuntimeException("Account is already verified or not in pending status");
        }
    }

    @Override
    public void sendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != StatusType.PENDING) {
            throw new RuntimeException("Account is already verified");
        }

        VerificationToken verificationToken = tokenService.generateEmailVerificationToken(user);
        emailService.sendAccountVerificationEmail(user.getEmail(), user.getEmail(), verificationToken.getToken());
        log.info("E-mail de vérification envoyé pour : {}", user.getEmail());
    }

    @Override
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != StatusType.PENDING) {
            throw new RuntimeException("Account is already verified");
        }

        if (tokenService.hasValidToken(user, VerificationToken.TokenType.EMAIL_VERIFICATION)) {
            throw new RuntimeException("A verification email was already sent recently. Please check your inbox or wait before requesting a new one.");
        }

        VerificationToken verificationToken = tokenService.generateEmailVerificationToken(user);
        emailService.resendVerificationEmail(user.getEmail(), user.getEmail(), verificationToken.getToken());
        log.info("E-mail de re-vérification envoyé pour : {}", user.getEmail());
    }

    @Override
    public String refreshToken(String refreshToken) {
        // TODO: Implement refresh token logic
        return jwtProvider.generateToken("user@example.com", "USER", null);
    }

    public void resetPasswordWithToken(String token, String newPassword) {
        Optional<User> userOptional = tokenService.validatePasswordResetToken(token);
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        log.info("Mot de passe réinitialisé avec succès pour l'utilisateur : {}", user.getEmail());
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

    public void sendTestEmail(String toEmail) {
        emailService.sendTestEmail(toEmail);
    }
}
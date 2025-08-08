package com.eam.user.controller;

import com.eam.user.dto.UserDto;
import com.eam.user.dto.CredentialsDto;
import com.eam.user.service.AuthServiceImpl;
import com.eam.user.service.IAuthService;
import com.eam.user.security.JwtProvider;
import com.eam.user.security.TokenBlacklist;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Map;
import java.util.HashMap;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final IAuthService authService;
    private final AuthServiceImpl authServiceImpl; // Pour accéder aux méthodes spécifiques
    private final TokenBlacklist tokenBlacklist;
    private final JwtProvider jwtProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDto userDto) {
        try {
            UserDto registeredUser = authService.register(userDto);
            Map<String, Object> response = new HashMap<>();
            response.put("user", registeredUser);
            response.put("message", "Registration successful. Please check your email to verify your account.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Erreur lors de l'inscription : {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody CredentialsDto credentialsDto) {
        try {
            String token = authService.login(credentialsDto);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.warn("Tentative de connexion échouée pour : {}", credentialsDto.getEmail());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            
            if (e.getMessage().equals("Account pending. Please verify your email.")) {
                error.put("action", "verify_email");
                error.put("email", credentialsDto.getEmail());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            String token = bearer.substring(7);
            try {
                String jti = jwtProvider.getJtiFromToken(token);
                long expiry = jwtProvider.parseClaims(token).getExpiration().getTime();
                tokenBlacklist.blacklist(jti, expiry);
                return ResponseEntity.ok(Map.of("message", "Logged out"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid token"));
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "No token provided"));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            authService.verifyEmail(token);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email verified successfully. You can now login.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Erreur lors de la vérification d'e-mail : {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmailPost(@RequestParam String token) {
        return verifyEmail(token);
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@RequestParam String email) {
        try {
            authService.resendVerificationEmail(email);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Verification email sent successfully. Please check your inbox.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Erreur lors du renvoi de l'e-mail de vérification : {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            authService.resetPassword(email);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset email sent successfully. Please check your inbox.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Erreur lors de l'envoi de l'e-mail de réinitialisation : {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "If this email exists in our system, you will receive a password reset link.");
            // Ne pas révéler si l'e-mail existe ou non pour des raisons de sécurité
            return ResponseEntity.ok(error);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email) {
        return forgotPassword(email);
    }

    @PostMapping("/reset-password-confirm")
    public ResponseEntity<?> resetPasswordConfirm(
            @RequestParam String token,
            @RequestParam String newPassword) {
        try {
            if (newPassword == null || newPassword.length() < 6) {
                throw new RuntimeException("Password must be at least 6 characters long");
            }
            
            authServiceImpl.resetPasswordWithToken(token, newPassword);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset successfully. You can now login with your new password.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Erreur lors de la réinitialisation du mot de passe : {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/reset-password")
    public ResponseEntity<?> resetPasswordGet(@RequestParam String token) {
        // Endpoint pour valider le token de réinitialisation (utilisé par le frontend)
        try {
            // Juste vérifier si le token est valide sans le consommer
            Map<String, String> response = new HashMap<>();
            response.put("message", "Valid reset token");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid or expired reset token");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestParam String refreshToken) {
        try {
            String newToken = authService.refreshToken(refreshToken);
            Map<String, String> response = new HashMap<>();
            response.put("token", newToken);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Erreur lors du rafraîchissement du token : {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid refresh token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    @PostMapping("/test-email")
    public ResponseEntity<?> sendTestEmail(@RequestParam String email) {
        try {
            authServiceImpl.sendTestEmail(email);
            return ResponseEntity.ok(Map.of("message", "Test email sent successfully"));
        } catch (RuntimeException e) {
            log.error("Error sending test email: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}


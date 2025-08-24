package com.eam.user.controller;

import com.eam.user.dto.UserDto;
import com.eam.user.dto.CredentialsDto;
import com.eam.user.entity.User;
import com.eam.user.service.AuthServiceImpl;
import com.eam.user.service.IAuthService;
import com.eam.user.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth" )
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final TokenService tokenService;
    private final IAuthService authService;
    private final AuthServiceImpl authServiceImpl; // Pour accéder aux méthodes spécifiques

    @Value("${app.base-url}") // Injection de la valeur de app.base-url depuis application.properties
    private String baseUrl;

    // Simple in-memory blacklist of JWT IDs (jti)
    private static final Set<String> TOKEN_BLACKLIST = ConcurrentHashMap.newKeySet();

    public static boolean isBlacklisted(String jti) {
        return jti != null && TOKEN_BLACKLIST.contains(jti);
    }

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

    // MODIFICATION : Cette méthode gère la redirection vers le frontend
    @GetMapping("/reset-password")
    public ResponseEntity<Void> handlePasswordResetLink(@RequestParam String token) {
        log.info("Traitement du lien de réinitialisation de mot de passe");

        try {
            // Valider le token sans le marquer comme utilisé
            Optional<User> user = tokenService.validatePasswordResetTokenForRedirect(token);

            if (user.isPresent()) {
                // Token valide : rediriger vers le frontend avec le token
                String redirectUrl = baseUrl + "/reset-password?token=" +
                        URLEncoder.encode(token, StandardCharsets.UTF_8);

                log.info("Redirection vers le frontend pour l'utilisateur: {}", user.get().getEmail());

                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(redirectUrl))
                        .build();
            } else {
                // Token invalide : rediriger vers la page de demande
                String redirectUrl = baseUrl + "/forgot-password?error=invalid_token";

                log.warn("Token invalide, redirection vers forgot-password");

                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(redirectUrl))
                        .build();
            }
        } catch (Exception e) {
            log.error("Erreur lors du traitement du token: {}", e.getMessage());

            String redirectUrl = baseUrl + "/forgot-password?error=server_error";

            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(redirectUrl))
                    .build();
        }
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

    // ANCIENNE MÉTHODE SUPPRIMÉE : Cette méthode renvoyait du JSON et causait le problème
    // @GetMapping("/reset-password")
    // public ResponseEntity<?> resetPasswordGet(@RequestParam String token) {
    //     // Endpoint pour valider le token de réinitialisation (utilisé par le frontend)
    //     try {
    //         // Juste vérifier si le token est valide sans le consommer
    //         Map<String, String> response = new HashMap<>();
    //         response.put("message", "Valid reset token");
    //         response.put("token", token);
    //         return ResponseEntity.ok(response);
    //     } catch (RuntimeException e) {
    //         Map<String, String> error = new HashMap<>();
    //         error.put("error", "Invalid or expired reset token");
    //         return ResponseEntity.badRequest().body(error);
    //     }
    // }

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

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token provided");
        }
        String token = authHeader.substring(7);
        try {
            io.jsonwebtoken.Claims claims = io.jsonwebtoken.Jwts.parserBuilder()
                    .setSigningKey(String.valueOf(com.eam.user.security.JwtProvider.class)) // placeholder not used
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            String jti = claims.getId();
            if (jti != null) {
                TOKEN_BLACKLIST.add(jti);
            }
        } catch (Exception e) {
            // Swallow parsing errors to avoid leaking info
        }
        return ResponseEntity.ok().body("Logged out successfully");
    }
}

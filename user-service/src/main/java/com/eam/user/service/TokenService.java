package com.eam.user.service;

import com.eam.user.entity.User;
import com.eam.user.entity.VerificationToken;
import com.eam.user.repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TokenService {

    private final VerificationTokenRepository tokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Génère un token de vérification d'e-mail
     */
    public VerificationToken generateEmailVerificationToken(User user) {
        // Marquer tous les anciens tokens de vérification comme utilisés
        tokenRepository.markAllTokensAsUsedByUserAndType(user, VerificationToken.TokenType.EMAIL_VERIFICATION);
        
        String token = generateSecureToken();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24); // Expire dans 24 heures
        
        VerificationToken verificationToken = new VerificationToken(
            token, 
            user, 
            VerificationToken.TokenType.EMAIL_VERIFICATION, 
            expiryDate
        );
        
        return tokenRepository.save(verificationToken);
    }

    /**
     * Génère un token de réinitialisation de mot de passe
     */
    public VerificationToken generatePasswordResetToken(User user) {
        // Marquer tous les anciens tokens de réinitialisation comme utilisés
        tokenRepository.markAllTokensAsUsedByUserAndType(user, VerificationToken.TokenType.PASSWORD_RESET);
        
        String token = generateSecureToken();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(1); // Expire dans 1 heure
        
        VerificationToken verificationToken = new VerificationToken(
            token, 
            user, 
            VerificationToken.TokenType.PASSWORD_RESET, 
            expiryDate
        );
        
        return tokenRepository.save(verificationToken);
    }

    /**
     * Valide un token de vérification d'e-mail
     */
    public Optional<User> validateEmailVerificationToken(String token) {
        Optional<VerificationToken> verificationToken = tokenRepository.findByToken(token);
        
        if (verificationToken.isEmpty()) {
            log.warn("Token de vérification non trouvé : {}", token);
            return Optional.empty();
        }
        
        VerificationToken vToken = verificationToken.get();
        
        // Vérifier si le token est du bon type
        if (vToken.getTokenType() != VerificationToken.TokenType.EMAIL_VERIFICATION) {
            log.warn("Token de type incorrect pour la vérification d'e-mail : {}", token);
            return Optional.empty();
        }
        
        // Vérifier si le token a expiré
        if (vToken.isExpired()) {
            log.warn("Token de vérification expiré : {}", token);
            return Optional.empty();
        }
        
        // Vérifier si le token a déjà été utilisé
        if (vToken.isUsed()) {
            log.warn("Token de vérification déjà utilisé : {}", token);
            return Optional.empty();
        }
        
        // Marquer le token comme utilisé
        vToken.markAsUsed();
        tokenRepository.save(vToken);
        
        log.info("Token de vérification validé avec succès pour l'utilisateur : {}", vToken.getUser().getEmail());
        return Optional.of(vToken.getUser());
    }

    /**
     * Valide un token de réinitialisation de mot de passe
     */
    public Optional<User> validatePasswordResetToken(String token) {
        Optional<VerificationToken> verificationToken = tokenRepository.findByToken(token);
        
        if (verificationToken.isEmpty()) {
            log.warn("Token de réinitialisation non trouvé : {}", token);
            return Optional.empty();
        }
        
        VerificationToken vToken = verificationToken.get();
        
        // Vérifier si le token est du bon type
        if (vToken.getTokenType() != VerificationToken.TokenType.PASSWORD_RESET) {
            log.warn("Token de type incorrect pour la réinitialisation : {}", token);
            return Optional.empty();
        }
        
        // Vérifier si le token a expiré
        if (vToken.isExpired()) {
            log.warn("Token de réinitialisation expiré : {}", token);
            return Optional.empty();
        }
        
        // Vérifier si le token a déjà été utilisé
        if (vToken.isUsed()) {
            log.warn("Token de réinitialisation déjà utilisé : {}", token);
            return Optional.empty();
        }
        
        // Marquer le token comme utilisé
        vToken.markAsUsed();
        tokenRepository.save(vToken);
        
        log.info("Token de réinitialisation validé avec succès pour l'utilisateur : {}", vToken.getUser().getEmail());
        return Optional.of(vToken.getUser());
    }

    /**
     * Vérifie si un utilisateur a un token valide
     */
    public boolean hasValidToken(User user, VerificationToken.TokenType tokenType) {
        return tokenRepository.hasValidToken(user, tokenType, LocalDateTime.now());
    }

    /**
     * Génère un token sécurisé
     */
    private String generateSecureToken() {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    /**
     * Tâche planifiée pour nettoyer les tokens expirés (exécutée toutes les heures)
     */
    @Scheduled(fixedRate = 3600000) // 1 heure en millisecondes
    public void cleanupExpiredTokens() {
        log.info("Nettoyage des tokens expirés...");
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Nettoyage des tokens expirés terminé");
    }
    public Optional<User> validatePasswordResetTokenForRedirect(String token) {
        Optional<VerificationToken> verificationToken = tokenRepository.findByToken(token);

        if (verificationToken.isEmpty()) {
            log.warn("Token de réinitialisation non trouvé : {}", token);
            return Optional.empty();
        }

        VerificationToken vToken = verificationToken.get();

        // Vérifier si le token est du bon type
        if (vToken.getTokenType() != VerificationToken.TokenType.PASSWORD_RESET) {
            log.warn("Token de type incorrect pour la réinitialisation : {}", token);
            return Optional.empty();
        }

        // Vérifier si le token a expiré
        if (vToken.isExpired()) {
            log.warn("Token de réinitialisation expiré : {}", token);
            return Optional.empty();
        }

        // Vérifier si le token a déjà été utilisé
        if (vToken.isUsed()) {
            log.warn("Token de réinitialisation déjà utilisé : {}", token);
            return Optional.empty();
        }

        // NE PAS marquer le token comme utilisé ici
        // Il sera marqué comme utilisé lors de la confirmation finale

        log.info("Token de réinitialisation validé pour redirection pour l'utilisateur : {}",
                vToken.getUser().getEmail());
        return Optional.of(vToken.getUser());
    }
}


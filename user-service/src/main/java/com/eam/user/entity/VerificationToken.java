package com.eam.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TokenType tokenType;

    @Column(nullable = false)
    private boolean used = false;

    public enum TokenType {
        EMAIL_VERIFICATION,
        PASSWORD_RESET
    }

    /**
     * Constructeur pour créer un token de vérification
     */
    public VerificationToken(String token, User user, TokenType tokenType, LocalDateTime expiryDate) {
        this.token = token;
        this.user = user;
        this.tokenType = tokenType;
        this.expiryDate = expiryDate;
        this.used = false;
    }

    /**
     * Vérifie si le token a expiré
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }

    /**
     * Marque le token comme utilisé
     */
    public void markAsUsed() {
        this.used = true;
    }
}


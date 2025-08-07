package com.eam.user.repository;

import com.eam.user.entity.User;
import com.eam.user.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    /**
     * Trouve un token par sa valeur
     */
    Optional<VerificationToken> findByToken(String token);

    /**
     * Trouve tous les tokens d'un utilisateur par type
     */
    List<VerificationToken> findByUserAndTokenType(User user, VerificationToken.TokenType tokenType);

    /**
     * Trouve le token le plus récent d'un utilisateur par type
     */
    @Query("SELECT vt FROM VerificationToken vt WHERE vt.user = :user AND vt.tokenType = :tokenType ORDER BY vt.expiryDate DESC")
    Optional<VerificationToken> findLatestByUserAndTokenType(@Param("user") User user, @Param("tokenType") VerificationToken.TokenType tokenType);

    /**
     * Supprime tous les tokens expirés
     */
    @Modifying
    @Query("DELETE FROM VerificationToken vt WHERE vt.expiryDate < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Supprime tous les tokens utilisés d'un utilisateur
     */
    @Modifying
    @Query("DELETE FROM VerificationToken vt WHERE vt.user = :user AND vt.used = true")
    void deleteUsedTokensByUser(@Param("user") User user);

    /**
     * Marque tous les tokens d'un utilisateur comme utilisés pour un type donné
     */
    @Modifying
    @Query("UPDATE VerificationToken vt SET vt.used = true WHERE vt.user = :user AND vt.tokenType = :tokenType")
    void markAllTokensAsUsedByUserAndType(@Param("user") User user, @Param("tokenType") VerificationToken.TokenType tokenType);

    /**
     * Vérifie si un utilisateur a un token valide (non expiré et non utilisé)
     */
    @Query("SELECT COUNT(vt) > 0 FROM VerificationToken vt WHERE vt.user = :user AND vt.tokenType = :tokenType AND vt.used = false AND vt.expiryDate > :now")
    boolean hasValidToken(@Param("user") User user, @Param("tokenType") VerificationToken.TokenType tokenType, @Param("now") LocalDateTime now);
}


package com.eam.user.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklist {
    private final Map<String, Long> blacklistedJtiToExpiry = new ConcurrentHashMap<>();

    public void blacklist(String jti, long expiryEpochMillis) {
        blacklistedJtiToExpiry.put(jti, expiryEpochMillis);
    }

    public boolean isBlacklisted(String jti) {
        if (jti == null) return false;
        Long expiry = blacklistedJtiToExpiry.get(jti);
        if (expiry == null) return false;
        if (expiry < Instant.now().toEpochMilli()) {
            blacklistedJtiToExpiry.remove(jti);
            return false;
        }
        return true;
    }
}
package com.eam.user.security;

import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklist {
    private final Set<String> blacklistedJti = ConcurrentHashMap.newKeySet();

    public void blacklist(String jti) {
        if (jti != null) {
            blacklistedJti.add(jti);
        }
    }

    public boolean isBlacklisted(String jti) {
        return jti != null && blacklistedJti.contains(jti);
    }
}
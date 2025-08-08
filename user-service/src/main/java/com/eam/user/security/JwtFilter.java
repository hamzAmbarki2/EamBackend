package com.eam.user.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final TokenBlacklist tokenBlacklist;

    public JwtFilter(JwtProvider jwtProvider) {
        this(jwtProvider, null);
    }

    public JwtFilter(JwtProvider jwtProvider, TokenBlacklist tokenBlacklist) {
        this.jwtProvider = jwtProvider;
        this.tokenBlacklist = tokenBlacklist;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = getTokenFromRequest(request);

        if (token != null && jwtProvider.validateToken(token) && !jwtProvider.isTokenExpired(token)) {
            String jti = jwtProvider.getJtiFromToken(token);
            if (tokenBlacklist != null && tokenBlacklist.isBlacklisted(jti)) {
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtProvider.getEmailFromToken(token);
            String role = jwtProvider.getRoleFromToken(token);
            String department = jwtProvider.getDepartmentFromToken(token);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    email, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));

            Map<String, Object> details = new HashMap<>();
            details.put("department", department);
            details.put("jti", jti);
            authentication.setDetails(details);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}


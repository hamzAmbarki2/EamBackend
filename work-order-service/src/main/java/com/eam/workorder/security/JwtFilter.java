package com.eam.workorder.security;

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

public class JwtFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    public JwtFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = getTokenFromRequest(request);
        String endpoint = request.getRequestURI();
        String method = request.getMethod();

        if (token != null) {
            try {
                if (jwtProvider.validateToken(token) && !jwtProvider.isTokenExpired(token)) {
                    String email = jwtProvider.getEmailFromToken(token);
                    String role = jwtProvider.getRoleFromToken(token);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            email, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    // Success logging
                    System.out.println("✅ JWT AUTH SUCCESS - Work Order Service");
                    System.out.println("├── User: " + email + " (Role: " + role + ")");
                    System.out.println("├── Endpoint: " + method + " " + endpoint);
                    System.out.println("└── Time: " + java.time.LocalDateTime.now());
                    
                } else {
                    // Token validation failed
                    System.err.println("❌ JWT VALIDATION FAILED - Work Order Service");
                    System.err.println("├── Endpoint: " + method + " " + endpoint);
                    System.err.println("├── Issue: Invalid or expired token");
                    System.err.println("└── Time: " + java.time.LocalDateTime.now());
                }
            } catch (Exception e) {
                System.err.println("❌ JWT PROCESSING ERROR - Work Order Service");
                System.err.println("├── Endpoint: " + method + " " + endpoint);
                System.err.println("├── Error: " + e.getMessage());
                System.err.println("└── Time: " + java.time.LocalDateTime.now());
            }
        } else if (!endpoint.contains("/swagger") && !endpoint.contains("/v3/api-docs")) {
            // Missing token for protected endpoint
            System.err.println("⚠️  NO JWT TOKEN - Work Order Service");
            System.err.println("├── Endpoint: " + method + " " + endpoint);
            System.err.println("├── Issue: Authorization header missing");
            System.err.println("└── Time: " + java.time.LocalDateTime.now());
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
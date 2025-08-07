package com.eam.workorder.config;

import com.eam.workorder.security.JwtFilter;
import com.eam.workorder.security.JwtProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.AuthenticationEntryPoint;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public JwtFilter jwtFilter(JwtProvider jwtProvider) {
        return new JwtFilter(jwtProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            String userRole = request.getUserPrincipal() != null ? 
                request.getUserPrincipal().getName() : "Unknown";
            String endpoint = request.getRequestURI();
            String method = request.getMethod();
            
            // Console logging
            System.err.println("🚫 ACCESS DENIED - Work Order Service");
            System.err.println("├── User: " + userRole);
            System.err.println("├── Endpoint: " + method + " " + endpoint);
            System.err.println("├── Required: ADMIN, CHEFTECH, or TECHNICIEN role");
            System.err.println("└── Time: " + java.time.LocalDateTime.now());
            
            // JSON response for Swagger/API clients
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType("application/json");
            response.getWriter().write(
                "{\n" +
                "  \"error\": \"Access Denied\",\n" +
                "  \"message\": \"Insufficient permissions for work order operations\",\n" +
                "  \"service\": \"work-order-service\",\n" +
                "  \"endpoint\": \"" + method + " " + endpoint + "\",\n" +
                "  \"required_roles\": [\"ADMIN\", \"CHEFTECH\", \"TECHNICIEN\"],\n" +
                "  \"user\": \"" + userRole + "\",\n" +
                "  \"role_permissions\": {\n" +
                "    \"ADMIN\": \"Full CRUD access\",\n" +
                "    \"CHEFTECH\": \"Create, assign, manage work orders\",\n" +
                "    \"TECHNICIEN\": \"View assigned, update status\"\n" +
                "  },\n" +
                "  \"timestamp\": \"" + java.time.Instant.now() + "\",\n" +
                "  \"status\": 403\n" +
                "}"
            );
        };
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            String endpoint = request.getRequestURI();
            String method = request.getMethod();
            
            // Console logging
            System.err.println("🔒 AUTHENTICATION REQUIRED - Work Order Service");
            System.err.println("├── Endpoint: " + method + " " + endpoint);
            System.err.println("├── Issue: " + authException.getMessage());
            System.err.println("├── Required: Valid JWT token");
            System.err.println("└── Time: " + java.time.LocalDateTime.now());
            
            // JSON response for Swagger/API clients
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json");
            response.getWriter().write(
                "{\n" +
                "  \"error\": \"Authentication Required\",\n" +
                "  \"message\": \"Valid JWT token required for work order service access\",\n" +
                "  \"service\": \"work-order-service\",\n" +
                "  \"endpoint\": \"" + method + " " + endpoint + "\",\n" +
                "  \"solution\": \"Login via /api/auth/login to get JWT token\",\n" +
                "  \"header_format\": \"Authorization: Bearer <your-jwt-token>\",\n" +
                "  \"timestamp\": \"" + java.time.Instant.now() + "\",\n" +
                "  \"status\": 401\n" +
                "}"
            );
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // Public endpoints - no authentication required
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        
                        // Work Order access with role-based restrictions:
                        // ADMIN - Full CRUD access to all work orders
                        // CHEFTECH - Create, assign, manage team work orders
                        // TECHNICIEN - View assigned work orders, update status
                        .requestMatchers("/api/work-order/**").hasAnyRole("ADMIN", "CHEFTECH", "TECHNICIEN")
                        
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler(accessDeniedHandler())
                        .authenticationEntryPoint(authenticationEntryPoint())
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
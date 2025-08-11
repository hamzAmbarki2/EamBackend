package com.eam.planning.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {
    private static final Logger log = LoggerFactory.getLogger(RestAccessDeniedHandler.class);

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        String message = accessDeniedException.getMessage() != null ? accessDeniedException.getMessage() : "Forbidden: access denied.";
        log.warn("{} Path={}", message, request.getRequestURI());
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        Map<String, Object> body = new HashMap<>();
        body.put("error", message);
        body.put("path", request.getRequestURI());
        new ObjectMapper().writeValue(response.getOutputStream(), body);
    }
}
package com.eam.workorder.security;

import com.eam.workorder.config.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import java.lang.reflect.Method;
import java.util.Arrays;

@Aspect
@Component
public class PermissionAspect {
    @Autowired
    private JwtUtil jwtUtil;

    @Around("@annotation(com.eam.workorder.security.RoleAllowed)")
    public Object checkRole(ProceedingJoinPoint joinPoint) throws Throwable {
        Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
        RoleAllowed roleAllowed = method.getAnnotation(RoleAllowed.class);
        if (roleAllowed == null) {
            roleAllowed = method.getDeclaringClass().getAnnotation(RoleAllowed.class);
        }
        String[] allowedRoles = roleAllowed.value();
        String role = extractRoleFromRequest();
        if (role == null || Arrays.stream(allowedRoles).noneMatch(r -> r.equals(role))) {
            throw new AccessDeniedException("Access denied: role not allowed");
        }
        return joinPoint.proceed();
    }

    @Around("@annotation(com.eam.workorder.security.DepartmentAccess)")
    public Object checkDepartment(ProceedingJoinPoint joinPoint) throws Throwable {
        // This is a placeholder for department-level logic; you can expand as needed
        String department = extractDepartmentFromRequest();
        if (department == null) {
            throw new AccessDeniedException("Access denied: missing department");
        }
        return joinPoint.proceed();
    }

    private String extractRoleFromRequest() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String authHeader = request.getHeader("Authorization");
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        return token != null ? jwtUtil.getRoleFromToken(token) : null;
    }

    private String extractDepartmentFromRequest() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String authHeader = request.getHeader("Authorization");
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        return token != null ? jwtUtil.getDepartmentFromToken(token) : null;
    }
}
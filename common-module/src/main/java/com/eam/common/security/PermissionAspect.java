package com.eam.common.security;

import com.eam.common.web.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Arrays;

@Aspect
@Component
public class PermissionAspect {
    private static final Logger log = LoggerFactory.getLogger(PermissionAspect.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Around("@annotation(com.eam.common.security.RoleAllowed)")
    public Object checkRole(ProceedingJoinPoint joinPoint) throws Throwable {
        Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
        RoleAllowed roleAllowed = method.getAnnotation(RoleAllowed.class);
        if (roleAllowed == null) {
            roleAllowed = method.getDeclaringClass().getAnnotation(RoleAllowed.class);
        }
        String[] allowedRoles = roleAllowed != null ? roleAllowed.value() : new String[]{};
        String role = extractRoleFromRequest();
        if (role == null || Arrays.stream(allowedRoles).noneMatch(r -> r.equals(role))) {
            String methodName = method.getDeclaringClass().getSimpleName() + "." + method.getName();
            String allowed = String.join(", ", allowedRoles);
            String message = "Forbidden: " + methodName + " requires roles [" + allowed + "] but current role is " + (role == null ? "null" : role);
            log.warn("{}", message);
            throw new AccessDeniedException(message);
        }
        return joinPoint.proceed();
    }

    @Around("@annotation(com.eam.common.security.DepartmentAccess)")
    public Object checkDepartment(ProceedingJoinPoint joinPoint) throws Throwable {
        String department = extractDepartmentFromRequest();
        if (department == null) {
            throw new AccessDeniedException("Access denied: missing department");
        }
        return joinPoint.proceed();
    }

    private String extractRoleFromRequest() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String authHeader = ((jakarta.servlet.http.HttpServletRequest) request).getHeader("Authorization");
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
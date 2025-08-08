package com.eam.common.security.aspect;

import com.eam.common.security.annotations.DepartmentAccess;
import com.eam.common.security.annotations.RoleAllowed;
import com.eam.common.security.department.DepartmentContext;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Aspect
@Component
public class AuthorizationAspect {

    private static final Logger log = LoggerFactory.getLogger(AuthorizationAspect.class);

    @Around("@annotation(com.eam.common.security.annotations.RoleAllowed) || @within(com.eam.common.security.annotations.RoleAllowed)")
    public Object checkRole(ProceedingJoinPoint pjp) throws Throwable {
        Method method = Arrays.stream(pjp.getTarget().getClass().getMethods())
                .filter(m -> m.getName().equals(pjp.getSignature().getName()))
                .findFirst().orElse(null);
        RoleAllowed roleAllowed = method != null ? AnnotationUtils.findAnnotation(method, RoleAllowed.class)
                : AnnotationUtils.findAnnotation(pjp.getTarget().getClass(), RoleAllowed.class);
        if (roleAllowed == null) return pjp.proceed();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            log.warn("Access denied: unauthenticated");
            throw new org.springframework.security.access.AccessDeniedException("Unauthenticated");
        }
        Set<String> roles = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
        boolean allowed = Arrays.stream(roleAllowed.value()).anyMatch(r -> roles.contains("ROLE_" + r));
        if (!allowed) {
            log.warn("Access denied for user {}: required roles {} but had {}", auth.getName(), Arrays.toString(roleAllowed.value()), roles);
            throw new org.springframework.security.access.AccessDeniedException("Forbidden");
        }
        return pjp.proceed();
    }

    @Around("@annotation(depAccess) || @within(com.eam.common.security.annotations.DepartmentAccess)")
    public Object checkDepartment(ProceedingJoinPoint pjp, DepartmentAccess depAccess) throws Throwable {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthenticated");
        }
        Set<String> roles = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
        boolean isAdmin = roles.contains("ROLE_ADMIN");
        if (isAdmin) {
            return pjp.proceed();
        }
        String currentDept = DepartmentContext.currentDepartmentOrNull();
        if (currentDept == null || currentDept.isBlank()) {
            log.warn("Access denied for user {}: no department set in token", auth.getName());
            throw new org.springframework.security.access.AccessDeniedException("Forbidden");
        }
        // TODO: Extend to load resource by idParam and compare its department
        return pjp.proceed();
    }
}
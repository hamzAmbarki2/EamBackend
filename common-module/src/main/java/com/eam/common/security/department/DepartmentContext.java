package com.eam.common.security.department;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class DepartmentContext {
    private DepartmentContext() {}

    public static String currentDepartmentOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Object details = auth.getDetails();
        if (details instanceof java.util.Map<?,?> map) {
            Object dep = map.get("department");
            return dep != null ? dep.toString() : null;
        }
        return null;
    }
}
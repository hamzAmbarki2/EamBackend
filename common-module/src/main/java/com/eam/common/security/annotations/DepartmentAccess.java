package com.eam.common.security.annotations;

import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DepartmentAccess {
    enum Ownership { SELF, DEPARTMENT, ASSIGNED }
    Ownership ownership() default Ownership.DEPARTMENT;
    String resource() default "";
    String idParam() default "id";
}
package com.eam.user.entity;

import com.eam.common.enums.DepartmentType;
import com.eam.user.enums.Role;
import com.eam.user.enums.StatusType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role = Role.TECHNICIEN;

    @Column(name = "phone")
    private String phone;

    @Column(name = "cin")
    private String CIN;

    @Enumerated(EnumType.STRING)
    @Column(name = "department")
    private DepartmentType department;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusType status = StatusType.ACTIVE;

    @Column(name = "avatar")
    private String avatar;

    // ===== FRONTEND ALIGNMENT FIELDS =====
    @Column(name = "name")
    private String name;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_login")
    private java.util.Date lastLogin;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private java.util.Date createdAt;
}

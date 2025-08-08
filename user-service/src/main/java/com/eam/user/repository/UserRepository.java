package com.eam.user.repository;

import com.eam.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.eam.user.entity.DepartmentType;
import com.eam.user.entity.Role;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findAllByDepartment(DepartmentType department);
    List<User> findAllByDepartmentAndRole(DepartmentType department, Role role);
    Optional<User> findByIdAndDepartment(Long id, DepartmentType department);
    // You can add custom query methods here if needed
}
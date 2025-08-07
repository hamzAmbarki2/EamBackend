package com.eam.user.dto;

import com.eam.user.enums.Role;
import com.eam.user.enums.DepartmentType;
import com.eam.user.enums.StatusType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Role role;

    private String phone;

    private String CIN;

    private DepartmentType department;

    private StatusType status;

    private String avatar;

}


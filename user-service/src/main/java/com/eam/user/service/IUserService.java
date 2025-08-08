package com.eam.user.service;

import com.eam.user.dto.UserDto;
import java.util.List;
import com.eam.common.enums.DepartmentType;

public interface IUserService {
    List<UserDto> retrieveAllUsers();
    List<UserDto> retrieveUsersByDepartment(DepartmentType department);
    UserDto retrieveUser(Long id);
    UserDto addUser(UserDto userDto);
    void removeUser(Long id);
    UserDto modifyUser(UserDto userDto);
    UserDto getCurrentUserProfile(String email);
    UserDto updateOwnProfile(Long userId, UserDto partialUpdate);
}
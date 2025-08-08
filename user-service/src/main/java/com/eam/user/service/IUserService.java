package com.eam.user.service;

import com.eam.user.dto.UserDto;
import java.util.List;

public interface IUserService {
    List<UserDto> retrieveAllUsers();
    UserDto retrieveUser(Long id);
    UserDto addUser(UserDto userDto);
    void removeUser(Long id);
    UserDto modifyUser(UserDto userDto);
    UserDto getCurrentUserProfile(String email);
}
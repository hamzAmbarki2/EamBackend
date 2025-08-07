package com.eam.user.service;

import com.eam.user.dto.UserDto;
import com.eam.user.dto.CredentialsDto;

public interface IAuthService {
    UserDto register(UserDto userDto);
    String login(CredentialsDto credentialsDto);
    void resetPassword(String email);
    void verifyEmail(String token);
    String refreshToken(String refreshToken);
    void sendVerificationEmail(String email);
    void resendVerificationEmail(String email);
}

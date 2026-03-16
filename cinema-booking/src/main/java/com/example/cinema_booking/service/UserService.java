package com.example.cinema_booking.service;

import com.example.cinema_booking.dto.request.UserRegisterRequest;
import com.example.cinema_booking.dto.response.UserResponse;

public interface UserService {
    UserResponse createUser(UserRegisterRequest request);
    void updateUser(String userId, String username, String password, String email);
    void deleteUser(String userId);
    String getUserById(String userId);
    void assignRoleToUser(String userId, String role);
    void updateUserStatus(String userId, String status);

}

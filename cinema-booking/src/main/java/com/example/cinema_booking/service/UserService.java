package com.example.cinema_booking.service;

import com.example.cinema_booking.dto.request.UserGetByIdRequest;
import com.example.cinema_booking.dto.request.UserRegisterRequest;
import com.example.cinema_booking.dto.request.UserUpdateRequest;
import com.example.cinema_booking.dto.response.UserResponse;
import com.example.cinema_booking.entity.User;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRegisterRequest request);
    UserResponse updateUser(UserUpdateRequest request, String userId);
    void deleteUser(String userId);
    List<UserResponse> getUsers();
    UserResponse getUserById(String userId);

    UserResponse getMyInfo();

    void assignRoleToUser(String userId, String role);
    void updateUserStatus(String userId, String status);

}

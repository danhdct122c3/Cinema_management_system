package com.example.cinema_booking.service.impl;

import com.example.cinema_booking.dto.request.UserRegisterRequest;
import com.example.cinema_booking.dto.response.UserResponse;
import com.example.cinema_booking.entity.User;
import com.example.cinema_booking.exception.AppException;
import com.example.cinema_booking.exception.ErrorCode;
import com.example.cinema_booking.mapper.UserMapper;
import com.example.cinema_booking.repository.UserRepository;
import com.example.cinema_booking.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // tự động tạo constructor cho tất cả các field final
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // tự động set tất cả các field là private và final
@Slf4j
public class UserServiceImpl  implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;

    public UserResponse createUser(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) throw new AppException(ErrorCode.USER_EXISTED);

        User user = userMapper.toUser(request);
        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

    @Override
    public void updateUser(String userId, String username, String password, String email) {

    }

    @Override
    public void deleteUser(String userId) {

    }

    @Override
    public String getUserById(String userId) {
        return "";
    }

    @Override
    public void assignRoleToUser(String userId, String role) {

    }

    @Override
    public void updateUserStatus(String userId, String status) {

    }

}

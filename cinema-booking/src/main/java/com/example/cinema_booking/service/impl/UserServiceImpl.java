package com.example.cinema_booking.service.impl;

import com.example.cinema_booking.dto.request.UserGetByIdRequest;
import com.example.cinema_booking.dto.request.UserRegisterRequest;
import com.example.cinema_booking.dto.request.UserUpdateRequest;
import com.example.cinema_booking.dto.response.UserResponse;
import com.example.cinema_booking.entity.User;
import com.example.cinema_booking.enums.Role;
import com.example.cinema_booking.exception.AppException;
import com.example.cinema_booking.exception.ErrorCode;
import com.example.cinema_booking.mapper.UserMapper;
import com.example.cinema_booking.repository.UserRepository;
import com.example.cinema_booking.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

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

        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());

        user.setRoles(roles);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse getMyInfo()
    {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("Authenticated user: {}", authentication.getName());

        authentication.getAuthorities().forEach(authority -> log.info("Authority: {}", authority.getAuthority()));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateUser(UserUpdateRequest request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUserFromRequest(request, user);
        userRepository.save(user);

        return userMapper.toUserResponse(user);

    }

    @Override
    public void deleteUser(String userId) {

    }

    @PostAuthorize("returnObject.email == authentication.name or hasRole('ADMIN')")
    // Chỉ cho phép người dùng truy cập vào phương thức này nếu email của họ trùng với email của user được trả về hoặc họ có role ADMIN
    @Override
    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')") // Chỉ cho phép người dùng có role ADMIN truy cập vào phương thức này
    @Override
    public List<UserResponse> getUsers() {
        log.info("In method get user");
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("Authenticated user: {}", authentication.getName());

        authentication.getAuthorities().forEach(authority -> log.info("Authority: {}", authority.getAuthority()));

        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }


    @Override
    public void assignRoleToUser(String userId, String role) {

    }

    @Override
    public void updateUserStatus(String userId, String status) {

    }

}

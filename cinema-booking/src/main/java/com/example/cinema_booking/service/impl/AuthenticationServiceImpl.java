package com.example.cinema_booking.service.impl;


import com.example.cinema_booking.dto.request.AuthenticationRequest;
import com.example.cinema_booking.exception.AppException;
import com.example.cinema_booking.exception.ErrorCode;
import com.example.cinema_booking.repository.UserRepository;
import com.example.cinema_booking.service.AuthenticateService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class AuthenticationServiceImpl implements AuthenticateService {
    UserRepository userRepository;

    public boolean authenticate(AuthenticationRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));


        // Khua Điền hash mật khaâẩu phần này nha con  + salt.
        if (user.getPassword() == null || !user.getPassword().equals(request.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return true;
    }


}

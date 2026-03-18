package com.example.cinema_booking.controller;


import com.example.cinema_booking.dto.request.APIResponse;
import com.example.cinema_booking.dto.request.AuthenticationRequest;
import com.example.cinema_booking.dto.response.AuthenticationResponse;
import com.example.cinema_booking.service.AuthenticateService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticateService authenticateService;

    @PostMapping("/login")
    APIResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        boolean isAuth = authenticateService.authenticate(request);  // Kiểm tra xem thông tin đăng nhập có hợp lệ hay không


        return APIResponse.<AuthenticationResponse>builder()
                .result(AuthenticationResponse.builder()
                        .isAuthenticated(isAuth)
                        .build())
                .build();

    }


}

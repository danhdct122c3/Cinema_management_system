package com.example.cinema_booking.controller;


import com.example.cinema_booking.dto.request.APIResponse;
import com.example.cinema_booking.dto.request.UserRegisterRequest;
import com.example.cinema_booking.dto.response.UserResponse;
import com.example.cinema_booking.service.UserService;
import com.example.cinema_booking.service.impl.UserServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class UserController {
    UserService userService;

    @PostMapping
    APIResponse<UserResponse> registerUser(@RequestBody UserRegisterRequest request){
        log.info("registerUser");


       return APIResponse.<UserResponse>builder()
               .result(userService.createUser(request))
               .build();

    }
}

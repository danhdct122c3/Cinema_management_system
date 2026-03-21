package com.example.cinema_booking.mapper;

import com.example.cinema_booking.dto.request.UserRegisterRequest;
import com.example.cinema_booking.dto.response.UserResponse;
import com.example.cinema_booking.entity.User;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")

public interface UserMapper {
    User toUser(UserRegisterRequest requset);
    UserResponse toUserResponse(User user);
}

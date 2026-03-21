package com.example.cinema_booking.mapper;

import com.example.cinema_booking.dto.request.UserGetByIdRequest;
import com.example.cinema_booking.dto.request.UserRegisterRequest;
import com.example.cinema_booking.dto.request.UserUpdateRequest;
import com.example.cinema_booking.dto.response.UserResponse;
import com.example.cinema_booking.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")

public interface UserMapper {
    User toUser(UserRegisterRequest requset);
    UserResponse toUserResponse(User user);

    @Mapping(target = "email", ignore = true)
    void updateUserFromRequest(UserUpdateRequest request, @MappingTarget User user);

}

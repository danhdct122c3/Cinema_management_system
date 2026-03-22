package com.example.cinema_booking.controller;


import com.example.cinema_booking.dto.request.APIResponse;
import com.example.cinema_booking.dto.request.RoomRequest;
import com.example.cinema_booking.dto.response.RoomResponse;
import com.example.cinema_booking.service.RoomService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {

    RoomService roomService;

    @PostMapping
    public APIResponse<RoomResponse> createRoom(RoomRequest request){
        return APIResponse.<RoomResponse>builder()
                .result(roomService.createRoom(request))
                .build();
    }

}

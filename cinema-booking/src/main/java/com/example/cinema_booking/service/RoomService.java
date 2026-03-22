package com.example.cinema_booking.service;


import com.example.cinema_booking.dto.request.RoomRequest;
import com.example.cinema_booking.dto.response.RoomResponse;

public interface RoomService {

    RoomResponse createRoom(RoomRequest request);
}

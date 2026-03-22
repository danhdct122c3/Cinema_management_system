package com.example.cinema_booking.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class RoomRequest {
    private String roomName;
    private Integer totalRows;
    private Integer totalColumns;
}

package com.example.cinema_booking.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomRequest {
    private String roomName;
    private Integer totalRows;
    private Integer totalColumns;
}

package com.example.cinema_booking.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoldSeatRequest {
    List<String> seatShowTimeIds;
    String showTimeId;  // ShowTime ID (not SeatShowTime ID)
    String userId;
    Integer holdDuration; // in minutes
}

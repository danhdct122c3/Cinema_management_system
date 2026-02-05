package com.example.cinema_booking.dto.response;

import com.example.cinema_booking.entity.Seat;
import com.example.cinema_booking.enums.SeatStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SeatResponseDTO {
    private Long id;
    private String seatRow;
    private String seatNumber;
    private SeatStatus status;

    public static SeatResponseDTO fromEntity(Seat seat) {
        return SeatResponseDTO.builder()
                .id(seat.getId())
                .seatRow(seat.getSeatRow())
                .seatNumber(seat.getSeatNumber())
                .status(seat.getStatus())
                .build();
    }
} 
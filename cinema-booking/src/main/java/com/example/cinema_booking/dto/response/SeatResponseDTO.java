package com.example.cinema_booking.dto.response;

import com.example.cinema_booking.entity.Seat;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SeatResponseDTO {
    private String id;
    private String seatRow;
    private String seatNumber;
    private Long price;
    private String roomId;

    public static SeatResponseDTO fromEntity(Seat seat) {
        return SeatResponseDTO.builder()
                .id(seat.getId())
                .seatRow(seat.getSeat_row())
                .seatNumber(seat.getSeat_number())
                .price(seat.getPrice())
                .roomId(seat.getRoom() != null ? seat.getRoom().getId() : null)
                .build();
    }
} 
package com.example.cinema_booking.dto.response;

import com.example.cinema_booking.entity.Booking;
import com.example.cinema_booking.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class BookingResponseDTO {
    private String id;
    private String userId;
    private String userName;
    private LocalDateTime bookingTime;
    private BookingStatus status;
    private Long totalPrice;
    private ScreeningResponseDTO showTime;
    private List<SeatResponseDTO> seats;

    public static BookingResponseDTO fromEntity(Booking booking) {
        List<SeatResponseDTO> seatDTOs = booking.getBookingSeats() != null
                ? booking.getBookingSeats().stream()
                    .map(bs -> SeatResponseDTO.fromEntity(bs.getSeat()))
                    .collect(Collectors.toList())
                : List.of();

        return BookingResponseDTO.builder()
                .id(booking.getId())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .userName(booking.getUser() != null ? booking.getUser().getName() : null)
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .totalPrice(booking.getTotal_price())
                .showTime(booking.getShowTime() != null ? ScreeningResponseDTO.fromEntity(booking.getShowTime()) : null)
                .seats(seatDTOs)
                .build();
    }
} 
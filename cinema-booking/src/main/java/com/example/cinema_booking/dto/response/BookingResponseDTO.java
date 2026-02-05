package com.example.cinema_booking.dto.response;

import com.example.cinema_booking.entity.Booking;
import com.example.cinema_booking.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponseDTO {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private LocalDateTime bookingTime;
    private BookingStatus status;
    private double totalPrice;
    private ScreeningResponseDTO screening;
    private SeatResponseDTO seat;

    public static BookingResponseDTO fromEntity(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .customerName(booking.getCustomerName())
                .customerEmail(booking.getCustomerEmail())
                .customerPhone(booking.getCustomerPhone())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .totalPrice(booking.getTotalPrice())
                .screening(ScreeningResponseDTO.fromEntity(booking.getScreening()))
                .seat(SeatResponseDTO.fromEntity(booking.getSeat()))
                .build();
    }
} 
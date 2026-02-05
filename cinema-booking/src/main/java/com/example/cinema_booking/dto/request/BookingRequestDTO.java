package com.example.cinema_booking.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRequestDTO {
    Long screeningId;
    Long seatId;
    String customerName;
    String customerEmail;
    String customerPhone;
} 
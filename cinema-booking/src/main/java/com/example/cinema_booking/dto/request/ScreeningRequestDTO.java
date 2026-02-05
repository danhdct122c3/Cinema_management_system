package com.example.cinema_booking.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScreeningRequestDTO {
    Long movieId;
    LocalDateTime screeningTime;
    Integer totalSeats;
    Integer rowCount;
    Integer seatsPerRow;
} 
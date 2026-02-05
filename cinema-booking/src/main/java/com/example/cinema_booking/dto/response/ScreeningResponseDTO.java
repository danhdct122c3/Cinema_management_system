package com.example.cinema_booking.dto.response;

import com.example.cinema_booking.entity.Screening;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ScreeningResponseDTO {
    private Long id;
    private MovieResponseDTO movie;
    private LocalDateTime screeningTime;
    private Integer totalSeats;
    private Integer availableSeats;

    public static ScreeningResponseDTO fromEntity(Screening screening) {
        return ScreeningResponseDTO.builder()
                .id(screening.getId())
                .movie(MovieResponseDTO.fromEntity(screening.getMovie()))
                .screeningTime(screening.getScreeningTime())
                .totalSeats(screening.getTotalSeats())
                .availableSeats(screening.getAvailableSeats())
                .build();
    }
} 
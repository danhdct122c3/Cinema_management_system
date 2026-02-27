package com.example.cinema_booking.dto.response;

import com.example.cinema_booking.entity.ShowTime;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ScreeningResponseDTO {
    private String id;
    private MovieResponseDTO movie;
    private String roomId;
    private String roomName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;

    public static ScreeningResponseDTO fromEntity(ShowTime showTime) {
        return ScreeningResponseDTO.builder()
                .id(showTime.getId())
                .movie(showTime.getMovie() != null ? MovieResponseDTO.fromEntity(showTime.getMovie()) : null)
                .roomId(showTime.getRoom() != null ? showTime.getRoom().getId() : null)
                .roomName(showTime.getRoom() != null ? showTime.getRoom().getRoom_name() : null)
                .startTime(showTime.getStart_time())
                .endTime(showTime.getEnd_time())
                .status(showTime.getStatus() != null ? showTime.getStatus().name() : null)
                .build();
    }
} 
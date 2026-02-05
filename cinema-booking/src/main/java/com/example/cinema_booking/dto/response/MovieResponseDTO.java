package com.example.cinema_booking.dto.response;

import com.example.cinema_booking.entity.Movie;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MovieResponseDTO {
    private Long id;
    private String title;
    private String genre;
    private String description;
    private double ticketPrice;

    public static MovieResponseDTO fromEntity(Movie movie) {
        return MovieResponseDTO.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .genre(movie.getGenre())
                .description(movie.getDescription())
                .ticketPrice(movie.getTicketPrice())
                .build();
    }
}

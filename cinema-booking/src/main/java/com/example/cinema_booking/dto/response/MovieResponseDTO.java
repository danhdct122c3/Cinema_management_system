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
    private String duration;
    private String status;
    private double ticketPrice;
    private String imageUrl;

    public static MovieResponseDTO fromEntity(Movie movie) {
        return MovieResponseDTO.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .genre(movie.getGenre())
                .description(movie.getDescription())
                .duration(movie.getDuration())
                .status(movie.getStatus())
                .ticketPrice(movie.getTicketPrice())
                .imageUrl(movie.getImage_url())
                .build();
    }
}

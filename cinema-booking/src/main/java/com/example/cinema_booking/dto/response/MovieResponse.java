package com.example.cinema_booking.dto.response;

import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieResponse {
    private String id;
    private String title;
    private String description;
    private String duration;
    private String status;
    private LocalDate releaseDate;
    private String genreId;
    private String genreName;
    private String imageUrl;
    private String trailerUrl;
}

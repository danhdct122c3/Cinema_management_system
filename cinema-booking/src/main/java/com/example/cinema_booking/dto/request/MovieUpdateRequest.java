package com.example.cinema_booking.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieUpdateRequest {
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
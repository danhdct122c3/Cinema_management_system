package com.example.cinema_booking.service;

import com.example.cinema_booking.entity.Genre;

public interface GenreService {
    Genre findOrCreateGenre(String genreId, String genreName);
}

package com.example.cinema_booking.service;

import com.example.cinema_booking.entity.Genre;

import java.util.List;

public interface GenreService {
    Genre findOrCreateGenre(String genreId, String genreName);
    List<Genre> findAllGenres();
    Genre createGenre(String genreName);
}

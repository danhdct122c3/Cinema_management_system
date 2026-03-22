package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.enums.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MovieRepository  extends JpaRepository<Movie, String> {
    List<Movie> findByStatus(MovieStatus movieStatus);
    List<Movie> findByTitleContainingIgnoreCase(String keyword);

    List<Movie> findByGenreId(String genreId);
}

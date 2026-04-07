package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.enums.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MovieRepository  extends JpaRepository<Movie, String> {
    List<Movie> findByStatus(MovieStatus movieStatus);
    List<Movie> findByTitleContainingIgnoreCase(String keyword);

    // Tìm phim theo genreId (using ManyToMany join)
    @Query("SELECT DISTINCT m FROM Movie m JOIN m.genres g WHERE g.id = :genreId")
    List<Movie> findByGenreId(String genreId);
}

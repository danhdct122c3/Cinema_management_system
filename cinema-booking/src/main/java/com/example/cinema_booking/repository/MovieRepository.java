package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository  extends JpaRepository<Movie, String> {
}

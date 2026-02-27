package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.entity.Room;
import com.example.cinema_booking.entity.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScreeningRepository extends JpaRepository<ShowTime, String> {
    @Query("SELECT s FROM ShowTime s " +
           "LEFT JOIN FETCH s.movie " +
           "LEFT JOIN FETCH s.room " +
           "WHERE s.id = :id")
    Optional<ShowTime> findByIdWithDetails(@Param("id") String id);

    List<ShowTime> findByMovie(Movie movie);

    List<ShowTime> findByRoom(Room room);
}
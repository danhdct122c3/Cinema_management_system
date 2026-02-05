package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ScreeningRepository extends JpaRepository<Screening, Long> {
    @Query("SELECT s FROM Screening s " +
           "LEFT JOIN FETCH s.seats " +
           "LEFT JOIN FETCH s.movie " +
           "WHERE s.id = :id")
    Optional<Screening> findByIdWithSeats(@Param("id") Long id);
} 
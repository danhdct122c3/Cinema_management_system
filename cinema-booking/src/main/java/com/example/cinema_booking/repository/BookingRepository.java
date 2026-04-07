package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Booking;
import com.example.cinema_booking.entity.ShowTime;
import com.example.cinema_booking.entity.User;
import com.example.cinema_booking.enums.BookingStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByUserOrderByBookingTimeDesc(User user);

    @Query("""
            SELECT DISTINCT b
            FROM Booking b
            JOIN FETCH b.showTime st
            JOIN FETCH st.movie m
            WHERE b.status = :status
              AND b.bookingTime >= :fromDateTime
              AND b.bookingTime < :toDateTime
              AND (:movieId IS NULL OR m.id = :movieId)
            ORDER BY b.bookingTime ASC
            """)
    List<Booking> findForRevenueStatistics(@Param("status") BookingStatus status,
                                           @Param("fromDateTime") LocalDateTime fromDateTime,
                                           @Param("toDateTime") LocalDateTime toDateTime,
                                           @Param("movieId") String movieId);
}

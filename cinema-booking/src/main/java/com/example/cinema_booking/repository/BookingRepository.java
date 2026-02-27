package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Booking;
import com.example.cinema_booking.entity.ShowTime;
import com.example.cinema_booking.entity.User;
import com.example.cinema_booking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByUserOrderByBookingTimeDesc(User user);

    List<Booking> findByShowTimeAndStatus(ShowTime showTime, BookingStatus status);

    Optional<Booking> findByIdAndUser(String id, User user);
}
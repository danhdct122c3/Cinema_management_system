package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Booking;
import com.example.cinema_booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByUserOrderByBookingTimeDesc(User user);
}


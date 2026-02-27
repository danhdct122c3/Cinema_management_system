package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Booking;
import com.example.cinema_booking.entity.BookingSeat;
import com.example.cinema_booking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, String> {
    List<BookingSeat> findByBooking(Booking booking);

    List<BookingSeat> findBySeat(Seat seat);
}


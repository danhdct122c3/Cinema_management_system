package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Booking;
import com.example.cinema_booking.entity.Screening;
import com.example.cinema_booking.entity.Seat;
import com.example.cinema_booking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    boolean existsByScreeningAndSeatAndStatus(Screening screening, Seat seat, BookingStatus status);
    
    Optional<Booking> findByScreeningAndSeatAndStatus(Screening screening, Seat seat, BookingStatus status);
    
    List<Booking> findByCustomerEmailOrderByBookingTimeDesc(String email);
} 
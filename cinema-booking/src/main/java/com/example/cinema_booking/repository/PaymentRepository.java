package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Booking;
import com.example.cinema_booking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByBooking(Booking booking);
}


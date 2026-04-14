package com.example.cinema_booking.repository;

import com.example.cinema_booking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
	Optional<Payment> findByTxnRef(String txnRef);
}

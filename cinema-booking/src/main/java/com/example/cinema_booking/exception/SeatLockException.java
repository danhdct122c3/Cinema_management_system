package com.example.cinema_booking.exception;

public class SeatLockException extends RuntimeException {
    public SeatLockException(String message) {
        super(message);
    }
}
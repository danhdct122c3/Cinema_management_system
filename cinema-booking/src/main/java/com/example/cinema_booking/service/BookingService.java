package com.example.cinema_booking.service;

import com.example.cinema_booking.dto.request.BookingRequest;
import com.example.cinema_booking.dto.request.RevenueStatisticsRequest;
import com.example.cinema_booking.dto.response.BookingResponse;
import com.example.cinema_booking.dto.response.RevenueStatisticsResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request);

    void cancelBooking(String bookingId);

    void confirmBooking(String bookingId);

    List<BookingResponse> getBookingsByUser(String userId);

    List<BookingResponse> getAllBookingsForAdmin();
}

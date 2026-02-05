package com.example.cinema_booking.controller;

import com.example.cinema_booking.dto.request.BookingRequestDTO;
import com.example.cinema_booking.dto.response.BookingResponseDTO;
import com.example.cinema_booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final Map<String, CompletableFuture<ResponseEntity<BookingResponseDTO>>> ongoingBookings = new ConcurrentHashMap<>();

    @PostMapping
    public CompletableFuture<ResponseEntity<BookingResponseDTO>> createBooking(@RequestBody BookingRequestDTO bookingRequest) {
        // Create a unique key for this booking request
        String bookingKey = String.format("%d-%d-%s", 
            bookingRequest.getScreeningId(), 
            bookingRequest.getSeatId(),
            bookingRequest.getCustomerEmail());

        // Check if there's an ongoing booking for this request
        CompletableFuture<ResponseEntity<BookingResponseDTO>> existingBooking = ongoingBookings.get(bookingKey);
        if (existingBooking != null && !existingBooking.isDone()) {
            return existingBooking;
        }

        // Create new booking future
        CompletableFuture<ResponseEntity<BookingResponseDTO>> bookingFuture = bookingService.createBooking(bookingRequest)
                .thenApply(booking -> ResponseEntity.ok(BookingResponseDTO.fromEntity(booking)))
                .whenComplete((result, ex) -> ongoingBookings.remove(bookingKey));

        // Store the booking future
        ongoingBookings.put(bookingKey, bookingFuture);
        
        return bookingFuture;
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id)
                .thenApply(result -> ResponseEntity.ok().build());
    }

    @PostMapping("/screenings/{screeningId}/seats/{seatId}/reserve")
    public CompletableFuture<ResponseEntity<Boolean>> reserveSeat(
            @PathVariable Long screeningId,
            @PathVariable Long seatId) {
        return bookingService.reserveSeat(screeningId, seatId)
                .thenApply(result -> ResponseEntity.ok(result));
    }

    @PostMapping("/screenings/{screeningId}/seats/{seatId}/release")
    public CompletableFuture<ResponseEntity<Boolean>> releaseSeatReservation(
            @PathVariable Long screeningId,
            @PathVariable Long seatId) {
        return bookingService.releaseSeatReservation(screeningId, seatId)
                .thenApply(result -> ResponseEntity.ok(result));
    }

    @PostMapping("/{id}/confirm")
    public CompletableFuture<ResponseEntity<Void>> confirmBooking(@PathVariable Long id) {
        return bookingService.confirmBooking(id)
                .thenApply(result -> ResponseEntity.ok().build());
    }

    @GetMapping("/user/{email}")
    public CompletableFuture<ResponseEntity<List<BookingResponseDTO>>> getBookingsByEmail(@PathVariable String email) {
        return bookingService.getBookingsByEmail(email)
                .thenApply(bookings -> bookings.stream()
                        .map(BookingResponseDTO::fromEntity)
                        .collect(Collectors.toList()))
                .thenApply(ResponseEntity::ok)
                .exceptionally(throwable -> {
                    throw new RuntimeException("Failed to fetch bookings: " + throwable.getMessage());
                });
    }
} 
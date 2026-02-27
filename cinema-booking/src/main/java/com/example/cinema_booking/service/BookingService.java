package com.example.cinema_booking.service;

import com.example.cinema_booking.dto.request.BookingRequestDTO;
import com.example.cinema_booking.entity.*;
import com.example.cinema_booking.enums.BookingStatus;
import com.example.cinema_booking.repository.*;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ScreeningRepository screeningRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final Lock bookingLock = new ReentrantLock();

    private final ExecutorService executorService = Executors.newFixedThreadPool(
        Runtime.getRuntime().availableProcessors() * 2,
        new ThreadFactory() {
            private int count = 1;
            @Override
            public Thread newThread(Runnable r) {
                Thread thread = new Thread(r);
                thread.setName("Booking-Thread-" + count++);
                thread.setDaemon(true);
                return thread;
            }
        }
    );

    @PreDestroy
    public void cleanup() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    @Transactional
    public CompletableFuture<Booking> createBooking(BookingRequestDTO bookingRequest) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (!bookingLock.tryLock(5, TimeUnit.SECONDS)) {
                    throw new RuntimeException("Unable to process booking request at this time. Please try again.");
                }

                try {
                    User user = userRepository.findById(bookingRequest.getUserId())
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    ShowTime showTime = screeningRepository.findById(bookingRequest.getShowTimeId())
                            .orElseThrow(() -> new RuntimeException("ShowTime not found"));

                    List<Seat> seats = new ArrayList<>();
                    for (String seatId : bookingRequest.getSeatIds()) {
                        Seat seat = seatRepository.findById(seatId)
                                .orElseThrow(() -> new RuntimeException("Seat not found: " + seatId));
                        seats.add(seat);
                    }

                    // Calculate total price
                    long totalPrice = seats.stream()
                            .mapToLong(s -> s.getPrice() != null ? s.getPrice() : 0L)
                            .sum();

                    // Create the booking
                    Booking booking = Booking.builder()
                            .user(user)
                            .showTime(showTime)
                            .bookingTime(LocalDateTime.now())
                            .status(BookingStatus.PENDING)
                            .total_price(totalPrice)
                            .bookingSeats(new ArrayList<>())
                            .payments(new ArrayList<>())
                            .build();

                    Booking savedBooking = bookingRepository.save(booking);

                    // Create BookingSeat entries
                    for (Seat seat : seats) {
                        BookingSeat bookingSeat = BookingSeat.builder()
                                .booking(savedBooking)
                                .seat(seat)
                                .build();
                        bookingSeatRepository.save(bookingSeat);
                        savedBooking.getBookingSeats().add(bookingSeat);
                    }

                    return savedBooking;
                } finally {
                    bookingLock.unlock();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Booking process was interrupted");
            } catch (Exception e) {
                throw new RuntimeException("Failed to create booking: " + e.getMessage());
            }
        }, executorService);
    }

    @Transactional
    public CompletableFuture<Void> cancelBooking(String bookingId) {
        return CompletableFuture.runAsync(() -> {
            try {
                if (!bookingLock.tryLock(5, TimeUnit.SECONDS)) {
                    throw new RuntimeException("Unable to process cancellation request at this time");
                }

                try {
                    Booking booking = bookingRepository.findById(bookingId)
                            .orElseThrow(() -> new RuntimeException("Booking not found"));

                    if (booking.getStatus() == BookingStatus.CANCELLED) {
                        throw new RuntimeException("Booking is already cancelled");
                    }

                    if (booking.getStatus() == BookingStatus.CONFIRMED) {
                        throw new RuntimeException("Cannot cancel a confirmed booking");
                    }

                    booking.setStatus(BookingStatus.CANCELLED);
                    bookingRepository.save(booking);

                } finally {
                    bookingLock.unlock();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Cancellation process was interrupted");
            }
        }, executorService);
    }

    @Transactional
    public CompletableFuture<Void> confirmBooking(String bookingId) {
        return CompletableFuture.runAsync(() -> {
            try {
                if (!bookingLock.tryLock(5, TimeUnit.SECONDS)) {
                    throw new RuntimeException("Unable to process confirmation request at this time");
                }

                try {
                    Booking booking = bookingRepository.findById(bookingId)
                            .orElseThrow(() -> new RuntimeException("Booking not found"));

                    if (booking.getStatus() != BookingStatus.PENDING) {
                        throw new RuntimeException("Only pending bookings can be confirmed");
                    }

                    booking.setStatus(BookingStatus.CONFIRMED);
                    bookingRepository.save(booking);

                } finally {
                    bookingLock.unlock();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Confirmation process was interrupted");
            }
        }, executorService);
    }

    @Transactional(readOnly = true)
    public CompletableFuture<List<Booking>> getBookingsByUser(String userId) {
        return CompletableFuture.supplyAsync(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return bookingRepository.findByUserOrderByBookingTimeDesc(user);
        }, executorService);
    }
} 
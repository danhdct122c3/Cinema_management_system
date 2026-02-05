package com.example.cinema_booking.service;

import com.example.cinema_booking.dto.request.BookingRequestDTO;
import com.example.cinema_booking.entity.Booking;
import com.example.cinema_booking.entity.Screening;
import com.example.cinema_booking.entity.Seat;
import com.example.cinema_booking.enums.BookingStatus;
import com.example.cinema_booking.enums.SeatStatus;
import com.example.cinema_booking.repository.BookingRepository;
import com.example.cinema_booking.repository.ScreeningRepository;
import com.example.cinema_booking.repository.SeatRepository;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.*;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ScreeningRepository screeningRepository;
    private final SeatRepository seatRepository;
    private final Lock bookingLock = new ReentrantLock();
    private static final long RESERVATION_TIMEOUT_MINUTES = 5;
    
    // Create a thread pool for handling concurrent booking operations
    private final ExecutorService executorService = Executors.newFixedThreadPool(
        Runtime.getRuntime().availableProcessors() * 2, // Number of threads = 2 * number of CPU cores
        new ThreadFactory() {
            private int count = 1;
            @Override
            public Thread newThread(Runnable r) {
                Thread thread = new Thread(r);
                thread.setName("Booking-Thread-" + count++);
                thread.setDaemon(true); // Make threads daemon so they don't prevent application shutdown
                return thread;
            }
        }
    );

    // Cleanup executor service on application shutdown
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
    public CompletableFuture<Boolean> reserveSeat(Long screeningId, Long seatId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (!bookingLock.tryLock(5, TimeUnit.SECONDS)) {
                    throw new RuntimeException("Could not acquire lock for seat reservation");
                }

                try {
                    Screening screening = screeningRepository.findByIdWithSeats(screeningId)
                            .orElseThrow(() -> new RuntimeException("Screening not found"));

                    Seat seat = screening.getSeats().stream()
                            .filter(s -> s.getId().equals(seatId))
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("Seat not found in this screening"));

                    // Check if there's already a pending booking for this seat
                    if (bookingRepository.existsByScreeningAndSeatAndStatus(screening, seat, BookingStatus.PENDING)) {
                        return false;
                    }

                    if (seat.getStatus() != SeatStatus.AVAILABLE) {
                        return false;
                    }

                    seat.setStatus(SeatStatus.RESERVED);
                    seatRepository.save(seat);
                    
                    // Schedule a task to release the reservation after timeout using our executor
                    CompletableFuture.delayedExecutor(RESERVATION_TIMEOUT_MINUTES, TimeUnit.MINUTES, executorService)
                        .execute(() -> {
                            try {
                                if (bookingLock.tryLock(5, TimeUnit.SECONDS)) {
                                    try {
                                        Seat currentSeat = seatRepository.findById(seatId)
                                                .orElseThrow(() -> new RuntimeException("Seat not found"));
                                        if (currentSeat.getStatus() == SeatStatus.RESERVED) {
                                            currentSeat.setStatus(SeatStatus.AVAILABLE);
                                            seatRepository.save(currentSeat);
                                        }
                                    } finally {
                                        bookingLock.unlock();
                                    }
                                }
                            } catch (InterruptedException e) {
                                Thread.currentThread().interrupt();
                            } catch (Exception e) {
                                // Log any other exceptions but don't rethrow
                                e.printStackTrace();
                            }
                        });
                    
                    return true;
                } finally {
                    bookingLock.unlock();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Reservation process was interrupted");
            }
        }, executorService);
    }

    @Transactional
    public CompletableFuture<Boolean> releaseSeatReservation(Long screeningId, Long seatId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (!bookingLock.tryLock(5, TimeUnit.SECONDS)) {
                    throw new RuntimeException("Could not acquire lock for releasing reservation");
                }

                try {
                    Seat seat = seatRepository.findById(seatId)
                            .orElseThrow(() -> new RuntimeException("Seat not found"));

                    // Only release if the seat is in RESERVED status
                    if (seat.getStatus() == SeatStatus.RESERVED) {
                        seat.setStatus(SeatStatus.AVAILABLE);
                        seatRepository.save(seat);
                        return true;
                    }
                    return false;
                } finally {
                    bookingLock.unlock();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Release reservation process was interrupted");
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to release seat reservation: " + e.getMessage());
            }
        }, executorService);
    }

    @Transactional
    public CompletableFuture<Booking> createBooking(BookingRequestDTO bookingRequest) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (!bookingLock.tryLock(5, TimeUnit.SECONDS)) {
                    throw new RuntimeException("Unable to process booking request at this time. Please try again.");
                }

                try {
                    // First, check if there's already a booking for this request
                    Screening screening = screeningRepository.findByIdWithSeats(bookingRequest.getScreeningId())
                            .orElseThrow(() -> new RuntimeException("Screening not found"));

                    Seat seat = screening.getSeats().stream()
                            .filter(s -> s.getId().equals(bookingRequest.getSeatId()))
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("Seat not found in this screening"));

                    // Check if there's already a pending booking for this seat
                    if (bookingRepository.existsByScreeningAndSeatAndStatus(screening, seat, BookingStatus.PENDING)) {
                        // Check if it's our booking
                        Booking existingBooking = bookingRepository.findByScreeningAndSeatAndStatus(
                            screening, seat, BookingStatus.PENDING)
                            .orElse(null);
                        
                        if (existingBooking != null && 
                            existingBooking.getCustomerEmail().equals(bookingRequest.getCustomerEmail())) {
                            return existingBooking;
                        }
                        throw new RuntimeException("This seat already has a pending booking");
                    }

                    // Check if the seat is in a valid state for booking
                    if (seat.getStatus() != SeatStatus.AVAILABLE && seat.getStatus() != SeatStatus.RESERVED) {
                        throw new RuntimeException("Seat is not available for booking");
                    }

                    // Create the booking
                    Booking booking = Booking.builder()
                            .screening(screening)
                            .seat(seat)
                            .bookingTime(LocalDateTime.now())
                            .expirationTime(LocalDateTime.now().plusMinutes(15))
                            .status(BookingStatus.PENDING)
                            .customerName(bookingRequest.getCustomerName())
                            .customerEmail(bookingRequest.getCustomerEmail())
                            .customerPhone(bookingRequest.getCustomerPhone())
                            .totalPrice(screening.getMovie().getTicketPrice())
                            .build();

                    // Save the booking first
                    Booking savedBooking = bookingRepository.save(booking);

                    try {
                        // Then update and save the seat
                        seat.setStatus(SeatStatus.BOOKED);
                        seat.setCurrentBooking(savedBooking);
                        seatRepository.save(seat);

                        // Finally update the screening
                        screening.setAvailableSeats(screening.getAvailableSeats() - 1);
                        screeningRepository.save(screening);
                    } catch (Exception e) {
                        // If updating seat/screening fails, the booking is still valid
                        // Log the error but don't throw it
                        e.printStackTrace();
                    }

                    return savedBooking;
                } finally {
                    bookingLock.unlock();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Booking process was interrupted");
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to create booking: " + e.getMessage());
            }
        }, executorService);
    }

    @Transactional
    public CompletableFuture<Void> cancelBooking(Long bookingId) {
        return CompletableFuture.runAsync(() -> {
            try {
                if (!bookingLock.tryLock(5, TimeUnit.SECONDS)) {
                    throw new RuntimeException("Unable to process cancellation request at this time");
                }

                try {
                    Booking booking = bookingRepository.findById(bookingId)
                            .orElseThrow(() -> new RuntimeException("Booking not found"));

                    // Check if booking can be cancelled
                    if (booking.getStatus() == BookingStatus.CANCELLED) {
                        throw new RuntimeException("Booking is already cancelled");
                    }

                    if (booking.getStatus() == BookingStatus.CONFIRMED) {
                        throw new RuntimeException("Cannot cancel a confirmed booking");
                    }

                    Seat seat = booking.getSeat();
                    if (seat == null) {
                        throw new RuntimeException("Seat information not found");
                    }

                    // Update seat status
                    seat.setStatus(SeatStatus.AVAILABLE);
                    seat.setCurrentBooking(null);
                    seatRepository.save(seat);

                    // Update screening available seats count
                    Screening screening = seat.getScreening();
                    if (screening != null) {
                        screening.setAvailableSeats(screening.getAvailableSeats() + 1);
                        screeningRepository.save(screening);
                    }

                    // Update booking status
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
    public CompletableFuture<Void> confirmBooking(Long bookingId) {
        return CompletableFuture.runAsync(() -> {
            try {
                if (!bookingLock.tryLock(5, TimeUnit.SECONDS)) {
                    throw new RuntimeException("Unable to process confirmation request at this time");
                }

                try {
                    Booking booking = bookingRepository.findById(bookingId)
                            .orElseThrow(() -> new RuntimeException("Booking not found"));

                    // Check if booking can be confirmed
                    if (booking.getStatus() != BookingStatus.PENDING) {
                        throw new RuntimeException("Only pending bookings can be confirmed");
                    }

                    // Update booking status
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
    public CompletableFuture<List<Booking>> getBookingsByEmail(String email) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return bookingRepository.findByCustomerEmailOrderByBookingTimeDesc(email);
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to fetch bookings: " + e.getMessage());
            }
        }, executorService);
    }
} 
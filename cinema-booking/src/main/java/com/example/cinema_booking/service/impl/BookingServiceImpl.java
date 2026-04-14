package com.example.cinema_booking.service.impl;

import com.example.cinema_booking.dto.request.BookingRequest;
import com.example.cinema_booking.dto.request.RevenueStatisticsRequest;
import com.example.cinema_booking.dto.response.BookingResponse;
import com.example.cinema_booking.dto.response.RevenueStatisticsItemResponse;
import com.example.cinema_booking.dto.response.RevenueStatisticsResponse;
import com.example.cinema_booking.entity.Booking;
import com.example.cinema_booking.entity.BookingSeat;
import com.example.cinema_booking.entity.SeatShowTime;
import com.example.cinema_booking.entity.ShowTime;
import com.example.cinema_booking.entity.User;
import com.example.cinema_booking.enums.BookingStatus;
import com.example.cinema_booking.enums.SeatStatus;
import com.example.cinema_booking.enums.StatisticGroupBy;
import com.example.cinema_booking.exception.AppException;
import com.example.cinema_booking.exception.ErrorCode;
import com.example.cinema_booking.repository.BookingRepository;
import com.example.cinema_booking.repository.BookingSeatRepository;
import com.example.cinema_booking.repository.SeatShowTimeRepository;
import com.example.cinema_booking.repository.ShowTimeRepository;
import com.example.cinema_booking.repository.UserRepository;
import com.example.cinema_booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.time.temporal.WeekFields;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final ShowTimeRepository showTimeRepository;
    private final SeatShowTimeRepository seatShowTimeRepository;
    private final UserRepository userRepository;
    private final BookingSeatRepository bookingSeatRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest bookingRequest) {
        if (bookingRequest.getSeatShowTimeIds() == null || bookingRequest.getSeatShowTimeIds().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_SEAT_IDS);
        }

        User user = userRepository.findById(bookingRequest.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        ShowTime showTime = showTimeRepository.findById(bookingRequest.getShowTimeId())
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_EXIST));

        List<SeatShowTime> seatShowTimes = seatShowTimeRepository.findByIdInForUpdate(
                bookingRequest.getSeatShowTimeIds()
        );
        if (seatShowTimes.size() != bookingRequest.getSeatShowTimeIds().size()) {
            throw new AppException(ErrorCode.INVALID_SEAT_IDS);
        }

        LocalDateTime now = LocalDateTime.now();
        for (SeatShowTime seatShowTime : seatShowTimes) {
            if (!seatShowTime.getShowtime().getId().equals(showTime.getId())) {
                throw new AppException(ErrorCode.INVALID_SEAT_IDS);
            }
            if (seatShowTime.getStatus() != SeatStatus.HOLD) {
                throw new AppException(ErrorCode.SEAT_NOT_AVAILABLE);
            }
            if (seatShowTime.getHoldExpireTime() == null || seatShowTime.getHoldExpireTime().isBefore(now)) {
                throw new AppException(ErrorCode.HOLD_EXPIRED);
            }
            if (seatShowTime.getHeldByUser() == null || !seatShowTime.getHeldByUser().getId().equals(user.getId())) {
                throw new AppException(ErrorCode.SEAT_HOLD_USER_MISMATCH);
            }
        }

        long totalPrice = seatShowTimes.stream()
                .mapToLong(s -> s.getPrice() != null ? s.getPrice().longValue() : 0L)
                .sum();

        log.info("Creating booking - User ID: {}, ShowTime ID: {}, SeatShowTime IDs: {}, Total Price: {}",
                user.getId(), showTime.getId(), bookingRequest.getSeatShowTimeIds(), totalPrice);

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

        for (SeatShowTime seatShowTime : seatShowTimes) {
            BookingSeat bookingSeat = BookingSeat.builder()
                    .booking(savedBooking)
                    .seat(seatShowTime.getSeat())
                    .build();

            // Keep hold metadata intact until payment callback confirms the booking.
            // Clearing holdExpireTime/heldByUser here causes payment confirmation to fail.
            seatShowTime.setStatus(SeatStatus.HOLD);
            seatShowTimeRepository.save(seatShowTime);
            bookingSeatRepository.save(bookingSeat);
            savedBooking.getBookingSeats().add(bookingSeat);
        }


        return toResponse(savedBooking, seatShowTimes);
    }

    @Override
    @Transactional
    public void cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CANCELLED);
        }
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CONFIRMED);
        }

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(bookingId);
        List<String> seatIds = bookingSeats.stream()
                .map(bs -> bs.getSeat().getId())
                .toList();

        if (!seatIds.isEmpty()) {
            List<SeatShowTime> seatShowTimes = seatShowTimeRepository.findByShowtimeIdAndSeatIdInForUpdate(
                    booking.getShowTime().getId(),
                    seatIds
            );
            for (SeatShowTime seatShowTime : seatShowTimes) {
                if (seatShowTime.getStatus() == SeatStatus.HOLD) {
                    seatShowTime.setStatus(SeatStatus.AVAILABLE);
                    seatShowTime.setHoldStartTime(null);
                    seatShowTime.setHoldExpireTime(null);
                    seatShowTime.setHeldByUser(null);
                }
            }
            seatShowTimeRepository.saveAll(seatShowTimes);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void confirmBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CANCELLED);
        }
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CONFIRMED);
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new AppException(ErrorCode.BOOKING_NOT_PENDING);
        }

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(bookingId);
        List<String> seatIds = bookingSeats.stream()
                .map(bs -> bs.getSeat().getId())
                .toList();

        if (seatIds.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_SEAT_IDS);
        }

        List<SeatShowTime> seatShowTimes = seatShowTimeRepository.findByShowtimeIdAndSeatIdInForUpdate(
                booking.getShowTime().getId(),
                seatIds
        );

        if (seatShowTimes.size() != seatIds.size()) {
            throw new AppException(ErrorCode.INVALID_SEAT_IDS);
        }

        LocalDateTime now = LocalDateTime.now();
        for (SeatShowTime seatShowTime : seatShowTimes) {
            if (seatShowTime.getStatus() != SeatStatus.HOLD) {
                throw new AppException(ErrorCode.SEAT_NOT_AVAILABLE);
            }
            if (seatShowTime.getHoldExpireTime() == null || seatShowTime.getHoldExpireTime().isBefore(now)) {
                throw new AppException(ErrorCode.HOLD_EXPIRED);
            }
            if (seatShowTime.getHeldByUser() == null || !seatShowTime.getHeldByUser().getId().equals(booking.getUser().getId())) {
                throw new AppException(ErrorCode.SEAT_HOLD_USER_MISMATCH);
            }
        }

        for (SeatShowTime seatShowTime : seatShowTimes) {
            seatShowTime.setStatus(SeatStatus.BOOKED);
            seatShowTime.setHoldStartTime(null);
            seatShowTime.setHoldExpireTime(null);
            seatShowTime.setHeldByUser(null);
        }
        seatShowTimeRepository.saveAll(seatShowTimes);

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public List<BookingResponse> getBookingsByUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Booking> bookings = bookingRepository.findByUserOrderByBookingTimeDesc(user);
        return bookings.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookingsForAdmin() {
        return bookingRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private BookingResponse toResponse(Booking booking) {
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(booking.getId());
        List<String> seatIds = bookingSeats.stream()
                .map(bs -> bs.getSeat().getId())
                .toList();

        List<SeatShowTime> seatShowTimes = seatIds.isEmpty()
                ? List.of()
                : seatShowTimeRepository.findByShowtimeIdAndSeatIdIn(
                        booking.getShowTime().getId(),
                        seatIds
                );
        return toResponse(booking, seatShowTimes);
    }

    private BookingResponse toResponse(Booking booking, List<SeatShowTime> seatShowTimes) {
        List<String> seatShowTimeIds = seatShowTimes.stream()
                .map(SeatShowTime::getId)
                .toList();

        List<String> seatCodes = seatShowTimes.stream()
                .map(SeatShowTime::getSeat)
                .map(seat -> seat.getSeatRow() + seat.getSeatNumber())
                .collect(Collectors.toList());

        return BookingResponse.builder()
                .bookingId(booking.getId())
                .userId(booking.getUser().getId())
                .showTimeId(booking.getShowTime().getId())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus().name())
                .totalPrice(booking.getTotal_price())
                .seatShowTimeIds(seatShowTimeIds)
                .seatCodes(seatCodes)
                .build();
    }
}

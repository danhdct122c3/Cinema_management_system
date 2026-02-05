package com.example.cinema_booking.service;

import com.example.cinema_booking.dto.request.ScreeningRequestDTO;
import com.example.cinema_booking.dto.response.MovieResponseDTO;
import com.example.cinema_booking.dto.response.ScreeningResponseDTO;
import com.example.cinema_booking.dto.response.SeatResponseDTO;
import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.entity.Screening;
import com.example.cinema_booking.entity.Seat;
import com.example.cinema_booking.enums.SeatStatus;
import com.example.cinema_booking.repository.MovieRepository;
import com.example.cinema_booking.repository.ScreeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScreeningService {
    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;

    @Async
    @Transactional
    public CompletableFuture<ScreeningResponseDTO> createScreening(ScreeningRequestDTO request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Screening screening = Screening.builder()
                .movie(movie)
                .screeningTime(request.getScreeningTime())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats())
                .seats(ConcurrentHashMap.newKeySet())
                .build();

        // Create seats
        for (int row = 0; row < request.getRowCount(); row++) {
            String rowLabel = String.valueOf((char) ('A' + row));
            for (int seatNum = 1; seatNum <= request.getSeatsPerRow(); seatNum++) {
                Seat seat = Seat.builder()
                        .screening(screening)
                        .seatRow(rowLabel)
                        .seatNumber(String.valueOf(seatNum))
                        .status(SeatStatus.AVAILABLE)
                        .build();
                screening.getSeats().add(seat);
            }
        }

        Screening savedScreening = screeningRepository.save(screening);
        return CompletableFuture.completedFuture(convertToDTO(savedScreening));
    }

    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<ScreeningResponseDTO> getScreeningById(Long id) {
        Screening screening = screeningRepository.findByIdWithSeats(id)
                .orElseThrow(() -> new RuntimeException("Screening not found"));
        return CompletableFuture.completedFuture(convertToDTO(screening));
    }

    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<SeatResponseDTO>> getAvailableSeats(Long screeningId) {
        Screening screening = screeningRepository.findByIdWithSeats(screeningId)
                .orElseThrow(() -> new RuntimeException("Screening not found"));

        List<SeatResponseDTO> seats = screening.getSeats().stream()
                .map(this::convertToSeatDTO)
                .collect(Collectors.toList());

        return CompletableFuture.completedFuture(seats);
    }

    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<ScreeningResponseDTO>> getScreeningsByMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        List<ScreeningResponseDTO> screenings = movie.getScreenings().stream()
                .map(screening -> {
                    // Fetch screening with seats
                    Screening fullScreening = screeningRepository.findByIdWithSeats(screening.getId())
                            .orElseThrow(() -> new RuntimeException("Screening not found"));
                    
                    // Calculate available seats
                    long availableSeats = fullScreening.getSeats().stream()
                            .filter(seat -> seat.getStatus() == SeatStatus.AVAILABLE)
                            .count();
                    
                    // Update available seats
                    fullScreening.setAvailableSeats((int) availableSeats);
                    
                    return convertToDTO(fullScreening);
                })
                .collect(Collectors.toList());

        return CompletableFuture.completedFuture(screenings);
    }

    private ScreeningResponseDTO convertToDTO(Screening screening) {
        return ScreeningResponseDTO.builder()
                .id(screening.getId())
                .movie(MovieResponseDTO.fromEntity(screening.getMovie()))
                .screeningTime(screening.getScreeningTime())
                .totalSeats(screening.getTotalSeats())
                .availableSeats(screening.getAvailableSeats())
                .build();
    }

    private SeatResponseDTO convertToSeatDTO(Seat seat) {
        return SeatResponseDTO.builder()
                .id(seat.getId())
                .seatRow(seat.getSeatRow())
                .seatNumber(seat.getSeatNumber())
                .status(seat.getStatus())
                .build();
    }
} 
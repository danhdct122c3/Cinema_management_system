package com.example.cinema_booking.service;

import com.example.cinema_booking.dto.request.ScreeningRequestDTO;
import com.example.cinema_booking.dto.response.ScreeningResponseDTO;
import com.example.cinema_booking.dto.response.SeatResponseDTO;
import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.entity.Room;
import com.example.cinema_booking.entity.ShowTime;
import com.example.cinema_booking.repository.MovieRepository;
import com.example.cinema_booking.repository.RoomRepository;
import com.example.cinema_booking.repository.ScreeningRepository;
import com.example.cinema_booking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScreeningService {
    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;

    @Async
    @Transactional
    public CompletableFuture<ScreeningResponseDTO> createScreening(ScreeningRequestDTO request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        ShowTime showTime = ShowTime.builder()
                .movie(movie)
                .room(room)
                .start_time(request.getStartTime())
                .end_time(request.getEndTime())
                .build();

        ShowTime savedShowTime = screeningRepository.save(showTime);
        return CompletableFuture.completedFuture(ScreeningResponseDTO.fromEntity(savedShowTime));
    }

    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<ScreeningResponseDTO> getScreeningById(String id) {
        ShowTime showTime = screeningRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("ShowTime not found"));
        return CompletableFuture.completedFuture(ScreeningResponseDTO.fromEntity(showTime));
    }

    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<SeatResponseDTO>> getSeatsByRoom(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        List<SeatResponseDTO> seats = room.getSeats().stream()
                .map(SeatResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return CompletableFuture.completedFuture(seats);
    }

    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<ScreeningResponseDTO>> getScreeningsByMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        List<ScreeningResponseDTO> screenings = movie.getShowTimes().stream()
                .map(ScreeningResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return CompletableFuture.completedFuture(screenings);
    }
}
package com.example.cinema_booking.controller;

import com.example.cinema_booking.dto.request.ScreeningRequestDTO;
import com.example.cinema_booking.dto.response.ScreeningResponseDTO;
import com.example.cinema_booking.dto.response.SeatResponseDTO;
import com.example.cinema_booking.service.ScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/screenings")
@RequiredArgsConstructor
public class ScreeningController {
    private final ScreeningService screeningService;

    @PostMapping
    public CompletableFuture<ResponseEntity<ScreeningResponseDTO>> createScreening(@RequestBody ScreeningRequestDTO request) {
        return screeningService.createScreening(request)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<ScreeningResponseDTO>> getScreeningById(@PathVariable Long id) {
        return screeningService.getScreeningById(id)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/{id}/seats")
    public CompletableFuture<ResponseEntity<List<SeatResponseDTO>>> getAvailableSeats(@PathVariable Long id) {
        return screeningService.getAvailableSeats(id)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/movie/{movieId}")
    public CompletableFuture<ResponseEntity<List<ScreeningResponseDTO>>> getScreeningsByMovie(@PathVariable Long movieId) {
        return screeningService.getScreeningsByMovie(movieId)
                .thenApply(ResponseEntity::ok);
    }
} 
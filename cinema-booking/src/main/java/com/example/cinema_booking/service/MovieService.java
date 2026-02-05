package com.example.cinema_booking.service;

import com.example.cinema_booking.dto.request.MovieRequestDTO;
import com.example.cinema_booking.dto.response.MovieResponseDTO;
import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;

    @Async
    @Transactional
    public CompletableFuture<MovieResponseDTO> createMovie(MovieRequestDTO movieRequest) {
        Movie movie = Movie.builder()
                .title(movieRequest.getTitle())
                .genre(movieRequest.getGenre())
                .description(movieRequest.getDescription())
                .ticketPrice(movieRequest.getTicketPrice())
                .build();
        
        Movie savedMovie = movieRepository.save(movie);
        return CompletableFuture.completedFuture(convertToDTO(savedMovie));
    }

    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<MovieResponseDTO>> getAllMovies() {
        List<MovieResponseDTO> movies = movieRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return CompletableFuture.completedFuture(movies);
    }

    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<MovieResponseDTO> getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
        return CompletableFuture.completedFuture(convertToDTO(movie));
    }

    @Async
    @Transactional
    public CompletableFuture<MovieResponseDTO> updateMovie(Long id, MovieRequestDTO movieRequest) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));

        movie.setTitle(movieRequest.getTitle());
        movie.setGenre(movieRequest.getGenre());
        movie.setDescription(movieRequest.getDescription());
        movie.setTicketPrice(movieRequest.getTicketPrice());

        Movie updatedMovie = movieRepository.save(movie);
        return CompletableFuture.completedFuture(convertToDTO(updatedMovie));
    }

    @Async
    @Transactional
    public CompletableFuture<Void> deleteMovie(Long id) {
        movieRepository.deleteById(id);
        return CompletableFuture.completedFuture(null);
    }

    private MovieResponseDTO convertToDTO(Movie movie) {
        return MovieResponseDTO.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .genre(movie.getGenre())
                .description(movie.getDescription())
                .ticketPrice(movie.getTicketPrice())
                .build();
    }
} 
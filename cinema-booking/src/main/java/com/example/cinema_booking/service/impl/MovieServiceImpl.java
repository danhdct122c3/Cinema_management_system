package com.example.cinema_booking.service.impl;

import com.example.cinema_booking.dto.request.MovieCreateRequest;
import com.example.cinema_booking.dto.request.MovieUpdateRequest;
import com.example.cinema_booking.dto.response.MovieResponse;
import com.example.cinema_booking.dto.response.PageResponse;
import com.example.cinema_booking.entity.Genre;
import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.enums.MovieStatus;
import com.example.cinema_booking.exception.AppException;
import com.example.cinema_booking.exception.ErrorCode;
import com.example.cinema_booking.mapper.MovieMapper;
import com.example.cinema_booking.repository.MovieRepository;
import com.example.cinema_booking.service.CloudinaryService;
import com.example.cinema_booking.service.GenreService;
import com.example.cinema_booking.service.MovieService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieServiceImpl implements MovieService {
     MovieRepository movieRepository;
     GenreService genreService;
     MovieMapper movieMapper;
     CloudinaryService cloudinaryService;


     @Transactional
    public MovieResponse createMovie(MovieCreateRequest request) {


        Genre genre= genreService.findOrCreateGenre(request.getGenreId(), request.getGenreName());

        Movie movie= movieMapper.toMovie(request);
        movie.setGenre(genre);
//         movie.setImage_url(request.getImageUrl());

         // 🔥 xử lý status
         if (request.getStatus() != null) {
             movie.setStatus(MovieStatus.valueOf(request.getStatus()));
         } else {
             movie.setStatus(MovieStatus.COMING_SOON); // default
         }

        Movie save = movieRepository.save(movie);
         // ép Hibernate load genre
         Genre g = save.getGenre();
         if (g != null) {
             g.getName();
         }


        return movieMapper.toMovieResponse(save);
    }

    public List<MovieResponse> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }
    public MovieResponse getMovieById(String id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXIST));
        return movieMapper.toMovieResponse(movie);
    }

    public MovieResponse updateMovie(String id, MovieUpdateRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXIST));

        movieMapper.updateMovieFromRequest(request, movie);

        // Nếu có genreId hoặc genreName mới, cập nhật genre
        if (request.getGenreId() != null || request.getGenreName() != null) {
            Genre genre = genreService.findOrCreateGenre(request.getGenreId(), request.getGenreName());
            movie.setGenre(genre);
        }

        // xử lý status (enum)
        if (request.getStatus() != null) {
            movie.setStatus(MovieStatus.valueOf(request.getStatus()));
        }


        Movie updatedMovie = movieRepository.save(movie);
        return movieMapper.toMovieResponse(updatedMovie);
    }

    @Transactional
    public void updateStatus(String id, String status) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXIST));

        movie.setStatus(MovieStatus.valueOf(status));
    }

     public void deleteMovie(String id) {
         Movie movie = movieRepository.findById(id)
                 .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXIST));
         movieRepository.delete(movie);
     }

    public PageResponse<MovieResponse> getMovies(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> moviePage = movieRepository.findAll(pageable);

        return PageResponse.<MovieResponse>builder()
                .content(moviePage.getContent().stream().map(movieMapper::toMovieResponse).toList())
                .page(moviePage.getNumber())
                .size(moviePage.getSize())
                .totalElements(moviePage.getTotalElements())
                .totalPages(moviePage.getTotalPages())
                .build();
    }

    public List<MovieResponse> getMovieByStatus(String status) {
        MovieStatus movieStatus;
        try {
            movieStatus = MovieStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_MOVIE_STATUS);
        }

        List<Movie> movies = movieRepository.findByStatus(movieStatus);
        return movies.stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }
    public List<MovieResponse> searchMovies(String keyword) {
        List<Movie> movies = movieRepository.findByTitleContainingIgnoreCase(keyword);
        return movieMapper.toMovieResponseList(movies);
    }

    public List<MovieResponse> getMoviesByGenre(String genreId) {
        List<Movie> movies = movieRepository.findByGenreId(genreId);
        return movieMapper.toMovieResponseList(movies);
    }
//
//    @Async
//    @Transactional
//    public CompletableFuture<MovieResponseDTO> updateMovie(Long id, MovieRequestDTO movieRequest) {
//        Movie movie = movieRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
//
//        movie.setTitle(movieRequest.getTitle());
//        movie.setGenre(movieRequest.getGenre());
//        movie.setDescription(movieRequest.getDescription());
//        movie.setTicketPrice(movieRequest.getTicketPrice());
//
//        Movie updatedMovie = movieRepository.save(movie);
//        return CompletableFuture.completedFuture(convertToDTO(updatedMovie));
//    }
//
//    @Async
//    @Transactional
//    public CompletableFuture<Void> deleteMovie(Long id) {
//        movieRepository.deleteById(id);
//        return CompletableFuture.completedFuture(null);
//    }
//
//    private MovieResponseDTO convertToDTO(Movie movie) {
//        return MovieResponseDTO.builder()
//                .id(movie.getId())
//                .title(movie.getTitle())
//                .genre(movie.getGenre())
//                .description(movie.getDescription())
//                .ticketPrice(movie.getTicketPrice())
//                .imageUrl(movie.getImage_url())  // ADD imageUrl here!
//                .build();
//    }
}

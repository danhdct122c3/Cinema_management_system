package com.example.cinema_booking.controller;

import com.example.cinema_booking.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {
    
    private final JdbcTemplate jdbcTemplate;
    private final MovieRepository movieRepository;

    @GetMapping("/movies-raw")
    public List<Map<String, Object>> getMoviesRaw() {
        return jdbcTemplate.queryForList("SELECT  id, title, image_url FROM movie");
    }

    @GetMapping("/movies-jpa")  
    public Object getMoviesJpa() {
        try {
            var movie = movieRepository.findById(1L).orElseThrow();
            return Map.of(
                "id", movie.getId(),
                "title", movie.getTitle(),
                "image_url_value", movie.getImage_url() != null ? movie.getImage_url() : "NULL",
                "className", movie.getClass().getName()
            );
        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }
}

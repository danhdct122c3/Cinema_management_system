package com.example.cinema_booking.config;

import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.entity.Screening;
import com.example.cinema_booking.entity.Seat;
import com.example.cinema_booking.enums.SeatStatus;
import com.example.cinema_booking.repository.MovieRepository;
import com.example.cinema_booking.repository.ScreeningRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("!prod") // Don't run in production
public class DataInitializer implements CommandLineRunner {
    private final MovieRepository movieRepository;
    private final ScreeningRepository screeningRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (movieRepository.count() > 0) {
            log.info("Database already has data, skipping initialization");
            return;
        }

        log.info("Starting data initialization...");

        // Create movies
        List<Movie> movies = createMovies();
        movies = movieRepository.saveAll(movies);

        // Create screenings for each movie
        for (Movie movie : movies) {
            createScreeningsForMovie(movie);
        }

        log.info("Data initialization completed");
    }

    private List<Movie> createMovies() {
        return List.of(
            Movie.builder()
                .title("Avengers: Endgame")
                .genre("Action")
                .description("The epic conclusion to the Infinity Saga")
                .ticketPrice(120000)
                .screenings(new ArrayList<>())
                .build(),
            Movie.builder()
                .title("The Dark Knight")
                .genre("Action")
                .description("Batman faces his greatest challenge")
                .ticketPrice(100000)
                .screenings(new ArrayList<>())
                .build(),
            Movie.builder()
                .title("Inception")
                .genre("Sci-Fi")
                .description("A thief who steals corporate secrets through dream-sharing technology")
                .ticketPrice(110000)
                .screenings(new ArrayList<>())
                .build()
        );
    }

    private void createScreeningsForMovie(Movie movie) {
        LocalDateTime now = LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
        
        List<Screening> screenings = List.of(
            createScreening(movie, now.withHour(10)),
            createScreening(movie, now.withHour(14)),
            createScreening(movie, now.plusDays(1).withHour(10))
        );

        screeningRepository.saveAll(screenings);
    }

    private Screening createScreening(Movie movie, LocalDateTime time) {
        Screening screening = Screening.builder()
            .movie(movie)
            .screeningTime(time)
            .totalSeats(100)
            .availableSeats(100)
            .seats(ConcurrentHashMap.newKeySet())
            .build();

        // Create 100 seats (10x10)
        for (int row = 0; row < 10; row++) {
            String rowLabel = String.valueOf((char) ('A' + row));
            for (int seatNum = 1; seatNum <= 10; seatNum++) {
                Seat seat = Seat.builder()
                    .screening(screening)
                    .seatRow(rowLabel)
                    .seatNumber(String.valueOf(seatNum))
                    .status(SeatStatus.AVAILABLE)
                    .build();
                screening.getSeats().add(seat);
            }
        }

        return screening;
    }
} 
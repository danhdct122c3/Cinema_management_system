package com.example.cinema_booking.service.impl;

import com.example.cinema_booking.dto.request.ShowTimeCreateRequest;
import com.example.cinema_booking.dto.response.ShowTimeResponse;
import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.entity.Room;
import com.example.cinema_booking.entity.ShowTime;
import com.example.cinema_booking.enums.ShowTimeStatus;
import com.example.cinema_booking.exception.AppException;
import com.example.cinema_booking.exception.ErrorCode;
import com.example.cinema_booking.mapper.MovieMapper;
import com.example.cinema_booking.mapper.ShowTimeMapper;
import com.example.cinema_booking.repository.MovieRepository;
import com.example.cinema_booking.repository.RoomRepository;
import com.example.cinema_booking.repository.SeatRepository;
import com.example.cinema_booking.repository.ShowTimeRepository;
import com.example.cinema_booking.service.SeatShowTimeService;
import com.example.cinema_booking.service.ShowTimeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShowTimeServiceImpl  implements ShowTimeService {
    private final ShowTimeRepository showTimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;
    private final ShowTimeMapper showTimeMapper;
    private  final SeatShowTimeService seatShowTimeService;

    @Transactional
    public ShowTimeResponse createScreening(ShowTimeCreateRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXIST));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXIST));

        validateShowTime(movie, request.getStartTime(), request.getEndTime());
        log.info("Validated showtime for movie {} in room {}", movie.getTitle(), room.getId());
        // ❗ check overlap
        if (showTimeRepository.existsOverlap(
                room.getId(),
                request.getStartTime(),
                request.getEndTime()
        )) {
            throw new AppException(ErrorCode.SHOWTIME_OVERLAP);
        }

//        LocalDateTime expectedEnd = request.getStartTime().plusMinutes(movie.getDuration());
//
//        if (endTime.isBefore(expectedEnd)) {
//            throw new AppException(ErrorCode.SHOWTIME_TOO_SHORT);
//        }

        ShowTime showTime = showTimeMapper.toShowTime(request);
        showTime.setMovie(movie);
        showTime.setRoom(room);
        showTime.setStatus(ShowTimeStatus.ACTIVE);

        ShowTime savedShowTime = showTimeRepository.save(showTime);

        seatShowTimeService.createSeatShowTime(savedShowTime,room);

        return showTimeMapper.toShowTimeResponse(savedShowTime);
    }


    private void validateShowTime(Movie movie, LocalDateTime startTime, LocalDateTime endTime) {
        // không chiếu trước ngày phát hành của phim
         if(startTime.toLocalDate().isBefore(movie.getReleaseDate())){
                throw new AppException(ErrorCode.SHOWTIME_BEFORE_MOVIE_RELEASE);
        }

         if(!endTime.isAfter(startTime)){
                throw new AppException(ErrorCode.SHOWTIME_END_BEFORE_START);
         }
    }

    public ShowTimeResponse getShowTimeById(String id) {
        ShowTime showTime = showTimeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_EXIST));
        return showTimeMapper.toShowTimeResponse(showTime);

    }

    public List<ShowTimeResponse> getAllShowTimes() {
        List<ShowTime> showTimes = showTimeRepository.findAll();
        return showTimes.stream()
                .map(showTimeMapper::toShowTimeResponse)
                .toList();
    }
//
//    @Async
//    @Transactional(readOnly = true)
//    public CompletableFuture<ScreeningResponseDTO> getScreeningById(String id) {
//        ShowTime showTime = screeningRepository.findByIdWithDetails(id)
//                .orElseThrow(() -> new RuntimeException("ShowTime not found"));
//        return CompletableFuture.completedFuture(ScreeningResponseDTO.fromEntity(showTime));
//    }
//
//    @Async
//    @Transactional(readOnly = true)
//    public CompletableFuture<List<SeatResponseDTO>> getSeatsByRoom(String roomId) {
//        Room room = roomRepository.findById(roomId)
//                .orElseThrow(() -> new RuntimeException("Room not found"));
//
//        List<SeatResponseDTO> seats = room.getSeats().stream()
//                .map(SeatResponseDTO::fromEntity)
//                .collect(Collectors.toList());
//
//        return CompletableFuture.completedFuture(seats);
//    }
//
//    @Async
//    @Transactional(readOnly = true)
//    public CompletableFuture<List<ScreeningResponseDTO>> getScreeningsByMovie(Long movieId) {
//        Movie movie = movieRepository.findById(movieId)
//                .orElseThrow(() -> new RuntimeException("Movie not found"));
//
//        List<ScreeningResponseDTO> screenings = movie.getShowTimes().stream()
//                .map(ScreeningResponseDTO::fromEntity)
//                .collect(Collectors.toList());
//
//        return CompletableFuture.completedFuture(screenings);
//    }
}
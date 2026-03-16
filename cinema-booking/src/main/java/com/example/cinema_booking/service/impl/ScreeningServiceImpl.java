//package com.example.cinema_booking.service.impl;
//
//@Service
//@RequiredArgsConstructor
//public class ScreeningServiceImpl {
//    private final ScreeningRepository screeningRepository;
//    private final MovieRepository movieRepository;
//    private final RoomRepository roomRepository;
//    private final SeatRepository seatRepository;
//
//    @Async
//    @Transactional
//    public CompletableFuture<ScreeningResponseDTO> createScreening(ScreeningRequestDTO request) {
//        Movie movie = movieRepository.findById(request.getMovieId())
//                .orElseThrow(() -> new RuntimeException("Movie not found"));
//
//        Room room = roomRepository.findById(request.getRoomId())
//                .orElseThrow(() -> new RuntimeException("Room not found"));
//
//        ShowTime showTime = ShowTime.builder()
//                .movie(movie)
//                .room(room)
//                .start_time(request.getStartTime())
//                .end_time(request.getEndTime())
//                .build();
//
//        ShowTime savedShowTime = screeningRepository.save(showTime);
//        return CompletableFuture.completedFuture(ScreeningResponseDTO.fromEntity(savedShowTime));
//    }
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
//}
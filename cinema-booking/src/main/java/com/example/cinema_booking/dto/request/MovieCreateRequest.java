package com.example.cinema_booking.dto.request;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieCreateRequest {
    private String title;
    private String description;
    private String duration;
    private String status;
    private LocalDate releaseDate;
    private String genreId;  // ID nếu chọn thể loại có sẵn
    private String genreName;  // Tên nếu tạo thể loại mới
    private String imageUrl;  // URL của ảnh đại diện
    private String trailerUrl; // URL của trailer
}

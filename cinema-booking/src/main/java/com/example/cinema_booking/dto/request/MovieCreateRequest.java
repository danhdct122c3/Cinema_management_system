package com.example.cinema_booking.dto.request;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

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
    private List<String> genreIds;        // Danh sách ID thể loại (có sẵn)
    private List<String> genreNames;      // Danh sách tên thể loại (tạo mới nếu chưa có)
    private String imageUrl;              // URL của ảnh đại diện
    private String trailerUrl;            // URL của trailer
}

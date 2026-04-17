package com.example.cinema_booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieCreateRequest {

    @NotBlank(message = "NOT_NULL")
    private String title;
    private String description;
    @NotBlank(message = "NOT_NULL")
    private Integer duration;
    @NotBlank(message = "NOT_NULL")
    private String status;
    @NotBlank(message = "NOT_NULL")
    private LocalDate releaseDate;
    @NotBlank(message = "NOT_NULL")
    private List<String> genreIds;        // Danh sách ID thể loại (có sẵn)
    @NotBlank(message = "NOT_NULL")
    private List<String> genreNames;      // Danh sách tên thể loại (tạo mới nếu chưa có)
    @NotBlank(message = "NOT_NULL")
    private String imageUrl;              // URL của ảnh đại diện
    @NotBlank(message = "NOT_NULL")
    private String trailerUrl;            // URL của trailer
}

package com.example.cinema_booking.entity;

import com.example.cinema_booking.enums.MovieStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id", nullable = false)
    private Genre genre;

    private String description;
    private String duration;

    private LocalDate releaseDate;

    @Enumerated(EnumType.STRING)
    private MovieStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(name = "image_url")
    private String imageUrl;  // Match database column name exactly

    @Column(name = "trailer_url")
    private String trailerUrl;  // Match database column name exactly

//    @JsonIgnore
//    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
//    @Builder.Default
//    private List<ShowTime> showTimes = new ArrayList<>();
}

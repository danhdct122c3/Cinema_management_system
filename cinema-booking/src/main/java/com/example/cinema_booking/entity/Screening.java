package com.example.cinema_booking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Screening {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    Movie movie;

    LocalDateTime screeningTime;

    @JsonIgnore
    @OneToMany(mappedBy = "screening", cascade = CascadeType.ALL)
    @Builder.Default
    Set<Seat> seats = ConcurrentHashMap.newKeySet();

    @Version
    Long version;

    Integer totalSeats;
    Integer availableSeats;
}

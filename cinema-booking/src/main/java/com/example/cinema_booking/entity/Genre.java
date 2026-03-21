package com.example.cinema_booking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "genres")
public class Genre {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String name;


    @OneToMany(mappedBy = "genre", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Movie> movies = new ArrayList<>();
}

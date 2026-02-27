package com.example.cinema_booking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String room_name;

    @JsonIgnore
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    @Builder.Default
    List<Seat> seats = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    @Builder.Default
    List<ShowTime> showTimes = new ArrayList<>();
}

package com.example.cinema_booking.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Seat {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String seat_row;
    String seat_number;
    Long price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    Room room;

    @Version
    Long version;
}

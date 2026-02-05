package com.example.cinema_booking.entity;

import com.example.cinema_booking.enums.SeatStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Seat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "screening_id")
    Screening screening;

    String seatRow;
    String seatNumber;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    SeatStatus status = SeatStatus.AVAILABLE;

    @Version
    Long version;

    @OneToOne(mappedBy = "seat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Booking currentBooking;
}

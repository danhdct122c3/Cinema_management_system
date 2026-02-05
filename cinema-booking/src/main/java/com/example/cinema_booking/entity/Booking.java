package com.example.cinema_booking.entity;

import com.example.cinema_booking.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_id")
    Screening screening;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id")
    Seat seat;

    LocalDateTime bookingTime;
    LocalDateTime expirationTime;

    @Enumerated(EnumType.STRING)
    BookingStatus status;

    String customerName;
    String customerEmail;
    String customerPhone;

    @Version
    Long version;

    double totalPrice;
}

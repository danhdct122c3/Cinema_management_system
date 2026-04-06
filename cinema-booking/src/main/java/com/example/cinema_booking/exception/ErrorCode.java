package com.example.cinema_booking.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    USER_EXISTED(1002, "User already exists", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1004, "Invalid message key", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1008, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION(999, "Uncategorized exception", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    USER_NOT_EXISTED(1005, "User does not exist", HttpStatus.NOT_FOUND),
    INVALID_DOB(1009, "Your age must be at least {min}", HttpStatus.NOT_FOUND),
    GENRE_NOT_EXIST(1010, "Genre not exist", HttpStatus.NOT_FOUND),
    INVALID_GENRE(1011, "invalid genre", HttpStatus.BAD_REQUEST),
    GENRE_ALREADY_EXIST(1014, "Genre already exist", HttpStatus.BAD_REQUEST),
    MOVIE_NOT_EXIST(1012, "Movie not exist", HttpStatus.NOT_FOUND),
    INVALID_MOVIE_STATUS(1013, "Invalid movie status", HttpStatus.BAD_REQUEST),
    SEAT_ALREADY_EXIST(1015, "Seat already exist", HttpStatus.BAD_REQUEST),
    INVALID_ROLE(1016, "Invalid role", HttpStatus.BAD_REQUEST),
    ROLE_EXISTED(1017, "Role already exist", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED(1018, "Role not exist", HttpStatus.NOT_FOUND),
    PERMISSION_NOT_EXISTED(1019, "Permission not exist", HttpStatus.NOT_FOUND),
    INVALID_REQUEST(1020, "Invalid request", HttpStatus.BAD_REQUEST),
    ROOM_NOT_EXIST(1016, "Room not exist", HttpStatus.NOT_FOUND),
    SHOWTIME_BEFORE_MOVIE_RELEASE(1017,"Show time have to after movie release " ,HttpStatus.BAD_REQUEST ),
    SHOWTIME_END_BEFORE_START(1018,"Show time end have to after show time start " ,HttpStatus.BAD_REQUEST ),
    SHOWTIME_OVERLAP(1019,"Show time overlap with existing show time " ,HttpStatus.BAD_REQUEST ),
    SEAT_SHOWTIME_EXISTED(1020,"Seat already exist in this show time " ,HttpStatus.BAD_REQUEST ),
    SHOWTIME_NOT_EXIST(1021,"Show time not exist " ,HttpStatus.NOT_FOUND ),
    INVALID_SEAT_ID(1022,"Invalid seat id " ,HttpStatus.BAD_REQUEST ),
    SEAT_ALREADY_HELD(1023,"Seat already held " ,HttpStatus.BAD_REQUEST ),
    INVALID_SEAT_IDS(1024,"Invalid seat IDs" ,HttpStatus.BAD_REQUEST ),
    HOLD_EXPIRED(1025,"Hold time expired" ,HttpStatus.BAD_REQUEST ),
    SEAT_NOT_AVAILABLE(1026, "Seat not available", HttpStatus.BAD_REQUEST),
    SEAT_HOLD_USER_MISMATCH(1027, "Seat hold user mismatch", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_FOUND(1028, "Booking not found", HttpStatus.NOT_FOUND),
    BOOKING_ALREADY_CANCELLED(1029, "Booking already cancelled", HttpStatus.BAD_REQUEST),
    BOOKING_ALREADY_CONFIRMED(1030, "Booking already confirmed", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_PENDING(1031, "Booking is not pending", HttpStatus.BAD_REQUEST),
    ;



    private int code;
    private String message;
    private HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.message = message;
        this.code = code;
        this.statusCode = statusCode;
    }
}

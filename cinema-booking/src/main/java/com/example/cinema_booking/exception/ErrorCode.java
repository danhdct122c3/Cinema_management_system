package com.example.cinema_booking.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    USER_EXISTED(1002, "User exited", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1004, "Invalid message key", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1008, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION(999, "Uncategorized exception", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(1006, "Unauthentiated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    USER_NOT_EXISTED(1005, "User not  exited", HttpStatus.NOT_FOUND),
    INVALID_DOB(1009, "Your age must be at least {min}", HttpStatus.NOT_FOUND),
    GENRE_NOT_EXIST(1010, "Genre not exist", HttpStatus.NOT_FOUND),
    INVALID_GENRE(1011, "invalid genre", HttpStatus.BAD_REQUEST),
    GENRE_ALREADY_EXIST(1014, "Genre already exist", HttpStatus.BAD_REQUEST),
    MOVIE_NOT_EXIST(1012, "Movie not exist", HttpStatus.NOT_FOUND),
    INVALID_MOVIE_STATUS(1013, "Invalid movie status", HttpStatus.BAD_REQUEST)
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

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
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    USER_NOT_EXISTED(1005, "User not  exited", HttpStatus.NOT_FOUND),
    INVALID_DOB(1009, "Your age must be at least {min}", HttpStatus.NOT_FOUND),

    INVALID_REQUEST(1010, "Invalid request", HttpStatus.BAD_REQUEST),
    PERMISSION_EXISTED(1011, "Permission existed", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_EXISTED(1012, "Permission not existed", HttpStatus.NOT_FOUND),

    ROLE_EXISTED(1013, "Role existed", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED(1014, "Role not existed", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;


    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.message = message;
        this.code = code;
        this.statusCode = statusCode;
    }
}

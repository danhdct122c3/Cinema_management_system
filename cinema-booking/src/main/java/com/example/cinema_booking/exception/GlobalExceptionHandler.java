package com.example.cinema_booking.exception;

import com.example.cinema_booking.dto.request.APIResponse;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;
import java.util.Objects;

import static com.example.cinema_booking.exception.ErrorCode.UNCATEGORIZED_EXCEPTION;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    private static final String MIN_ATTRIBUTE = "min";

    @ExceptionHandler(value= Exception.class)
    ResponseEntity<APIResponse> runtimeExcecptionHandler(Exception e){
        log.error("Uncategorized exception occurred", e);
        APIResponse apiResponse = APIResponse.builder()
                .code(UNCATEGORIZED_EXCEPTION.getCode())
                .message(e.getMessage() != null ? e.getMessage() : ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage())
                .build();
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<APIResponse> appExceptionHandler(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        APIResponse apiResponse = APIResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    /**
     * 403 - user đã authenticate nhưng không đủ quyền (ví dụ @PreAuthorize hasRole('ADMIN')).
     * Lưu ý: Spring Security ném org.springframework.security.access.AccessDeniedException
     */
    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<APIResponse> accessDeniedExceptionHandler(AccessDeniedException e) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        return ResponseEntity.status(errorCode.getStatusCode())
                .body(APIResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

//    /**
//     * 401 - token thiếu/invalid/expired.
//     */
//    @ExceptionHandler(value = AuthenticationException.class)
//    ResponseEntity<APIResponse> authenticationExceptionHandler(AuthenticationException e) {
//        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;
//        return ResponseEntity.status(errorCode.getStatusCode())
//                .body(APIResponse.builder()
//                        .code(errorCode.getCode())
//                        .message(errorCode.getMessage())
//                        .build());
//    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<APIResponse> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e) {
        String enumKey = e.getFieldError().getDefaultMessage();

        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        Map<String, Object> attributes = null;
        try {
            errorCode = ErrorCode.valueOf(enumKey);

                    var constrainViolation =
                    e.getBindingResult().getAllErrors().getFirst().unwrap(ConstraintViolation.class);

                    attributes= constrainViolation.getConstraintDescriptor().getAttributes();
                    log.info(attributes.toString());
        } catch (IllegalArgumentException ie) {
            log.error("Invalid enum key: {}", enumKey, ie);
        }

        APIResponse apiResponse = APIResponse.builder()
                .code(errorCode.getCode())
                .message(Objects.nonNull(attributes)
                        ? mapAttribute(errorCode.getMessage(), attributes)
                        : errorCode.getMessage())
                .build();
        return ResponseEntity.badRequest().body(apiResponse);
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));

        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }


}
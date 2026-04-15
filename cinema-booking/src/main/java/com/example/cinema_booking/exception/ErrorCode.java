package com.example.cinema_booking.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    USER_EXISTED(1002, "Người dùng đã tồn tại", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Tên đăng nhập phải có ít nhất {min} ký tự", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1004, "Khóa thông báo không hợp lệ", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1008, "Mật khẩu phải có ít nhất {min} ký tự", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION(999, "Lỗi không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(1006, "Chưa xác thực", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "Bạn không có quyền truy cập", HttpStatus.FORBIDDEN),
    USER_NOT_EXISTED(1005, "Người dùng không tồn tại", HttpStatus.NOT_FOUND),
    INVALID_DOB(1009, "Tuổi của bạn phải ít nhất {min}", HttpStatus.NOT_FOUND),
    GENRE_NOT_EXIST(1010, "Thể loại không tồn tại", HttpStatus.NOT_FOUND),
    INVALID_GENRE(1011, "Thể loại không hợp lệ", HttpStatus.BAD_REQUEST),
    GENRE_ALREADY_EXIST(1014, "Thể loại đã tồn tại", HttpStatus.BAD_REQUEST),
    MOVIE_NOT_EXIST(1012, "Phim không tồn tại", HttpStatus.NOT_FOUND),
    INVALID_MOVIE_STATUS(1013, "Trạng thái phim không hợp lệ", HttpStatus.BAD_REQUEST),
    SEAT_ALREADY_EXIST(1015, "Ghế đã tồn tại", HttpStatus.BAD_REQUEST),
    INVALID_ROLE(1016, "Vai trò không hợp lệ", HttpStatus.BAD_REQUEST),
    ROLE_EXISTED(1017, "Vai trò đã tồn tại", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED(1018, "Vai trò không tồn tại", HttpStatus.NOT_FOUND),
    PERMISSION_NOT_EXISTED(1019, "Quyền không tồn tại", HttpStatus.NOT_FOUND),
    INVALID_REQUEST(1020, "Yêu cầu không hợp lệ", HttpStatus.BAD_REQUEST),
    ROOM_NOT_EXIST(1016, "Phòng chiếu không tồn tại", HttpStatus.NOT_FOUND),
    SHOWTIME_BEFORE_MOVIE_RELEASE(1017,"Suất chiếu phải sau ngày khởi chiếu của phim" ,HttpStatus.BAD_REQUEST ),
    SHOWTIME_END_BEFORE_START(1018,"Thời gian kết thúc suất chiếu phải sau thời gian bắt đầu" ,HttpStatus.BAD_REQUEST ),
    SHOWTIME_OVERLAP(1019,"Suất chiếu bị trùng với suất chiếu hiện có" ,HttpStatus.BAD_REQUEST ),
    SEAT_SHOWTIME_EXISTED(1020,"Ghế đã tồn tại trong suất chiếu này" ,HttpStatus.BAD_REQUEST ),
    SHOWTIME_NOT_EXIST(1021,"Suất chiếu không tồn tại" ,HttpStatus.NOT_FOUND ),
    INVALID_SEAT_ID(1022,"Mã ghế không hợp lệ" ,HttpStatus.BAD_REQUEST ),
    SEAT_ALREADY_HELD(1023,"Ghế đã được giữ" ,HttpStatus.BAD_REQUEST ),
    INVALID_SEAT_IDS(1024,"Danh sách mã ghế không hợp lệ" ,HttpStatus.BAD_REQUEST ),
    HOLD_EXPIRED(1025,"Thời gian giữ ghế đã hết hạn" ,HttpStatus.BAD_REQUEST ),
    SEAT_NOT_AVAILABLE(1026, "Ghế không khả dụng", HttpStatus.BAD_REQUEST),
    SEAT_HOLD_USER_MISMATCH(1027, "Người giữ ghế không khớp", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_FOUND(1028, "Không tìm thấy đặt vé", HttpStatus.NOT_FOUND),
    BOOKING_ALREADY_CANCELLED(1029, "Đặt vé đã bị hủy", HttpStatus.BAD_REQUEST),
    BOOKING_ALREADY_CONFIRMED(1030, "Đặt vé đã được xác nhận", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_PENDING(1031, "Đặt vé không ở trạng thái chờ", HttpStatus.BAD_REQUEST),
    SHOWTIME_ALREADY_PASSED(1032, "Suất chiếu đã diễn ra", HttpStatus.BAD_REQUEST),
    SHOWTIME_HAS_BOOKINGS(1033, "Không thể xóa hoặc cập nhật suất chiếu đã có đặt vé", HttpStatus.BAD_REQUEST),
    PAYMENT_ALREADY_EXISTS(1034, "Đã tồn tại thanh toán cho đặt vé này", HttpStatus.BAD_REQUEST),
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

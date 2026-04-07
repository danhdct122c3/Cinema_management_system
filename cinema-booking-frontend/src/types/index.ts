export interface Genre {
    id: string;
    name: string;
}

export interface APIResponse<T> {
    result: T;
    code?: string;
    message?: string;
}

export interface Movie {
    id: string;
    title: string;
    description: string;
    duration: string;
    imageUrl: string;
    trailerUrl: string;
    genreId: string;
    genreName: string;
    status: 'COMING_SOON' | 'NOW_SHOWING' | 'ENDED';
    releaseDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface Screening {
    id: string;
    movie: Movie;
    screeningTime: string;
    totalSeats: number;
    availableSeats: number;
}

export interface Seat {
    id: string;
    seatRow: string;
    seatNumber: string;
    status: 'AVAILABLE' | 'BOOKED' | 'RESERVED';
    version: number;
}

export interface Booking {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    screening: Screening;
    seat: Seat;
    bookingTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    version: number;
}

export interface BookingRequest {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    screeningId: string;
    seatId: string;
}

export interface ErrorResponse {
    message: string;
    status: number;
    timestamp: string;
}

// ===== ShowTime Related =====
export interface ShowTimeCreateRequest {
    movieId: string;
    roomId: string;
    startTime: string;  // ISO DateTime: "2024-12-31T14:00:00"
    // endTime được tính tự động bởi backend dựa vào duration phim + 10 phút nghỉ
}

export interface ShowTimeResponse {
    id: string;
    movieId: string;
    roomId: string;
    roomName: string;  // Room name for display
    startTime: string;  // ISO DateTime: "2024-12-31T14:00:00"
    endTime: string;    // ISO DateTime: "2024-12-31T16:30:00"
    status: 'ACTIVE' | 'CANCELLED';
}

export interface SeatShowTimeResponse {
    id: string;
    seatCode: string;   // "A1", "A2", "B5"
    status: 'AVAILABLE' | 'BOOKED' | 'HOLD';
    seatType: 'NORMAL' | 'VIP';  // Seat type
    price: number;
    holdExpireTime?: string;      // ISO DateTime - khi hold hết (nếu HOLD)
    heldByUserEmail?: string;     // Email của user đang hold (nếu HOLD)
}

export interface Room {
    id: string;
    roomName: string;
    totalRows: number;
    totalColumns: number;
}

export interface ShowTimeDetail extends ShowTimeResponse {
    movie?: Movie;
    room?: Room;
}

// ===== Hold Seat Related =====
export interface HoldSeatRequest {
    seatShowTimeIds: string[];  // List of SeatShowTime IDs
    showTimeId: string;  // ShowTime ID for finding all seats in that showtime
    userId: string;  // UUID of user
    holdDuration: number;  // Duration in minutes (e.g., 5)
}

export interface HoldSeatResponse {
    heldSeatCodes: string[];  // e.g., ["A1", "A2", "B5"]
    holdDurationSeconds: number;  // Duration in seconds (e.g., 300)
    totalPrice: number;  // Total price of held seats
    showTimeId?: string;
    userEmail?: string;
    holdStartTime?: number;  // Timestamp when hold was created (ms)
}

export interface SeatShowTimeSummary {
    row: string;
    seats: SeatShowTimeResponse[];
} 
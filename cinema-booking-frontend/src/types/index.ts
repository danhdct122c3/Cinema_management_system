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

// ===== Authentication Related =====
export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface RefreshRequest {
    token: string;
}

export interface LogoutRequest {
    token?: string;
}

export interface AuthenticationResult {
    token: string;
    isAuthenticated: boolean;
}

// ===== ShowTime Related =====
export interface ShowTimeResponse {
    id: string;
    movieId: string;
    roomId: string;
    roomName: string;
    startTime: string;
    endTime: string;
    status: 'ACTIVE' | 'CANCELLED';
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

// ===== Seat ShowTime Related =====
export interface SeatShowTimeResponse {
    id: string;
    seatCode: string;
    status: 'AVAILABLE' | 'BOOKED' | 'HOLD';
    seatType: 'NORMAL' | 'VIP';
    price: number;
    holdExpireTime?: string;
    heldByUserEmail?: string;
}

export interface SeatShowTimeSummary {
    row: string;
    seats: SeatShowTimeResponse[];
}

// ===== Hold Seat Related =====
export interface HoldSeatRequest {
    seatShowTimeIds: string[];
    showTimeId: string;
    userId: string;
    holdDuration: number;
}

export interface HoldSeatResponse {
    heldSeatCodes: string[];
    holdDurationSeconds: number;
    totalPrice: number;
    showTimeId?: string;
    userEmail?: string;
    holdStartTime?: number;
}
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
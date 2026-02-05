export interface Movie {
    id: number;
    title: string;
    description: string;
    duration: number;
    imageUrl: string;
    genre: string;
    director: string;
    releaseDate: string;
}

export interface Screening {
    id: number;
    movie: Movie;
    screeningTime: string;
    totalSeats: number;
    availableSeats: number;
}

export interface Seat {
    id: number;
    seatRow: string;
    seatNumber: string;
    status: 'AVAILABLE' | 'BOOKED' | 'RESERVED';
    version: number;
}

export interface Booking {
    id: number;
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
    screeningId: number;
    seatId: number;
}

export interface ErrorResponse {
    message: string;
    status: number;
    timestamp: string;
} 
import axios from 'axios';
import { Movie, Screening, Seat, Booking, BookingRequest } from '../types';

const API_BASE_URL = '/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const movieService = {
    getAllMovies: () => axiosInstance.get<Movie[]>('/movies'),
    getMovieById: (id: number) => axiosInstance.get<Movie>(`/movies/${id}`),
    getMovieScreenings: (movieId: number) => axiosInstance.get<Screening[]>(`/screenings/movie/${movieId}`),
};

export const screeningService = {
    getScreeningById: (id: number) => axiosInstance.get<Screening>(`/screenings/${id}`),
    getAvailableSeats: (screeningId: number) => axiosInstance.get<Seat[]>(`/screenings/${screeningId}/seats`),
};

export const bookingService = {
    createBooking: (data: BookingRequest) => axiosInstance.post<Booking>('/bookings', data),
    getBookingById: (id: number) => axiosInstance.get<Booking>(`/bookings/${id}`),
    cancelBooking: (id: number) => axiosInstance.delete(`/bookings/${id}`),
    getBookingsByEmail: (email: string) => axiosInstance.get<Booking[]>(`/bookings/user/${email}`),
    reserveSeat: (screeningId: number, seatId: number) =>
        axiosInstance.post<boolean>(`/bookings/screenings/${screeningId}/seats/${seatId}/reserve`),
    releaseSeatReservation: (screeningId: number, seatId: number) =>
        axiosInstance.post<boolean>(`/bookings/screenings/${screeningId}/seats/${seatId}/release`),
    confirmBooking: (id: number) => axiosInstance.post<Booking>(`/bookings/${id}/confirm`)
};

// Add interceptor to handle concurrent booking errors
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 409) {
            // Conflict error - seat already taken
            throw new Error('This seat has just been taken by another customer. Please select a different seat.');
        }
        throw error;
    }
); 
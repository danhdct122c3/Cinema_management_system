import axios, { AxiosResponse } from 'axios';
import { Movie, Screening, Seat, Booking, BookingRequest, APIResponse, Genre, ShowTimeResponse, SeatShowTimeResponse, HoldSeatRequest, HoldSeatResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/home';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Separate instance for file uploads (no JSON content-type)
const axiosFileInstance = axios.create({
    baseURL: API_BASE_URL,
});

export interface MovieCreateRequest {
    title: string;
    description: string;
    duration: string;
    genreId: string;
    genreName?: string;
    releaseDate: string;
    imageUrl: string;
    trailerUrl: string;
    status: string;
}

export interface MovieUpdateRequest extends MovieCreateRequest {
}

export const movieService = {
    getAllMovies: (): Promise<AxiosResponse<APIResponse<Movie[]>>> => axiosInstance.get<APIResponse<Movie[]>>('/movies'),
    getMovieById: (id: string): Promise<AxiosResponse<APIResponse<Movie>>> => axiosInstance.get<APIResponse<Movie>>(`/movies/${id}`),
    getMovieScreenings: (movieId: string): Promise<AxiosResponse<APIResponse<Screening[]>>> => axiosInstance.get<APIResponse<Screening[]>>(`/screenings/movie/${movieId}`),
    getMoviesByGenre: (genreId: string): Promise<AxiosResponse<APIResponse<Movie[]>>> => axiosInstance.get<APIResponse<Movie[]>>(`/movies/genre/${genreId}`),
    getMoviesByStatus: (status: string): Promise<AxiosResponse<APIResponse<Movie[]>>> => axiosInstance.get<APIResponse<Movie[]>>('/movies/status', { params: { status } }),
    searchMovies: (keyword: string): Promise<AxiosResponse<APIResponse<Movie[]>>> => axiosInstance.get<APIResponse<Movie[]>>('/movies/search', { params: { keyword } }),
    createMovie: (data: MovieCreateRequest): Promise<AxiosResponse<APIResponse<Movie>>> => axiosInstance.post<APIResponse<Movie>>('/movies', data),
    updateMovie: (id: string, data: MovieUpdateRequest): Promise<AxiosResponse<APIResponse<Movie>>> => axiosInstance.put<APIResponse<Movie>>(`/movies/${id}`, data),
    deleteMovie: (id: string): Promise<AxiosResponse<void>> => axiosInstance.delete(`/movies/${id}`),
};

export const genreService = {
    getAllGenres: (): Promise<AxiosResponse<APIResponse<Genre[]>>> => axiosInstance.get<APIResponse<Genre[]>>('/genres'),
    createGenre: (name: string): Promise<AxiosResponse<APIResponse<Genre>>> => axiosInstance.post<APIResponse<Genre>>('/genres', { name }),
};

export const showtimeService = {
    // ✅ GET /showtimes
    getAllShowtimes: (): Promise<AxiosResponse<APIResponse<ShowTimeResponse[]>>> => 
        axiosInstance.get<APIResponse<ShowTimeResponse[]>>('/showtimes'),
    
    // ✅ GET /showtimes/{id}
    getShowtimeById: (id: string): Promise<AxiosResponse<APIResponse<ShowTimeResponse>>> => 
        axiosInstance.get<APIResponse<ShowTimeResponse>>(`/showtimes/${id}`),
    
    // ✅ POST /showtimes
    createShowtime: (data: any): Promise<AxiosResponse<APIResponse<ShowTimeResponse>>> => 
        axiosInstance.post<APIResponse<ShowTimeResponse>>('/showtimes', data),
    
    // ✅ GET /seat-showtimes/{showTimeId}
    getSeatsByShowtime: (showtimeId: string): Promise<AxiosResponse<APIResponse<SeatShowTimeResponse[]>>> => 
        axiosInstance.get<APIResponse<SeatShowTimeResponse[]>>(`/seat-showtimes/${showtimeId}`),
    
    // ✅ PATCH /seat-showtimes/{showTimeId}
    updateSeatPrice: (
        showtimeId: string, 
        seatType: 'NORMAL' | 'VIP', 
        price: number
    ): Promise<AxiosResponse<APIResponse<void>>> => 
        axiosInstance.patch<APIResponse<void>>(`/seat-showtimes/${showtimeId}`, { 
            seatType, 
            price 
        }),
};

export const cloudinaryService = {
    uploadImage: (file: File): Promise<AxiosResponse<string>> => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosFileInstance.post<string>('/upload', formData);
    }
};

export const screeningService = {
    getScreeningById: (id: string): Promise<AxiosResponse<APIResponse<Screening>>> => axiosInstance.get<APIResponse<Screening>>(`/screenings/${id}`),
    getAvailableSeats: (screeningId: string): Promise<AxiosResponse<APIResponse<Seat[]>>> => axiosInstance.get<APIResponse<Seat[]>>(`/screenings/${screeningId}/seats`),
};

export const bookingService = {
    createBooking: (data: BookingRequest): Promise<AxiosResponse<APIResponse<Booking>>> => axiosInstance.post<APIResponse<Booking>>('/bookings', data),
    getBookingById: (id: string): Promise<AxiosResponse<APIResponse<Booking>>> => axiosInstance.get<APIResponse<Booking>>(`/bookings/${id}`),
    cancelBooking: (id: string): Promise<AxiosResponse<void>> => axiosInstance.delete(`/bookings/${id}`),
    getBookingsByEmail: (email: string): Promise<AxiosResponse<APIResponse<Booking[]>>> => axiosInstance.get<APIResponse<Booking[]>>(`/bookings/user/${email}`),
    reserveSeat: (screeningId: string, seatId: string): Promise<AxiosResponse<APIResponse<boolean>>> =>
        axiosInstance.post<APIResponse<boolean>>(`/bookings/screenings/${screeningId}/seats/${seatId}/reserve`),
    releaseSeatReservation: (screeningId: string, seatId: string): Promise<AxiosResponse<APIResponse<boolean>>> =>
        axiosInstance.post<APIResponse<boolean>>(`/bookings/screenings/${screeningId}/seats/${seatId}/release`),
    confirmBooking: (id: string): Promise<AxiosResponse<APIResponse<Booking>>> => axiosInstance.post<APIResponse<Booking>>(`/bookings/${id}/confirm`)
};

export const holdService = {
    // POST /seat-holds/reserve - Hold seats
    holdSeats: (request: HoldSeatRequest): Promise<AxiosResponse<APIResponse<HoldSeatResponse>>> =>
        axiosInstance.post<APIResponse<HoldSeatResponse>>('/seat-holds/reserve', request),
    
    // POST /seat-holds/release - Release held seats
    releaseHold: (seatShowTimeIds: string[]): Promise<AxiosResponse<APIResponse<void>>> =>
        axiosInstance.post<APIResponse<void>>('/seat-holds/release', seatShowTimeIds),
    
    // Check if hold is still valid
    isHoldValid: (seatShowTimeId: string): Promise<AxiosResponse<APIResponse<boolean>>> =>
        axiosInstance.get<APIResponse<boolean>>(`/seat-holds/${seatShowTimeId}/valid`)
};

export const userService = {
    // Get test user ID (for testing without login)
    getTestUserId: (): Promise<AxiosResponse<APIResponse<string>>> =>
        axiosInstance.get<APIResponse<string>>('/users/test-user/id')
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
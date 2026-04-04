import { AxiosResponse } from 'axios';
import {
    APIResponse,
    Movie,
    Screening,
    Seat,
    Booking,
    BookingRequest,
    Genre,
} from '../types';
import { createApiClient, createTokenStorage } from './api';

// Token admin tách biệt user
const ADMIN_TOKEN_KEY = 'adminAccessToken';

export const adminTokenStorage = createTokenStorage(ADMIN_TOKEN_KEY);

export const adminApiClient = createApiClient({ tokenStorage: adminTokenStorage });

export const adminAuthService = adminApiClient.auth;
export const adminAxios = adminApiClient.instance;

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

export interface MovieUpdateRequest extends MovieCreateRequest {}

export const adminMovieService = {
    getAllMovies: (): Promise<AxiosResponse<APIResponse<Movie[]>>> => adminAxios.get<APIResponse<Movie[]>>('/movies'),
    getMovieById: (id: string): Promise<AxiosResponse<APIResponse<Movie>>> => adminAxios.get<APIResponse<Movie>>(`/movies/${id}`),
    createMovie: (data: MovieCreateRequest): Promise<AxiosResponse<APIResponse<Movie>>> => adminAxios.post<APIResponse<Movie>>('/movies', data),
    updateMovie: (id: string, data: MovieUpdateRequest): Promise<AxiosResponse<APIResponse<Movie>>> => adminAxios.put<APIResponse<Movie>>(`/movies/${id}`, data),
    deleteMovie: (id: string): Promise<AxiosResponse<void>> => adminAxios.delete(`/movies/${id}`),
};

export const adminGenreService = {
    getAllGenres: (): Promise<AxiosResponse<APIResponse<Genre[]>>> => adminAxios.get<APIResponse<Genre[]>>('/genres'),
    createGenre: (name: string): Promise<AxiosResponse<APIResponse<Genre>>> => adminAxios.post<APIResponse<Genre>>('/genres', { name }),
};

export const adminScreeningService = {
    getScreeningById: (id: string): Promise<AxiosResponse<APIResponse<Screening>>> => adminAxios.get<APIResponse<Screening>>(`/screenings/${id}`),
    getAvailableSeats: (screeningId: string): Promise<AxiosResponse<APIResponse<Seat[]>>> => adminAxios.get<APIResponse<Seat[]>>(`/screenings/${screeningId}/seats`),
};

export const adminBookingService = {
    createBooking: (data: BookingRequest): Promise<AxiosResponse<APIResponse<Booking>>> => adminAxios.post<APIResponse<Booking>>('/bookings', data),
    getBookingById: (id: string): Promise<AxiosResponse<APIResponse<Booking>>> => adminAxios.get<APIResponse<Booking>>(`/bookings/${id}`),
    cancelBooking: (id: string): Promise<AxiosResponse<void>> => adminAxios.delete(`/bookings/${id}`),
    getBookingsByEmail: (email: string): Promise<AxiosResponse<APIResponse<Booking[]>>> => adminAxios.get<APIResponse<Booking[]>>(`/bookings/user/${email}`),
    reserveSeat: (screeningId: string, seatId: string): Promise<AxiosResponse<APIResponse<boolean>>> =>
        adminAxios.post<APIResponse<boolean>>(`/bookings/screenings/${screeningId}/seats/${seatId}/reserve`),
    releaseSeatReservation: (screeningId: string, seatId: string): Promise<AxiosResponse<APIResponse<boolean>>> =>
        adminAxios.post<APIResponse<boolean>>(`/bookings/screenings/${screeningId}/seats/${seatId}/release`),
    confirmBooking: (id: string): Promise<AxiosResponse<APIResponse<Booking>>> => adminAxios.post<APIResponse<Booking>>(`/bookings/${id}/confirm`),
};


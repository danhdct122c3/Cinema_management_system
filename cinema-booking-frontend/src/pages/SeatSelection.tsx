import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { SeatMap } from '../components/SeatMap';
import { BookingForm } from '../components/BookingForm';
import { movieService, screeningService, bookingService } from '../services/api';
import { Movie, Seat, BookingRequest, Screening } from '../types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

export const SeatSelection: React.FC = () => {
    const { movieId, screeningId } = useParams<{ movieId: string; screeningId: string }>();
    const navigate = useNavigate();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [screening, setScreening] = useState<Screening | null>(null);
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
    const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!movieId || !screeningId) return;

                const [movieResponse, screeningResponse] = await Promise.all([
                    movieService.getMovieById(Number(movieId)),
                    screeningService.getScreeningById(Number(screeningId))
                ]);

                setMovie(movieResponse.data);
                setScreening(screeningResponse.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load movie and screening information.');
                setLoading(false);
            }
        };

        fetchData();
    }, [movieId, screeningId]);

    const handleSeatSelect = (seat: Seat | null) => {
        setSelectedSeat(seat);
        setError('');
    };

    const handleContinueToBooking = async () => {
        if (!selectedSeat || !screeningId) return;

        try {
            setIsSubmitting(true);
            const response = await bookingService.reserveSeat(Number(screeningId), selectedSeat.id);

            if (response.data) {
                setIsBookingFormOpen(true);
            } else {
                setError('This seat is no longer available. Please select another seat.');
                setSelectedSeat(null);
            }
        } catch (error) {
            console.error('Failed to reserve seat:', error);
            setError('Failed to reserve seat. Please try again.');
            setSelectedSeat(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBookingFormClose = async () => {
        if (selectedSeat && screeningId) {
            try {
                await bookingService.releaseSeatReservation(Number(screeningId), selectedSeat.id);
            } catch (error) {
                console.error('Failed to release seat reservation:', error);
            }
        }
        setIsBookingFormOpen(false);
    };

    const handleBookingSubmit = async (data: BookingRequest) => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            if (!screeningId || !selectedSeat) return;

            const bookingData = {
                ...data,
                screeningId: Number(screeningId),
                seatId: selectedSeat.id
            };

            try {
                const response = await bookingService.createBooking(bookingData);
                if (response.data) {
                    setIsBookingFormOpen(false);
                    setError('');
                    navigate('/booking-confirmation', {
                        state: {
                            booking: response.data,
                            returnPath: `/movie/${movieId}/screenings`
                        }
                    });
                }
            } catch (error: any) {
                console.error('Booking error:', error);
                if (error.response) {
                    if (error.response.data.message?.includes('already has a pending booking')) {
                        setError('This seat is no longer available. Please select another seat.');
                        setSelectedSeat(null);
                        setIsBookingFormOpen(false);
                    } else {
                        setError(error.response.data.message || 'Failed to create booking. Please try again.');
                    }
                } else {
                    setError('Failed to create booking. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error in booking process:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add cleanup on unmount
    useEffect(() => {
        return () => {
            if (selectedSeat && screeningId && isBookingFormOpen) {
                bookingService.releaseSeatReservation(Number(screeningId), selectedSeat.id)
                    .catch(error => console.error('Failed to release seat on unmount:', error));
            }
        };
    }, [selectedSeat, screeningId, isBookingFormOpen]);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!movie || !screening) {
        return (
            <Container>
                <Alert severity="error">
                    Movie or screening not found. Please go back and try again.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4
            }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/movie/${movieId}/screenings`)}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        fontSize: '1rem',
                    }}
                >
                    Back to Screenings
                </Button>
            </Box>

            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                    fontWeight: 'bold',
                    mb: 1
                }}
            >
                {movie.title}
            </Typography>

            <Typography
                variant="h6"
                gutterBottom
                align="center"
                color="text.secondary"
                sx={{ mb: 4 }}
            >
                {new Date(screening.screeningTime).toLocaleString()}
            </Typography>

            <Box sx={{ my: 4 }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 3
                    }}
                >
                    Select Your Seat
                </Typography>

                <SeatMap
                    screeningId={Number(screeningId)}
                    selectedSeat={selectedSeat}
                    onSelectSeat={handleSeatSelect}
                />
            </Box>

            <Box sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                gap: 2
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!selectedSeat || isSubmitting}
                    onClick={handleContinueToBooking}
                    size="large"
                    startIcon={<ConfirmationNumberIcon />}
                    sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        },
                        transition: 'all 0.2s',
                    }}
                >
                    {isSubmitting ? 'Processing...' : 'Continue to Booking'}
                </Button>
            </Box>

            {selectedSeat && (
                <BookingForm
                    open={isBookingFormOpen}
                    onClose={handleBookingFormClose}
                    onSubmit={handleBookingSubmit}
                    screeningId={Number(screeningId)}
                    seatId={selectedSeat.id}
                />
            )}

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setError('')}
                    severity="error"
                    sx={{
                        width: '100%',
                        borderRadius: 2
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}; 
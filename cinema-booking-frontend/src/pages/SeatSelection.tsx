import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress, Alert, Snackbar, Paper, Chip, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { SeatMap } from '../components/SeatMap';
import { BookingForm } from '../components/BookingForm';
import { movieService, screeningService, bookingService } from '../services/api';
import { Movie, Seat, BookingRequest, Screening } from '../types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

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
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 6 }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/movie/${movieId}/screenings`)}
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        borderColor: '#ff6b00',
                        color: '#ff6b00',
                        '&:hover': {
                            borderColor: '#d95a00',
                            backgroundColor: 'rgba(255, 107, 0, 0.08)',
                        },
                    }}
                >
                    Quay lại
                </Button>

                {/* Movie Info Card */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                        border: '1px solid rgba(255, 107, 0, 0.1)',
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={3}>
                            {movie.imageUrl && (
                                <Box
                                    component="img"
                                    src={movie.imageUrl}
                                    alt={movie.title}
                                    sx={{
                                        width: '100%',
                                        maxWidth: 200,
                                        height: 'auto',
                                        borderRadius: 2,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        mx: 'auto',
                                        display: 'block',
                                    }}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Box>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        color: '#333',
                                        mb: 2,
                                    }}
                                >
                                    {movie.title}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                                    <Chip
                                        icon={<LocalActivityIcon />}
                                        label={movie.genre}
                                        sx={{
                                            backgroundColor: 'rgba(255, 107, 0, 0.1)',
                                            color: '#ff6b00',
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarTodayIcon sx={{ fontSize: 20, color: '#666' }} />
                                        <Typography variant="body1" color="text.secondary">
                                            {new Date(screening.screeningTime).toLocaleDateString('vi-VN', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon sx={{ fontSize: 20, color: '#666' }} />
                                        <Typography variant="body1" color="text.secondary">
                                            {new Date(screening.screeningTime).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ConfirmationNumberIcon sx={{ fontSize: 20, color: '#666' }} />
                                        <Typography variant="body1" color="text.secondary">
                                            Giá vé: {movie.ticketPrice?.toLocaleString('vi-VN')} VNĐ
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Seat Selection Title */}
                <Typography
                    variant="h5"
                    align="center"
                    sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: '#333',
                    }}
                >
                    Chọn Ghế Ngồi
                </Typography>

                {/* Seat Map */}
                <SeatMap
                    screeningId={Number(screeningId)}
                    selectedSeat={selectedSeat}
                    onSelectSeat={handleSeatSelect}
                />

                {/* Selected Seat Info & Action */}
                {selectedSeat && (
                    <Paper
                        elevation={3}
                        sx={{
                            mt: 4,
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)',
                            color: 'white',
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Thông tin ghế đã chọn
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Ghế
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {selectedSeat.seatRow}{selectedSeat.seatNumber}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Giá vé
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {movie.ticketPrice?.toLocaleString('vi-VN')} đ
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={isSubmitting}
                                    onClick={handleContinueToBooking}
                                    startIcon={<ConfirmationNumberIcon />}
                                    sx={{
                                        py: 1.8,
                                        backgroundColor: 'white',
                                        color: '#ff6b00',
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            transform: 'translateY(-2px)',
                                        },
                                        '&:disabled': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            color: 'rgba(255, 107, 0, 0.5)',
                                        },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    {isSubmitting ? 'Đang xử lý...' : 'Tiếp tục đặt vé'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {!selectedSeat && (
                    <Paper
                        elevation={1}
                        sx={{
                            mt: 4,
                            p: 3,
                            textAlign: 'center',
                            borderRadius: 3,
                            backgroundColor: '#f5f5f5',
                        }}
                    >
                        <Typography variant="body1" color="text.secondary">
                            Vui lòng chọn ghế để tiếp tục đặt vé
                        </Typography>
                    </Paper>
                )}

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
        </Box>
    );
}; 
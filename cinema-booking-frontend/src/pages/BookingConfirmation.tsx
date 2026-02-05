import React from 'react';
import { Container, Typography, Paper, Box, Button, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Booking } from '../types';

export const BookingConfirmation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking as Booking;

    if (!booking) {
        navigate('/');
        return null;
    }

    // Add null checks for nested objects
    if (!booking.screening || !booking.screening.movie || !booking.seat) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography color="error">
                        Booking information is incomplete. Please try again.
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/')}
                        >
                            Return to Home
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                    Booking Confirmed!
                </Typography>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Booking Details
                    </Typography>
                    <Typography>
                        <strong>Movie:</strong> {booking.screening.movie.title}
                    </Typography>
                    <Typography>
                        <strong>Seat:</strong> Row {booking.seat.seatRow}, Seat {booking.seat.seatNumber}
                    </Typography>
                    <Typography>
                        <strong>Show Time:</strong> {new Date(booking.screening.screeningTime).toLocaleString()}
                    </Typography>
                    <Typography>
                        <strong>Booking ID:</strong> {booking.id}
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Customer Information
                    </Typography>
                    <Typography>
                        <strong>Name:</strong> {booking.customerName}
                    </Typography>
                    <Typography>
                        <strong>Email:</strong> {booking.customerEmail}
                    </Typography>
                    <Typography>
                        <strong>Phone:</strong> {booking.customerPhone}
                    </Typography>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/booking-history')}
                    >
                        View My Bookings
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                    >
                        Book Another Ticket
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}; 
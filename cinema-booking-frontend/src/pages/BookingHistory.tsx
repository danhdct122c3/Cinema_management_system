import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    TextField,
    Card,
    CardContent,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../types';
import { bookingService, userService } from '../services/api';

export const BookingHistory: React.FC = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    useEffect(() => {
        const savedUserId = localStorage.getItem('userId');
        if (savedUserId) {
            setUserId(savedUserId);
            fetchBookings(savedUserId);
        }
    }, []);

    const fetchBookings = async (targetUserId: string) => {
        if (!targetUserId) {
            setError('Please enter your user ID');
            return;
        }
        try {
            setLoading(true);
            setError('');
            const response = await bookingService.getBookingsByUser(targetUserId);
            const result = response.data?.result || [];
            setBookings(result);
            if (result.length === 0) {
                setError('No bookings found for this user');
            }
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
            setError(error.response?.data?.message || 'Failed to fetch bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        await fetchBookings(userId);
    };

    const handleConfirmBooking = async () => {
        if (!selectedBookingId) return;

        try {
            setLoading(true);
            setError('');
            await bookingService.confirmBooking(selectedBookingId);
            setSuccess('Booking confirmed successfully!');

            // Refresh the bookings list
            await fetchBookings(userId);
        } catch (error: any) {
            console.error('Error confirming booking:', error);
            setError(error.response?.data?.message || 'Failed to confirm booking. Please try again.');
        } finally {
            setLoading(false);
            setConfirmDialogOpen(false);
            setSelectedBookingId(null);
        }
    };

    const handleCancelBooking = async () => {
        if (!selectedBookingId) return;

        try {
            setLoading(true);
            setError('');
            await bookingService.cancelBooking(selectedBookingId);
            setSuccess('Booking cancelled successfully! The seat is now available for booking.');

            // Refresh the bookings list
            await fetchBookings(userId);
        } catch (error: any) {
            console.error('Error cancelling booking:', error);
            setError(error.response?.data?.message || 'Failed to cancel booking. Please try again.');
        } finally {
            setLoading(false);
            setCancelDialogOpen(false);
            setSelectedBookingId(null);
        }
    };

    const openConfirmDialog = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setConfirmDialogOpen(true);
    };

    const openCancelDialog = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setCancelDialogOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Booking History
            </Typography>

            <Paper sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        fullWidth
                        label="Enter your user ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        error={!!error && !userId}
                        helperText={!userId && error ? 'User ID is required' : ''}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading || !userId}
                        sx={{ height: 56 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Search'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={async () => {
                            const response = await userService.getTestUserId();
                            const id = response.data.result;
                            setUserId(id);
                            localStorage.setItem('userId', id);
                        }}
                        disabled={loading}
                        sx={{ height: 56 }}
                    >
                        Use Test User
                    </Button>
                </Box>
            </Paper>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            <Grid container spacing={3}>
                {bookings.map((booking) => (
                    <Grid item xs={12} key={booking.bookingId}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        Booking #{booking.bookingId}
                                    </Typography>
                                    <Chip
                                        label={booking.status}
                                        color={getStatusColor(booking.status) as any}
                                    />
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography>
                                            <strong>Show Time ID:</strong> {booking.showTimeId}
                                        </Typography>
                                        <Typography>
                                            <strong>Seats:</strong> {booking.seatCodes?.join(', ') || 'N/A'}
                                        </Typography>
                                        <Typography>
                                            <strong>Booking Time:</strong> {new Date(booking.bookingTime).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography>
                                            <strong>User ID:</strong> {booking.userId}
                                        </Typography>
                                        <Typography>
                                            <strong>Total:</strong> ${booking.totalPrice?.toFixed(2) || '0.00'}
                                        </Typography>
                                        <Typography>
                                            <strong>Seat IDs:</strong> {booking.seatShowTimeIds?.join(', ') || 'N/A'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {booking.status === 'PENDING' && (
                                    <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => openConfirmDialog(booking.bookingId)}
                                            disabled={loading}
                                        >
                                            Confirm
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => openCancelDialog(booking.bookingId)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    disabled={loading}
                >
                    Back to Home
                </Button>
            </Box>

            {/* Confirm Dialog */}
            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Booking</DialogTitle>
                <DialogContent>
                    Are you sure you want to confirm this booking? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmBooking} color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Cancel Dialog */}
            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle>Cancel Booking</DialogTitle>
                <DialogContent>
                    Are you sure you want to cancel this booking? The seat will become available for others to book.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)} disabled={loading}>
                        No
                    </Button>
                    <Button onClick={handleCancelBooking} color="error" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Yes, Cancel'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!success}
                autoHideDuration={6000}
                onClose={() => setSuccess('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Container>
    );
}; 
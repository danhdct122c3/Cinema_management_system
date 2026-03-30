import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    CircularProgress,
    Alert,
    Grid,
    Divider,
    Card,
    CardContent,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { SeatShowTimeResponse, ShowTimeDetail, HoldSeatResponse } from '../types';
import { holdService, showtimeService, userService } from '../services/api';
import HoldCountdown from '../components/HoldCountdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export const BookingConfirmation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // State from navigation
    const selectedSeats = location.state?.selectedSeats as SeatShowTimeResponse[];
    const selectedSeatIds = location.state?.selectedSeatIds as string[];
    const totalPrice = location.state?.totalPrice as number;
    const showtimeId = location.state?.showtimeId as string;
    const movieId = location.state?.movieId as string;
    const showtime = location.state?.showtime as ShowTimeDetail;

    // Component state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [holdResponse, setHoldResponse] = useState<HoldSeatResponse | null>(null);
    const [holdStartTime, setHoldStartTime] = useState<number>(0);
    const [holdExpired, setHoldExpired] = useState(false);
    const [paymentInProgress, setPaymentInProgress] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [seatAlreadyHeld, setSeatAlreadyHeld] = useState(false);

    // Initialize and hold seats
    useEffect(() => {
        // Skip if already held or nothing to hold
        if (holdResponse || !selectedSeatIds || selectedSeatIds.length === 0) {
            return;
        }

        const initializeHold = async () => {
            try {
                // Get user ID from localStorage first, or from API test endpoint
                let userIdFromStorage = localStorage.getItem('userId') || '';
                
                if (!userIdFromStorage) {
                    // Fetch test user ID from backend
                    const testUserResponse = await userService.getTestUserId();
                    userIdFromStorage = testUserResponse.data.result;
                }

                if (!userIdFromStorage) {
                    setError('User information not found. Please log in again.');
                    setLoading(false);
                    return;
                }

                setUserId(userIdFromStorage);

                // Validate inputs
                if (!showtimeId) {
                    setError('Missing showtime information');
                    setLoading(false);
                    return;
                }

                // Call hold API with 5 minutes default hold duration
                const response = await holdService.holdSeats({
                    seatShowTimeIds: selectedSeatIds,
                    showTimeId: showtimeId,
                    userId: userIdFromStorage,
                    holdDuration: 5, // 5 minutes
                });

                if (response.data.result) {
                    setHoldResponse(response.data.result);
                    setHoldStartTime(Date.now());
                    setLoading(false);
                } else {
                    setError(response.data.message || 'Failed to hold seats');
                    setLoading(false);
                }
            } catch (err: any) {
                console.error('Error holding seats:', err);

                // Extract error message from backend response
                const errorMessage = err.response?.data?.message || err.message || 'Failed to hold seats';
                
                // If the error is about seats already being held, suppress it and redirect back
                // The user will see the updated seat status in real-time
                if (errorMessage.toLowerCase().includes('already held')) {
                    console.warn('Seat already held - redirecting to seat selection');
                    setError(''); // Clear error
                    setSeatAlreadyHeld(true);
                    setLoading(false);
                    return;
                }
                
                setError(errorMessage);
                setLoading(false);
            }
        };

        initializeHold();
    }, [selectedSeatIds, showtimeId]);

    // Handle hold expiration
    const handleHoldExpired = async () => {
        setHoldExpired(true);
        setError('Your seat hold has expired. Please select seats again.');

        // Release the hold
        if (selectedSeatIds) {
            try {
                await holdService.releaseHold(selectedSeatIds);
            } catch (err) {
                console.error('Error releasing hold:', err);
            }
        }

        // Redirect after 3 seconds
        setTimeout(() => {
            navigate(`/seat-selection/${movieId}/${showtimeId}`);
        }, 3000);
    };

    // Handle payment (placeholder for now)
    const handlePayment = async () => {
        try {
            setPaymentInProgress(true);

            // Validate hold is still valid
            if (selectedSeatIds && selectedSeatIds.length > 0) {
                const isValid = await holdService.isHoldValid(selectedSeatIds[0]);
                if (!isValid.data.result) {
                    setError('Hold has expired. Please select seats again.');
                    setHoldExpired(true);
                    return;
                }
            }

            // TODO: Integrate with payment gateway here
            // This will be handled by the payment team
            console.log('Processing payment for seats:', selectedSeats);
            console.log('Total price:', totalPrice);

            // Placeholder: show success message
            alert('Payment functionality will be integrated by the payment team');
            setPaymentInProgress(false);
        } catch (err) {
            console.error('Error during payment:', err);
            setError('Payment failed. Please try again.');
            setPaymentInProgress(false);
        }
    };

    // Handle release hold manually
    const handleReleaseHold = async () => {
        try {
            if (selectedSeatIds) {
                await holdService.releaseHold(selectedSeatIds);
                navigate(`/seat-selection/${movieId}/${showtimeId}`);
            }
        } catch (err) {
            console.error('Error releasing hold:', err);
            setError('Failed to release hold. Please try again.');
        }
    };

    // Auto-redirect when seat is already held
    useEffect(() => {
        if (seatAlreadyHeld) {
            const timer = setTimeout(() => {
                navigate(`/seat-selection/${movieId}/${showtimeId}`);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [seatAlreadyHeld, movieId, showtimeId, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Handle case where seat is already held by another user
    if (seatAlreadyHeld) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <ErrorIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
                    <Typography variant="h5" color="warning" gutterBottom>
                        Seat No Longer Available
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        This seat has been held by another user. Please select different seats.
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 4, display: 'block', color: '#999' }}>
                        Redirecting...
                    </Typography>
                </Box>
            </Container>
        );
    }

    // If we have error and no holdResponse, show error page instead of main page
    if (error && !holdResponse) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Alert severity="error">
                        {error || 'Failed to hold seats. Please try again.'}
                    </Alert>
                    <Box sx={{ mt: 4 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleReleaseHold}
                        >
                            Back to Seat Selection
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    if (error && holdExpired) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                    <Typography variant="h5" color="error" gutterBottom>
                        Hold Expired
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 4, display: 'block', color: '#999' }}>
                        Redirecting to seat selection...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (!selectedSeats || selectedSeats.length === 0 || !holdResponse) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Alert severity="error">
                        {error || 'Failed to hold seats. Please try again.'}
                    </Alert>
                    <Box sx={{ mt: 4 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleReleaseHold}
                        >
                            Back to Seat Selection
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleReleaseHold}
                    sx={{ mb: 3 }}
                >
                    Back to Seat Selection
                </Button>

                {/* Hold Countdown Timer */}
                {!holdExpired && (
                    <HoldCountdown
                        totalSeconds={holdResponse.holdDurationSeconds}
                        onExpire={handleHoldExpired}
                        holdStartTime={holdStartTime}
                    />
                )}

                {/* Success Alert for Hold */}
                {!error && !holdExpired && !seatAlreadyHeld && (
                    <Alert
                        severity="success"
                        icon={<CheckCircleIcon />}
                        sx={{ mb: 3 }}
                    >
                        ✅ Ghế đã được giữ thành công! Vui lòng hoàn tất thanh toán trong thời gian giữ.
                    </Alert>
                )}

                {/* Movie & Showtime Info */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {showtime?.movie?.title || 'Movie'}
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Showtime
                                </Typography>
                                <Typography variant="body2">
                                    {showtime ? new Date(showtime.startTime).toLocaleString() : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Room
                                </Typography>
                                <Typography variant="body2">
                                    {showtime?.room?.roomName || 'N/A'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Selected Seats Summary */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Selected Seats ({selectedSeats.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {selectedSeats.map(seat => (
                                <Box
                                    key={seat.id}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        bgcolor: '#e3f2fd',
                                        border: '1px solid #2196f3',
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography variant="body2" fontWeight="bold">
                                        {seat.seatCode}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ${seat.price.toFixed(2)} ({seat.seatType})
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>

                {/* Price Summary */}
                <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff8f0', border: '2px solid #ff6b00' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography color="text.secondary">Subtotal ({selectedSeats.length} seats)</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography>${totalPrice.toFixed(2)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="text.secondary">Service Fee</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography>$0.00</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6" fontWeight="bold">
                                Total
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" fontWeight="bold" color="error">
                                ${totalPrice.toFixed(2)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handlePayment}
                        disabled={paymentInProgress || holdExpired}
                        sx={{
                            bgcolor: '#ff6b00',
                            '&:hover': { bgcolor: '#e55a00' },
                        }}
                    >
                        {paymentInProgress ? <CircularProgress size={24} /> : 'Proceed to Payment'}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        onClick={handleReleaseHold}
                        disabled={holdExpired}
                    >
                        Cancel & Release Hold
                    </Button>
                </Box>

                {/* Info Box */}
                <Paper sx={{ mt: 3, p: 2, bgcolor: '#e8f5e9', border: '1px solid #81c784' }}>
                    <Typography variant="caption" color="text.secondary">
                        💡 <strong>Note:</strong> Your seats will be held for 5 minutes. After that, they will be released and available for other customers to book.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}; 
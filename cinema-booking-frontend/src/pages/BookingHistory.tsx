import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Grid,
    Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { bookingService, showtimeService } from '../services/api';

interface BookingView extends Booking {
    room_name?: string;
}

interface ShowtimeDisplayInfo {
    roomName: string;
    displayTime: string;
}

export const BookingHistory: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [userId, setUserId] = useState('');
    const [bookings, setBookings] = useState<BookingView[]>([]);
    const [showtimeInfoById, setShowtimeInfoById] = useState<Record<string, ShowtimeDisplayInfo>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const enrichRoomsFromShowtimes = async (bookingList: BookingView[]) => {
        const uniqueShowtimeIds = Array.from(
            new Set(bookingList.map((b) => b.showTimeId).filter(Boolean))
        );

        if (uniqueShowtimeIds.length === 0) {
            setShowtimeInfoById({});
            return;
        }

        const responses = await Promise.allSettled(
            uniqueShowtimeIds.map((id) => showtimeService.getShowtimeById(id))
        );

        const mapping: Record<string, ShowtimeDisplayInfo> = {};
        responses.forEach((result, index) => {
            const showtimeId = uniqueShowtimeIds[index];
            if (result.status === 'fulfilled') {
                const detail = result.value.data?.result;
                const startTime = detail?.startTime ? new Date(detail.startTime) : null;
                const endTime = detail?.endTime ? new Date(detail.endTime) : null;
                const displayTime = startTime && !Number.isNaN(startTime.getTime())
                    ? `${startTime.toLocaleDateString('vi-VN')} ${startTime.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}${endTime && !Number.isNaN(endTime.getTime())
                        ? ` - ${endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
                        : ''}`
                    : 'N/A';

                mapping[showtimeId] = {
                    roomName: detail?.roomName || 'N/A',
                    displayTime,
                };
            } else {
                mapping[showtimeId] = {
                    roomName: 'N/A',
                    displayTime: 'N/A',
                };
            }
        });

        setShowtimeInfoById(mapping);
    };

    const getStoredUserId = () => {
        const directUserId = localStorage.getItem('userId');
        if (directUserId) return directUserId;

        const rawUser = localStorage.getItem('user');
        if (!rawUser) return '';

        try {
            const parsed = JSON.parse(rawUser);
            return parsed?.id || parsed?.userId || '';
        } catch {
            return '';
        }
    };

    useEffect(() => {
        const loadBookingsForCurrentUser = async () => {
            if (!isLoggedIn) return;

            try {
                setLoading(true);
                setError('');

                const response = await bookingService.getMyBookings();
                const result = (response.data?.result || []) as BookingView[];
                setBookings(result);
                await enrichRoomsFromShowtimes(result);

                const storedUserId = getStoredUserId();
                setUserId(storedUserId);

                if (result.length === 0) {
                    setError('Không có booking nào cho tài khoản hiện tại.');
                }
            } catch (error: any) {
                // Legacy fallback when BE has not exposed /bookings/me yet
                const fallbackUserId = getStoredUserId();
                if (!fallbackUserId) {
                    setError('Không lấy được userId. Vui lòng đăng nhập lại.');
                    return;
                }

                setUserId(fallbackUserId);
                await fetchBookings(fallbackUserId);
            } finally {
                setLoading(false);
            }
        };

        loadBookingsForCurrentUser();
    }, [isLoggedIn]);

    const fetchBookings = async (targetUserId: string) => {
        // Legacy fallback when BE still supports /bookings/user/{userId}
        if (!targetUserId) {
            setError('Không tìm thấy userId hợp lệ.');
            return;
        }
        try {
            setLoading(true);
            setError('');
            const response = await bookingService.getBookingsByUser(targetUserId);
            const result = (response.data?.result || []) as BookingView[];
            setBookings(result);
            await enrichRoomsFromShowtimes(result);
            if (result.length === 0) {
                setError('Không có booking nào cho tài khoản hiện tại.');
            }
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
            setError(error.response?.data?.message || 'Không thể tải danh sách booking. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
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
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 800, mb: 3 }}>
                Booking History
            </Typography>

            <Box
                sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.08)',
                    backgroundColor: 'background.paper',
                }}
            >

                <Button
                    variant="contained"
                    onClick={async () => {
                        try {
                            setLoading(true);
                            setError('');
                            const response = await bookingService.getMyBookings();
                            const result = (response.data?.result || []) as BookingView[];
                            setBookings(result);
                            await enrichRoomsFromShowtimes(result);
                            if (result.length === 0) {
                                setError('Không có booking nào cho tài khoản hiện tại.');
                            }
                        } catch {
                            await fetchBookings(userId);
                        } finally {
                            setLoading(false);
                        }
                    }}
                    disabled={loading || (!userId && !isLoggedIn)}
                    sx={{ px: 3, borderRadius: 2, fontWeight: 700 }}
                >
                    Làm mới
                </Button>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            <Grid container spacing={3}>
                {bookings.map((booking) => (
                    <Grid item xs={12} key={booking.bookingId}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid rgba(0,0,0,0.08)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        Booking #{booking.bookingId}
                                    </Typography>
                                   
                                    <Chip
                                        label={booking.status}
                                        color={getStatusColor(booking.status) as any}
                                        sx={{ fontWeight: 700 }}
                                    />
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography>
                                            <strong>Showtime:</strong> {showtimeInfoById[booking.showTimeId]?.displayTime || 'N/A'}
                                        </Typography>
                                        <Typography>
                                            <strong>Room:</strong> {showtimeInfoById[booking.showTimeId]?.roomName || booking.room_name || 'N/A'}
                                        </Typography>
                                        <Typography>
                                            <strong>Total:</strong> {booking.totalPrice?.toLocaleString('vi-VN') || '0'} đ
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                         <Typography>
                                            <strong>Booking Time:</strong> {new Date(booking.bookingTime).toLocaleString()}
                                    </Typography>
                                        <Typography>
                                            <strong>Seats:</strong> {booking.seatCodes?.join(', ') || 'N/A'}
                                        </Typography>
                                        
                                    </Grid>
                                </Grid>
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
        </Container>
    );
};

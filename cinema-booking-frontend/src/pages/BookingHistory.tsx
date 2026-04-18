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
    Pagination,
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
    const [page, setPage] = useState(1);
    const pageSize = 5;

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
                    roomName: detail?.roomName || 'Không có',
                    displayTime,
                };
            } else {
                mapping[showtimeId] = {
                    roomName: 'Không có',
                    displayTime: 'Không có',
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

    const sortedBookings = [...bookings].sort((a, b) => {
        const timeA = new Date(a.bookingTime).getTime();
        const timeB = new Date(b.bookingTime).getTime();
        return timeB - timeA;
    });

    const totalPages = Math.max(1, Math.ceil(sortedBookings.length / pageSize));
    const paginatedBookings = sortedBookings.slice((page - 1) * pageSize, page * pageSize);

    useEffect(() => {
        setPage(1);
    }, [bookings.length]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 800, mb: 3 }}>
                Lịch Sử Đặt Vé
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
                {paginatedBookings.map((booking) => (
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
                                        Đơn Đặt Vé #{booking.bookingId}
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
                                            <strong>Suất chiếu:</strong> {showtimeInfoById[booking.showTimeId]?.displayTime || 'Không có'}
                                        </Typography>
                                        <Typography>
                                            <strong>Phòng chiếu:</strong> {showtimeInfoById[booking.showTimeId]?.roomName || booking.room_name || 'Không có'}
                                        </Typography>
                                        <Typography>
                                            <strong>Tổng tiền:</strong> {booking.totalPrice?.toLocaleString('vi-VN') || '0'} đ
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                         <Typography>
                                            <strong>Thời gian đặt:</strong> {new Date(booking.bookingTime).toLocaleString()}
                                    </Typography>
                                        <Typography>
                                            <strong>Ghế:</strong> {booking.seatCodes?.join(', ') || 'Không có'}
                                        </Typography>
                                        
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {sortedBookings.length > pageSize && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        page={page}
                        count={totalPages}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    disabled={loading}
                >
                    Về Trang Chủ
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

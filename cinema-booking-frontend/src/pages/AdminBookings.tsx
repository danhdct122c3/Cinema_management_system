import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    TextField,
    MenuItem,
    IconButton,
    Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { adminBookingService } from '../services/adminApi';
import { Booking } from '../types';

export const AdminBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            // TODO: Implement getAll endpoint in backend
            // For now, using temporary user scope endpoint
            const response = await adminBookingService.getBookingsByUser('admin@example.com');
            setBookings(response.data.result);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return { bg: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' };
            case 'PENDING':
                return { bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' };
            case 'CANCELLED':
                return { bg: 'rgba(244, 67, 54, 0.1)', color: '#f44336' };
            default:
                return { bg: 'rgba(0, 0, 0, 0.1)', color: '#666' };
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'Đã Xác Nhận';
            case 'PENDING':
                return 'Chờ Xử Lý';
            case 'CANCELLED':
                return 'Đã Hủy';
            default:
                return status;
        }
    };

    const handleCancelBooking = async (id: string) => {
        try {
            setLoading(true);
            await adminBookingService.cancelBooking(id);
            await fetchBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async (id: string) => {
        try {
            setLoading(true);
            await adminBookingService.confirmBooking(id);
            await fetchBookings();
        } catch (error) {
            console.error('Error confirming booking:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        const matchesSearch =
            searchQuery === '' ||
            booking.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.bookingId.includes(searchQuery);
        return matchesStatus && matchesSearch;
    });

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
                Quản Lý Đặt Vé
            </Typography>

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    label="Tìm kiếm"
                    placeholder="Tìm theo mã đặt vé hoặc User ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: 300 }}
                    size="small"
                />
                <TextField
                    select
                    label="Trạng Thái"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{ width: 200 }}
                    size="small"
                >
                    <MenuItem value="all">Tất Cả</MenuItem>
                    <MenuItem value="CONFIRMED">Đã Xác Nhận</MenuItem>
                    <MenuItem value="PENDING">Chờ Xử Lý</MenuItem>
                    <MenuItem value="CANCELLED">Đã Hủy</MenuItem>
                </TextField>
            </Box>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                            <TableCell sx={{ fontWeight: 700 }}>Mã Đặt Vé</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>User ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Suất Chiếu</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Số Ghế</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Thời Gian Đặt</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                                Thao Tác
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBookings.map((booking) => {
                            const statusStyle = getStatusColor(booking.status);
                            return (
                                <TableRow
                                    key={booking.bookingId}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                        },
                                    }}
                                >
                                    <TableCell>
                                        <Typography fontWeight={600}>#{booking.bookingId}</Typography>
                                    </TableCell>
                                    <TableCell>{booking.userId}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`Suất #${booking.showTimeId}`}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                color: '#2196f3',
                                                fontWeight: 600,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{booking.seatCodes?.join(', ') || 'N/A'}</TableCell>
                                    <TableCell>
                                        {new Date(booking.bookingTime).toLocaleString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStatusLabel(booking.status)}
                                            size="small"
                                            sx={{
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.color,
                                                fontWeight: 600,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Xem Chi Tiết">
                                            <IconButton size="small" sx={{ color: '#2196f3' }}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {booking.status === 'PENDING' && (
                                            <>
                                                <Tooltip title="Xác Nhận">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleConfirmBooking(booking.bookingId)}
                                                        sx={{ color: '#4caf50' }}
                                                        disabled={loading}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Hủy Đặt Vé">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleCancelBooking(booking.bookingId)}
                                                        sx={{ color: '#f44336' }}
                                                        disabled={loading}
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredBookings.length === 0 && (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        color: 'text.secondary',
                    }}
                >
                    <Typography variant="h6">Không có dữ liệu</Typography>
                </Box>
            )}
        </Box>
    );
};

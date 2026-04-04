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

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            // TODO: Implement getAll endpoint in backend
            // For now, using mock data or fetching by email
            const response = await adminBookingService.getBookingsByEmail('admin@example.com');
            setBookings(response.data.result);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // Set mock data for demonstration
            setBookings([]);
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

    const handleCancelBooking = (id: string) => {
        // TODO: Implement cancel booking API call
        console.log('Cancelling booking:', id);
        // fetchBookings(); // Refresh list after cancel
    };

    const handleConfirmBooking = (id: string) => {
        // TODO: Implement confirm booking API call
        console.log('Confirming booking:', id);
        // fetchBookings(); // Refresh list after confirm
    };

    const filteredBookings = bookings.filter((booking) => {
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        const matchesSearch =
            searchQuery === '' ||
            booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.id.includes(searchQuery);
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
                    placeholder="Tìm theo ID hoặc Email"
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
                            <TableCell sx={{ fontWeight: 700 }}>Email Khách Hàng</TableCell>
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
                                    key={booking.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                        },
                                    }}
                                >
                                    <TableCell>
                                        <Typography fontWeight={600}>#{booking.id}</Typography>
                                    </TableCell>
                                    <TableCell>{booking.customerEmail}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`Suất #${booking.screening.id}`}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                color: '#2196f3',
                                                fontWeight: 600,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>1 ghế</TableCell>
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
                                                        onClick={() => handleConfirmBooking(booking.id)}
                                                        sx={{ color: '#4caf50' }}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Hủy Đặt Vé">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        sx={{ color: '#f44336' }}
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

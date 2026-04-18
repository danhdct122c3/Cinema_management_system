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
    Tooltip,
    TablePagination,
} from '@mui/material';
import { adminBookingService, adminShowtimeService, adminUserService } from '../services/adminApi';
import { Booking, ShowTimeResponse } from '../types';

export const AdminBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [showtimeMap, setShowtimeMap] = useState<Record<string, ShowTimeResponse>>({});
    const [userEmailMap, setUserEmailMap] = useState<Record<string, string>>({});
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const [bookingResponse, showtimeResponse, usersResponse] = await Promise.all([
                adminBookingService.getAllBooking(),
                adminShowtimeService.getAllShowtimes(),
                adminUserService.getAllUsers(),
            ]);

            setBookings(bookingResponse.data.result);

            const nextShowtimeMap = showtimeResponse.data.result.reduce<Record<string, ShowTimeResponse>>(
                (acc, showtime) => {
                    acc[showtime.id] = showtime;
                    return acc;
                },
                {}
            );

            const nextUserEmailMap = usersResponse.data.result.reduce<Record<string, string>>((acc, user) => {
                acc[user.id] = user.email;
                return acc;
            }, {});

            setShowtimeMap(nextShowtimeMap);
            setUserEmailMap(nextUserEmailMap);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookings([]);
            setShowtimeMap({});
            setUserEmailMap({});
        } finally {
            setLoading(false);
        }
    };

    const getShowtimeLabel = (showTimeId: string) => {
        const showtime = showtimeMap[showTimeId];
        if (!showtime?.startTime) return `Suất #${showTimeId}`;

        const formattedTime = new Date(showtime.startTime).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        return formattedTime;
    };

    const getRoomLabel = (showTimeId: string) => {
        return showtimeMap[showTimeId]?.roomName || 'N/A';
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

    const filteredBookings = bookings
        .filter((booking) => {
            const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
            const displayUserEmail = userEmailMap[booking.userId] || booking.userId;
            const matchesSearch =
                searchQuery === '' ||
                displayUserEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.bookingId.includes(searchQuery);
            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            const timeA = new Date(a.bookingTime).getTime();
            const timeB = new Date(b.bookingTime).getTime();
            return timeB - timeA;
        });

    const paginatedBookings = filteredBookings.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const truncateId = (value: string, start = 8, end = 6) => {
        if (value.length <= start + end + 3) return value;
        return `${value.slice(0, start)}...${value.slice(-end)}`;
    };

    const toggleRowExpanded = (bookingId: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [bookingId]: !prev[bookingId],
        }));
    };

    useEffect(() => {
        setPage(0);
    }, [filterStatus, searchQuery, rowsPerPage]);

    useEffect(() => {
        const maxPage = Math.max(0, Math.ceil(filteredBookings.length / rowsPerPage) - 1);
        if (page > maxPage) {
            setPage(maxPage);
        }
    }, [filteredBookings.length, rowsPerPage, page]);

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
                Quản Lý Đặt Vé
            </Typography>

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    label="Tìm kiếm"
                    placeholder="Tìm theo mã đặt vé hoặc email"
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
                            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Suất Chiếu</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Phòng Chiếu</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Số Ghế</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Thời Gian Đặt</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedBookings.map((booking) => {
                            const statusStyle = getStatusColor(booking.status);
                            const isExpanded = !!expandedRows[booking.bookingId];
                            const displayUserEmail = userEmailMap[booking.userId] || booking.userId;
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
                                        <Tooltip title={booking.bookingId} arrow>
                                            <Typography fontWeight={600}>
                                                #{isExpanded ? booking.bookingId : truncateId(booking.bookingId)}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={displayUserEmail} arrow>
                                            <Typography>
                                                {isExpanded
                                                    ? displayUserEmail
                                                    : truncateId(displayUserEmail)}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                            {getShowtimeLabel(booking.showTimeId)}
                                    </TableCell>
                                    <TableCell>{getRoomLabel(booking.showTimeId)}</TableCell>
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

                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredBookings.length > 0 && (
                <TablePagination
                    component="div"
                    count={filteredBookings.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 20]}
                    labelRowsPerPage="Số dòng mỗi trang"
                />
            )}

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

import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Button,
    ButtonGroup,
    Stack,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { adminBookingService, adminMovieService, adminShowtimeService } from '../services/adminApi';
import { Booking, Movie, ShowTimeResponse } from '../types';

interface StatCard {
    title: string;
    value: string | number;
    icon: JSX.Element;
    color: string;
    bgColor: string;
}

type RevenueFilter = 'DAY' | 'WEEK' | 'MOVIE';

interface RevenueRow {
    dimension: string;
    showtimeId: string;
    ticketsSold: number;
    revenue: number;
}

export const AdminDashboard: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [showtimes, setShowtimes] = useState<ShowTimeResponse[]>([]);
    const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>('DAY');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moviesResponse, bookingsResponse, showtimesResponse] = await Promise.all([
                    adminMovieService.getAllMovies(),
                    adminBookingService.getAllBooking(),
                    adminShowtimeService.getAllShowtimes(),
                ]);

                setMovies(moviesResponse.data.result ?? []);
                setBookings(bookingsResponse.data.result ?? []);
                setShowtimes(showtimesResponse.data.result ?? []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    const getTicketCount = (booking: Booking) => {
        if (booking.seatCodes?.length) return booking.seatCodes.length;
        if (booking.seatShowTimeIds?.length) return booking.seatShowTimeIds.length;
        return 0;
    };

    const isSameDay = (dateA: Date, dateB: Date) =>
        dateA.getFullYear() === dateB.getFullYear()
        && dateA.getMonth() === dateB.getMonth()
        && dateA.getDate() === dateB.getDate();

    const getWeekInfo = (date: Date) => {
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = utcDate.getUTCDay() || 7;
        utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return {
            label: `Tuần ${weekNo}/${utcDate.getUTCFullYear()}`,
            sortKey: utcDate.getUTCFullYear() * 100 + weekNo,
        };
    };

    const confirmedBookings = useMemo(
        () => bookings.filter((booking) => booking.status === 'CONFIRMED'),
        [bookings]
    );

    const today = new Date();
    const todayShowtimes = showtimes.filter((showtime) => {
        const start = new Date(showtime.startTime);
        return !Number.isNaN(start.getTime()) && isSameDay(start, today) && showtime.status === 'ACTIVE';
    });

    const totalTickets = confirmedBookings.reduce((sum, booking) => sum + getTicketCount(booking), 0);
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

    const revenueDataByFilter = useMemo(() => {
        const movieMap = new Map(movies.map((movie) => [movie.id, movie.title]));
        const showtimeMovieTitleMap = new Map(
            showtimes.map((showtime) => [showtime.id, movieMap.get(showtime.movieId) || `Phim #${showtime.movieId}`])
        );

        type Bucket = {
            dimension: string;
            showtimeId: string;
            ticketsSold: number;
            revenue: number;
            sortKey: number;
        };

        const dayBuckets = new Map<string, Bucket>();
        const weekBuckets = new Map<string, Bucket>();
        const movieBuckets = new Map<string, Bucket>();

        confirmedBookings.forEach((booking) => {
            const bookingDate = new Date(booking.bookingTime);
            if (Number.isNaN(bookingDate.getTime())) return;

            const ticketCount = getTicketCount(booking);
            const revenue = booking.totalPrice || 0;
            const showTimeId = booking.showTimeId || 'N/A';

            const dayLabel = bookingDate.toLocaleDateString('vi-VN');
            const daySortKey = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()).getTime();
            const dayKey = `${dayLabel}__${showTimeId}`;
            const day = dayBuckets.get(dayKey) || {
                dimension: dayLabel,
                showtimeId: showTimeId,
                ticketsSold: 0,
                revenue: 0,
                sortKey: daySortKey,
            };
            day.ticketsSold += ticketCount;
            day.revenue += revenue;
            dayBuckets.set(dayKey, day);

            const weekInfo = getWeekInfo(bookingDate);
            const weekKey = `${weekInfo.label}__${showTimeId}`;
            const week = weekBuckets.get(weekKey) || {
                dimension: weekInfo.label,
                showtimeId: showTimeId,
                ticketsSold: 0,
                revenue: 0,
                sortKey: weekInfo.sortKey,
            };
            week.ticketsSold += ticketCount;
            week.revenue += revenue;
            weekBuckets.set(weekKey, week);

            const movieLabel = showtimeMovieTitleMap.get(showTimeId) || `Phim #${showTimeId}`;
            const movieKey = `${movieLabel}__${showTimeId}`;
            const movie = movieBuckets.get(movieKey) || {
                dimension: movieLabel,
                showtimeId: showTimeId,
                ticketsSold: 0,
                revenue: 0,
                sortKey: 0,
            };
            movie.ticketsSold += ticketCount;
            movie.revenue += revenue;
            movieBuckets.set(movieKey, movie);
        });

        const toRows = (buckets: Map<string, Bucket>, sortByRevenue = false): RevenueRow[] => {
            const rows: Array<RevenueRow & { sortKey: number }> = Array.from(buckets.values()).map((bucket) => ({
                dimension: bucket.dimension,
                showtimeId: bucket.showtimeId,
                ticketsSold: bucket.ticketsSold,
                revenue: bucket.revenue,
                sortKey: bucket.sortKey,
            }));

            if (sortByRevenue) {
                rows.sort((a, b) => b.revenue - a.revenue);
            } else {
                rows.sort((a, b) => b.sortKey - a.sortKey);
            }

            return rows.map(({ sortKey, ...row }) => row);
        };

        return {
            DAY: toRows(dayBuckets),
            WEEK: toRows(weekBuckets),
            MOVIE: toRows(movieBuckets, true),
        };
    }, [confirmedBookings, movies, showtimes]);

    const formatCurrency = (value: number) =>
        value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

    const stats: StatCard[] = [
        {
            title: 'Tổng Số Phim',
            value: movies.length,
            icon: <MovieIcon sx={{ fontSize: 40 }} />,
            color: '#ff6b00',
            bgColor: 'rgba(255, 107, 0, 0.1)',
        },
        {
            title: 'Suất Chiếu Hôm Nay',
            value: todayShowtimes.length,
            icon: <EventIcon sx={{ fontSize: 40 }} />,
            color: '#2196f3',
            bgColor: 'rgba(33, 150, 243, 0.1)',
        },
        {
            title: 'Vé Đã Đặt',
            value: totalTickets,
            icon: <ConfirmationNumberIcon sx={{ fontSize: 40 }} />,
            color: '#4caf50',
            bgColor: 'rgba(76, 175, 80, 0.1)',
        },
        {
            title: 'Tổng doanh thu',
            value: formatCurrency(totalRevenue),
            icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            color: '#ffc107',
            bgColor: 'rgba(255, 193, 7, 0.1)',
        },
    ];

    const revenueRows = revenueDataByFilter[revenueFilter];

    const revenueDimensionLabel: Record<RevenueFilter, string> = {
        DAY: 'Ngày',
        WEEK: 'Tuần',
        MOVIE: 'Phim',
    };

    return (
        <Box sx={{ pb: 2 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: 0.2 }}>
                    Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Tổng quan hoạt động rạp phim theo thời gian thực
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                background: 'linear-gradient(180deg, #fff 0%, #fff8f2 100%)',
                                transition: 'all 0.25s ease',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 10px 26px rgba(0,0,0,0.10)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {stat.title}
                                        </Typography>
                                        <Typography variant="h4" fontWeight={800} sx={{ mt: 1, fontSize: { xs: '1.7rem', md: '2rem' } }}>
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            backgroundColor: stat.bgColor,
                                            color: stat.color,
                                            borderRadius: 3,
                                            p: 1.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            background: '#fff',
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            justifyContent="space-between"
                            spacing={1.5}
                            sx={{ mb: 2 }}
                        >
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Doanh Thu
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Theo dõi doanh thu theo ngày, tuần hoặc phim
                                </Typography>
                            </Box>
                            <Chip
                                label={`Bộ lọc hiện tại: ${revenueDimensionLabel[revenueFilter]}`}
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: 'rgba(255, 107, 0, 0.12)',
                                    color: '#ff6b00',
                                }}
                            />
                        </Stack>

                        <Box sx={{ mb: 2 }}>
                            <ButtonGroup
                                variant="outlined"
                                size="medium"
                                aria-label="revenue filter"
                                sx={{
                                    '& .MuiButton-root': {
                                        px: 3,
                                        py: 0.9,
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        textTransform: 'none',
                                        borderColor: 'rgba(255, 107, 0, 0.4)',
                                        color: '#ff6b00',
                                    },
                                    '& .MuiButton-contained': {
                                        background: 'linear-gradient(90deg, #ff6b00 0%, #ff8c3a 100%)',
                                        color: '#fff',
                                        borderColor: 'transparent',
                                        boxShadow: '0 4px 14px rgba(255, 107, 0, 0.35)',
                                    },
                                }}
                            >
                                <Button
                                    variant={revenueFilter === 'DAY' ? 'contained' : 'outlined'}
                                    onClick={() => setRevenueFilter('DAY')}
                                >
                                    Ngày
                                </Button>
                                <Button
                                    variant={revenueFilter === 'WEEK' ? 'contained' : 'outlined'}
                                    onClick={() => setRevenueFilter('WEEK')}
                                >
                                    Tuần
                                </Button>
                                <Button
                                    variant={revenueFilter === 'MOVIE' ? 'contained' : 'outlined'}
                                    onClick={() => setRevenueFilter('MOVIE')}
                                >
                                    Phim
                                </Button>
                            </ButtonGroup>
                        </Box>

                        <TableContainer sx={{ maxHeight: 330, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3 }}>
                            <Table size="small" stickyHeader sx={{ tableLayout: 'fixed' }}>
                                <TableHead>
                                    <TableRow sx={{ '& .MuiTableCell-root': { backgroundColor: '#f7f8fa' } }}>
                                        <TableCell sx={{ width: '30%', fontWeight: 800, fontSize: '0.92rem' }}>{revenueDimensionLabel[revenueFilter]}</TableCell>
                                        <TableCell sx={{ width: '38%', fontWeight: 800, fontSize: '0.92rem' }}>Mã suất chiếu</TableCell>
                                        <TableCell sx={{ width: '14%', fontWeight: 800, fontSize: '0.92rem' }} align="right">Vé đã bán</TableCell>
                                        <TableCell sx={{ width: '18%', fontWeight: 800, fontSize: '0.92rem' }} align="right">Doanh thu</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {revenueRows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                                Chưa có dữ liệu từ database
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {revenueRows.map((row) => (
                                        <TableRow
                                            key={`${revenueFilter}-${row.dimension}-${row.showtimeId}`}
                                            hover
                                            sx={{
                                                '&:nth-of-type(even)': { backgroundColor: 'rgba(0,0,0,0.01)' },
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    width: '30%',
                                                    fontWeight: 600,
                                                    fontSize: '0.95rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                                title={row.dimension}
                                            >
                                                {row.dimension}
                                            </TableCell>
                                            <TableCell sx={{ width: '38%', fontSize: '0.95rem', fontFamily: 'monospace' }}>{row.showtimeId}</TableCell>
                                            <TableCell align="right" sx={{ width: '14%', fontSize: '0.95rem' }}>{row.ticketsSold}</TableCell>
                                            <TableCell align="right" sx={{ width: '18%', fontWeight: 700, color: '#1b5e20', fontSize: '0.95rem' }}>
                                                {formatCurrency(row.revenue)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

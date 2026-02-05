import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Paper, useTheme } from '@mui/material';
import { Seat } from '../types';
import { bookingService, screeningService } from '../services/api';

export interface SeatMapProps {
    screeningId: number;
    onSelectSeat: (seat: Seat | null) => void;
    selectedSeat: Seat | null;
}

export const SeatMap: React.FC<SeatMapProps> = ({ screeningId, onSelectSeat, selectedSeat }) => {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    // Group seats by row
    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.seatRow]) {
            acc[seat.seatRow] = [];
        }
        acc[seat.seatRow].push(seat);
        return acc;
    }, {} as Record<string, Seat[]>);

    const rows = Object.keys(seatsByRow).sort();

    const handleSeatClick = (seat: Seat) => {
        if (seat.status !== 'AVAILABLE' && seat.id !== selectedSeat?.id) {
            return;
        }

        // If clicking the same seat, deselect it
        if (selectedSeat?.id === seat.id) {
            onSelectSeat(null);
            return;
        }

        // Select the new seat
        onSelectSeat(seat);
    };

    // Find the maximum seat number
    const maxSeatNumber = Math.max(...seats.map(seat => parseInt(seat.seatNumber)));

    const getSeatStyles = (seat: Seat | null) => {
        const baseStyles = {
            width: { xs: 32, sm: 40, md: 48 },
            height: { xs: 32, sm: 40, md: 48 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: seat?.status === 'AVAILABLE' ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            border: '2px solid',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            position: 'relative',
            '&:hover': {
                transform: seat?.status === 'AVAILABLE' ? 'scale(1.1)' : 'none',
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '8px',
                height: '2px',
                backgroundColor: 'grey.400',
            }
        };

        if (!seat) {
            return {
                ...baseStyles,
                visibility: 'hidden',
            };
        }

        if (selectedSeat?.id === seat.id) {
            return {
                ...baseStyles,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 15px ${theme.palette.primary.main}40`,
            };
        }

        switch (seat.status) {
            case 'AVAILABLE':
                return {
                    ...baseStyles,
                    borderColor: theme.palette.success.main,
                    color: theme.palette.success.main,
                    '&:hover': {
                        ...baseStyles['&:hover'],
                        backgroundColor: `${theme.palette.success.main}10`,
                    }
                };
            case 'BOOKED':
                return {
                    ...baseStyles,
                    borderColor: theme.palette.error.main,
                    color: theme.palette.error.main,
                    backgroundColor: `${theme.palette.error.main}10`,
                    opacity: 0.7,
                };
            case 'RESERVED':
                return {
                    ...baseStyles,
                    borderColor: theme.palette.warning.main,
                    color: theme.palette.warning.main,
                    backgroundColor: `${theme.palette.warning.main}10`,
                    opacity: 0.8,
                };
            default:
                return baseStyles;
        }
    };

    // Poll for seat updates
    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await screeningService.getAvailableSeats(screeningId);
                setSeats(response.data);

                // If our selected seat is no longer available, deselect it
                if (selectedSeat) {
                    const updatedSeat = response.data.find(s => s.id === selectedSeat.id);
                    if (updatedSeat?.status !== 'AVAILABLE' && updatedSeat?.id !== selectedSeat.id) {
                        onSelectSeat(null);
                    }
                }
            } catch (err) {
                console.error('Error fetching seats:', err);
                setError('Failed to load seats');
            }
        };

        fetchSeats();
        const interval = setInterval(fetchSeats, 5000); // Poll every 5 seconds

        return () => {
            clearInterval(interval);
        };
    }, [screeningId, selectedSeat, onSelectSeat]);

    if (!seats.length) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error" align="center" variant="h6">
                    No seats available for this screening.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    backgroundColor: 'grey.100',
                    borderRadius: 4,
                    maxWidth: 1000,
                    margin: '0 auto',
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 3
                    }}
                >
                    Screen
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        height: 12,
                        background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        mb: { xs: 4, sm: 6 },
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    }}
                />

                {error && (
                    <Typography color="error" align="center" gutterBottom>
                        {error}
                    </Typography>
                )}

                <Box sx={{ overflowX: 'auto' }}>
                    <Grid container spacing={2} justifyContent="center">
                        {rows.map(row => (
                            <Grid item xs={12} key={`row-${row}`}>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    gap={1}
                                    sx={{
                                        py: 0.5,
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            minWidth: 30,
                                            fontWeight: 'bold',
                                            color: 'text.secondary',
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }}
                                    >
                                        {row}
                                    </Typography>
                                    <Box display="flex" gap={1}>
                                        {Array.from({ length: maxSeatNumber }).map((_, index) => {
                                            const seatNumber = (index + 1).toString();
                                            const seat = seatsByRow[row].find(s => s.seatNumber === seatNumber) || null;

                                            return (
                                                <Box
                                                    key={`seat-${row}-${seatNumber}`}
                                                    onClick={() => seat && handleSeatClick(seat)}
                                                    sx={getSeatStyles(seat)}
                                                >
                                                    {seatNumber}
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{
                    mt: { xs: 4, sm: 6 },
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            border: `2px solid ${theme.palette.success.main}`,
                            borderRadius: 1
                        }} />
                        <Typography variant="body2" color="text.secondary">Available</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            border: `2px solid ${theme.palette.error.main}`,
                            borderRadius: 1,
                            backgroundColor: `${theme.palette.error.main}10`,
                            opacity: 0.7
                        }} />
                        <Typography variant="body2" color="text.secondary">Booked</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            border: `2px solid ${theme.palette.warning.main}`,
                            borderRadius: 1,
                            backgroundColor: `${theme.palette.warning.main}10`,
                            opacity: 0.8
                        }} />
                        <Typography variant="body2" color="text.secondary">Reserved</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: 1,
                            boxShadow: `0 0 15px ${theme.palette.primary.main}40`,
                        }} />
                        <Typography variant="body2" color="text.secondary">Selected</Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}; 
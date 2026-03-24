import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Seat } from '../types';
import { screeningService } from '../services/api';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import WeekendIcon from '@mui/icons-material/Weekend';

export interface SeatMapProps {
    screeningId: string;
    onSelectSeat: (seat: Seat | null) => void;
    selectedSeat: Seat | null;
}

export const SeatMap: React.FC<SeatMapProps> = ({ screeningId, onSelectSeat, selectedSeat }) => {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

    const getSeatColor = (seat: Seat) => {
        if (selectedSeat?.id === seat.id) {
            return {
                bg: '#ff6b00',
                border: '#ff6b00',
                text: '#ffffff',
            };
        }

        switch (seat.status) {
            case 'AVAILABLE':
                return {
                    bg: '#4caf50',
                    border: '#4caf50',
                    text: '#ffffff',
                };
            case 'BOOKED':
                return {
                    bg: '#e0e0e0',
                    border: '#bdbdbd',
                    text: '#9e9e9e',
                };
            case 'RESERVED':
                return {
                    bg: '#ffc107',
                    border: '#ffc107',
                    text: '#ffffff',
                };
            default:
                return {
                    bg: '#e0e0e0',
                    border: '#bdbdbd',
                    text: '#9e9e9e',
                };
        }
    };

    // Poll for seat updates
    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await screeningService.getAvailableSeats(screeningId);
                setSeats(response.data.result);

                // If our selected seat is no longer available, deselect it
                if (selectedSeat) {
                    const updatedSeat = response.data.result.find(s => s.id === selectedSeat.id);
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
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 4, md: 5 },
                    backgroundColor: '#fafafa',
                    borderRadius: 3,
                    maxWidth: 900,
                    margin: '0 auto',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
            >
                {/* Screen */}
                <Box sx={{ mb: 6 }}>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            fontWeight: 600,
                            color: '#ff6b00',
                            mb: 2,
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                        }}
                    >
                        SCREEN
                    </Typography>
                    <Box
                        sx={{
                            width: '90%',
                            maxWidth: 600,
                            height: 8,
                            margin: '0 auto',
                            background: 'linear-gradient(to right, transparent, #ff6b00, transparent)',
                            borderRadius: '0 0 50% 50%',
                            boxShadow: '0 4px 20px rgba(255, 107, 0, 0.3)',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -2,
                                left: '5%',
                                right: '5%',
                                height: 3,
                                background: 'linear-gradient(to right, transparent, rgba(255, 107, 0, 0.5), transparent)',
                                borderRadius: '50%',
                            },
                        }}
                    />
                </Box>

                {error && (
                    <Typography color="error" align="center" gutterBottom sx={{ mb: 3 }}>
                        {error}
                    </Typography>
                )}

                {/* Seats Grid */}
                <Box sx={{ overflowX: 'auto', mb: 4 }}>
                    <Box sx={{ minWidth: 500, mx: 'auto', width: 'fit-content' }}>
                        {rows.map((row) => (
                            <Box
                                key={`row-${row}`}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: { xs: 0.75, sm: 1, md: 1.5 },
                                    mb: { xs: 0.75, sm: 1, md: 1.5 },
                                }}
                            >
                                {/* Row Label */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        minWidth: 24,
                                        fontWeight: 700,
                                        color: '#666',
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        textAlign: 'center',
                                    }}
                                >
                                    {row}
                                </Typography>

                                {/* Seats */}
                                {Array.from({ length: maxSeatNumber }).map((_, index) => {
                                    const seatNumber = (index + 1).toString();
                                    const seat = seatsByRow[row].find(s => s.seatNumber === seatNumber);

                                    if (!seat) {
                                        return (
                                            <Box
                                                key={`empty-${row}-${seatNumber}`}
                                                sx={{
                                                    width: { xs: 32, sm: 40, md: 48 },
                                                    height: { xs: 32, sm: 40, md: 48 },
                                                }}
                                            />
                                        );
                                    }

                                    const colors = getSeatColor(seat);
                                    const isClickable = seat.status === 'AVAILABLE' || selectedSeat?.id === seat.id;

                                    return (
                                        <Box
                                            key={`seat-${row}-${seatNumber}`}
                                            onClick={() => isClickable && handleSeatClick(seat)}
                                            sx={{
                                                width: { xs: 36, sm: 44, md: 52 },
                                                height: { xs: 36, sm: 44, md: 52 },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: isClickable ? 'pointer' : 'not-allowed',
                                                position: 'relative',
                                                transition: 'all 0.3s ease',
                                                '&:hover': isClickable ? {
                                                    transform: 'scale(1.15) translateY(-4px)',
                                                    zIndex: 10,
                                                } : {},
                                            }}
                                        >
                                            <WeekendIcon
                                                sx={{
                                                    fontSize: { xs: 32, sm: 40, md: 48 },
                                                    color: colors.bg,
                                                    filter: selectedSeat?.id === seat.id 
                                                        ? 'drop-shadow(0 4px 8px rgba(255, 107, 0, 0.5))'
                                                        : seat.status === 'BOOKED' 
                                                        ? 'grayscale(50%)'
                                                        : 'none',
                                                    opacity: seat.status === 'BOOKED' ? 0.4 : 1,
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    position: 'absolute',
                                                    fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                                                    fontWeight: 700,
                                                    color: seat.status === 'BOOKED' ? '#999' : '#fff',
                                                    textShadow: seat.status === 'BOOKED' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                                                }}
                                            >
                                                {seatNumber}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Legend */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: { xs: 2, sm: 3 },
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        p: { xs: 2, sm: 3 },
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                >
                    {[
                        { label: 'Còn trống', color: '#4caf50', status: 'AVAILABLE' },
                        { label: 'Đang chọn', color: '#ff6b00', status: 'SELECTED' },
                        { label: 'Đang giữ', color: '#ffc107', status: 'RESERVED' },
                        { label: 'Đã đặt', color: '#e0e0e0', status: 'BOOKED' },
                    ].map((item) => (
                        <Box
                            key={item.status}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <WeekendIcon
                                sx={{
                                    fontSize: 28,
                                    color: item.color,
                                    opacity: item.status === 'BOOKED' ? 0.4 : 1,
                                }}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}; 
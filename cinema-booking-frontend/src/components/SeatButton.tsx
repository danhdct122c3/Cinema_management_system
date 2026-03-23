import React from 'react';
import { Box, Typography } from '@mui/material';
import { SeatShowTimeResponse } from '../types';

interface SeatButtonProps {
    seat: SeatShowTimeResponse;
    isSelected: boolean;
    isDisabled: boolean;
    onClick: () => void;
}

export const SeatButton: React.FC<SeatButtonProps> = ({
    seat,
    isSelected,
    isDisabled,
    onClick,
}) => {
    const getBackgroundColor = () => {
        if (isSelected) return '#ff6b00';      // Selected: Orange
        if (seat.status === 'AVAILABLE') {
            // Distinguish VIP and NORMAL seats by color
            return seat.seatType === 'VIP' ? '#9c27b0' : '#4caf50';  // VIP: Purple, NORMAL: Green
        }
        if (seat.status === 'HOLD') return '#ffc107';       // Hold: Yellow
        if (seat.status === 'BOOKED') return '#e0e0e0';     // Booked: Grey
        return '#e0e0e0';
    };

    return (
        <Box
            onClick={!isDisabled ? onClick : undefined}
            sx={{
                width: 50,
                height: 50,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: getBackgroundColor(),
                border: isSelected ? '2px solid #ff6b00' : '1px solid rgba(0,0,0,0.1)',
                borderRadius: 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled && !isSelected ? 0.6 : 1,
                transition: 'all 0.2s ease',
                userSelect: 'none',
                '&:hover': !isDisabled ? {
                    transform: 'scale(1.05)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                } : {},
            }}
        >
            <Typography 
                variant="caption" 
                fontWeight="bold"
                sx={{ color: isSelected || seat.status === 'AVAILABLE' ? '#fff' : '#666' }}
            >
                {seat.seatCode}
            </Typography>
            <Typography
                variant="caption"
                sx={{ color: isSelected || seat.status === 'AVAILABLE' ? '#fff' : '#999', fontSize: '10px' }}
            >
                {(seat.price / 1000).toFixed(0)}k
            </Typography>
        </Box>
    );
};

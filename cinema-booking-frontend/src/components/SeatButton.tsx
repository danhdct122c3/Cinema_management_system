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
    const isVipSeat = seat.seatType === 'VIP';
    const isHoldSeat = seat.status === 'HOLD';
    const isBookedSeat = seat.status === 'BOOKED';
    const isAvailableSeat = seat.status === 'AVAILABLE';

    const getBackgroundColor = () => {
        if (isSelected) return '#DC2626';
        if (isAvailableSeat) return isVipSeat ? '#F59E0B' : '#1D4ED8';
        if (isHoldSeat) return '#7C3AED';
        if (isBookedSeat) return '#475569';
        return isVipSeat ? '#F59E0B' : '#1D4ED8';
    };

    const getBorderColor = () => {
        if (isSelected) return '#7F1D1D';
        if (isAvailableSeat) return isVipSeat ? '#92400E' : '#1E3A8A';
        if (isHoldSeat) return '#4C1D95';
        if (isBookedSeat) return '#1F2937';
        return '#334155';
    };

    const getPrimaryTextColor = () => {
        if (isSelected || isHoldSeat || isBookedSeat || !isVipSeat) return '#F8FAFC';
        return '#111827';
    };

    const getMetaTextColor = () => {
        if (isSelected || isHoldSeat || isBookedSeat || !isVipSeat) return '#E2E8F0';
        return '#111827';
    };

    const seatButton = (
        <Box
            onClick={!isDisabled ? onClick : undefined}
            sx={{
                width: { xs: 40, sm: 54 },
                height: { xs: 40, sm: 54 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: getBackgroundColor(),
                border: `2px solid ${getBorderColor()}`,
                borderRadius: { xs: 1.2, sm: 1.5 },
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled && !isSelected ? 0.6 : 1,
                transition: 'all 0.24s ease',
                userSelect: 'none',
                '&:hover': !isDisabled ? {
                    transform: 'scale(1.05)',
                    boxShadow: isSelected ? '0 0 0 4px rgba(220, 38, 38, 0.22)' : '0 10px 20px -10px rgba(2, 6, 23, 0.85)',
                    filter: 'brightness(1.02)',
                } : {},
                '&:active': !isDisabled ? {
                    transform: 'scale(0.95)',
                } : {},
            }}
        >
            <Typography
                variant="caption"
                fontWeight="bold"
                sx={{ color: getPrimaryTextColor(), fontSize: { xs: '0.68rem', sm: '0.74rem' }, lineHeight: 1.05 }}
            >
                {seat.seatCode}
            </Typography>
            <Typography
                variant="caption"
                sx={{ color: getMetaTextColor(), fontSize: { xs: '7px', sm: '9px' }, fontWeight: 700, lineHeight: 1.05 }}
            >
                {isVipSeat ? 'VIP' : 'THUONG'}
            </Typography>
        </Box>
    );

    return seatButton;
};

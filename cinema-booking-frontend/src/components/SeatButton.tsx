import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
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
        if (isSelected) return '#E50914';
        if (seat.status === 'AVAILABLE') return '#E2E8F0';
        if (seat.status === 'HOLD') return '#F59E0B';
        if (seat.status === 'BOOKED') return '#9CA3AF';
        return '#E2E8F0';
    };

    // Format hold expiration time for tooltip
    const getHoldTooltip = () => {
        if (seat.status === 'HOLD') {
            const heldInfo = seat.heldByUserEmail ? `Đang giữ bởi: ${seat.heldByUserEmail}` : 'Ghế đang được giữ';
            if (seat.holdExpireTime) {
                const expireDate = new Date(seat.holdExpireTime);
                const timeRemaining = Math.max(0, (expireDate.getTime() - Date.now()) / 1000);
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = Math.floor(timeRemaining % 60);
                return `${heldInfo}\nHết hạn sau: ${minutes}p ${seconds}g`;
            }
            return heldInfo;
        }
        return seat.status === 'BOOKED' ? 'Ghế này đã được đặt' : '';
    };

    const seatButton = (
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
                border: isSelected ? '2px solid #BE123C' : '1px solid #CBD5E1',
                borderRadius: 1.5,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled && !isSelected ? 0.6 : 1,
                transition: 'all 0.24s ease',
                userSelect: 'none',
                '&:hover': !isDisabled ? {
                    transform: 'scale(1.05)',
                    boxShadow: isSelected ? '0 0 0 4px rgba(229, 9, 20, 0.15)' : '0 8px 16px -10px rgba(15, 23, 42, 0.6)',
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
                sx={{ color: isSelected ? '#fff' : '#1F2937' }}
            >
                {seat.seatCode}
            </Typography>
            <Typography
                variant="caption"
                sx={{ color: isSelected ? '#fff' : '#475569', fontSize: '10px' }}
            >
                {(seat.price / 1000).toFixed(0)}k
            </Typography>
        </Box>
    );

    if (seat.status === 'HOLD' || seat.status === 'BOOKED') {
        return (
            <Tooltip title={getHoldTooltip()} arrow>
                {seatButton}
            </Tooltip>
        );
    }

    return seatButton;
};

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const SeatLegend: React.FC = () => {
    const legends = [
        { color: '#E2E8F0', status: 'AVAILABLE', label: 'Trống' },
        { color: '#E50914', status: 'SELECTED', label: 'Đã chọn' },
        { color: '#F59E0B', status: 'HOLD', label: 'Đang giữ' },
        { color: '#9CA3AF', status: 'BOOKED', label: 'Đã đặt' },
    ];

    return (
        <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #E5E7EB', borderRadius: 2.5 }}>
            <Typography variant="subtitle2" fontWeight="bold" mb={2} color="text.primary">
                Chú Thích Ghế
            </Typography>
            <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                {legends.map((legend) => (
                    <Box key={legend.status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: legend.color,
                                borderRadius: 1.2,
                                border: '1px solid #CBD5E1',
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{legend.label}</Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

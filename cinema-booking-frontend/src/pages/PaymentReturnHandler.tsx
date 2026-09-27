import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

export const PaymentReturnHandler: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const search = location.search || window.location.search;
        // Chuyển hướng ngay sang /booking-history kèm toàn bộ tham số trả về
        navigate(`/booking-history${search}`, { replace: true });
    }, [navigate, location]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: 2,
            }}
        >
            <CircularProgress color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Đang xử lý kết quả thanh toán và chuyển về lịch sử vé...
            </Typography>
        </Box>
    );
};

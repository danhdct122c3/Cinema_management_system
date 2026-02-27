import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, IconButton } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { movieService } from '../services/api';

interface StatCard {
    title: string;
    value: string | number;
    icon: JSX.Element;
    color: string;
    bgColor: string;
}

export const AdminDashboard: React.FC = () => {
    const [totalMovies, setTotalMovies] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const moviesResponse = await movieService.getAllMovies();
                setTotalMovies(moviesResponse.data.length);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    const stats: StatCard[] = [
        {
            title: 'Tổng Số Phim',
            value: totalMovies,
            icon: <MovieIcon sx={{ fontSize: 40 }} />,
            color: '#ff6b00',
            bgColor: 'rgba(255, 107, 0, 0.1)',
        },
        {
            title: 'Suất Chiếu Hôm Nay',
            value: 12,
            icon: <EventIcon sx={{ fontSize: 40 }} />,
            color: '#2196f3',
            bgColor: 'rgba(33, 150, 243, 0.1)',
        },
        {
            title: 'Vé Đã Đặt',
            value: 156,
            icon: <ConfirmationNumberIcon sx={{ fontSize: 40 }} />,
            color: '#4caf50',
            bgColor: 'rgba(76, 175, 80, 0.1)',
        },
        {
            title: 'Doanh Thu Hôm Nay',
            value: '15.5M VNĐ',
            icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            color: '#ffc107',
            bgColor: 'rgba(255, 193, 7, 0.1)',
        },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {stat.title}
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            backgroundColor: stat.bgColor,
                                            color: stat.color,
                                            borderRadius: 2,
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
                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            height: '400px',
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Doanh Thu Tuần Này
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '320px',
                                color: 'text.secondary',
                            }}
                        >
                            <Typography>Biểu đồ doanh thu (Coming soon)</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            height: '400px',
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Top Phim Hot
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <Box
                                    key={item}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 1.5,
                                        borderRadius: 2,
                                        mb: 1,
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            backgroundColor: '#ff6b00',
                                            color: 'white',
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {item}
                                    </Typography>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            Movie Title {item}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {120 - item * 10} vé
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

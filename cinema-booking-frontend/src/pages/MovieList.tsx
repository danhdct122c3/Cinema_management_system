import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, Button, CircularProgress, Tabs, Tab } from '@mui/material';
import { MovieCard } from '../components/MovieCard';
import { movieService } from '../services/api';
import { Movie } from '../types';
import { useNavigate } from 'react-router-dom';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import HistoryIcon from '@mui/icons-material/History';

export const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await movieService.getAllMovies();
                setMovies(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('Failed to load movies. Please try again later.');
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const handleSelectMovie = (movie: Movie) => {
        navigate(`/movie/${movie.id}/screenings`);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'background.default'
                }}
            >
                <CircularProgress size={60} sx={{ color: '#ff6b00' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" align="center" variant="h5" sx={{ mt: 4 }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)',
                    borderBottom: '2px solid rgba(255, 107, 0, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <LocalMoviesIcon sx={{ fontSize: 80, color: '#ff6b00', filter: 'drop-shadow(0 0 20px rgba(255, 107, 0, 0.5))' }} />
                        </Box>
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                color: '#ffffff',
                                letterSpacing: '1px',
                            }}
                        >
                            Đặt Vé Xem Phim Online
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 4,
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: { xs: '1rem', md: '1.25rem' },
                                fontWeight: 400,
                            }}
                        >
                            Trải nghiệm điện ảnh đỉnh cao - Đặt vé nhanh chóng, không lo trễ nải
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<HistoryIcon />}
                            onClick={() => navigate('/booking-history')}
                            sx={{
                                py: 1.5,
                                px: 4,
                                fontSize: '1rem',
                                backgroundColor: '#ffffff',
                                color: '#ff6b00',
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s',
                            }}
                        >
                            Xem Lịch Sử Đặt Vé
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* Tabs Section */}
                <Box sx={{ borderBottom: 2, borderColor: 'rgba(255, 107, 0, 0.2)', mb: 5 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        centered
                        sx={{
                            '& .MuiTab-root': {
                                color: 'text.secondary',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                minWidth: 200,
                                py: 2,
                                '&.Mui-selected': {
                                    color: '#ff6b00',
                                },
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#ff6b00',
                                height: 3,
                            },
                        }}
                    >
                        <Tab label="Phim Đang Chiếu" />
                        <Tab label="Phim Sắp Chiếu" />
                    </Tabs>
                </Box>

                {/* Movie Grid */}
                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    sx={{
                        '@keyframes fadeInUp': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(30px)',
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)',
                            },
                        },
                    }}
                >
                    {movies.map((movie, index) => (
                        <Grid 
                            item 
                            key={movie.id} 
                            xs={12} 
                            sm={6} 
                            md={4} 
                            lg={3}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                animation: 'fadeInUp 0.6s ease-out forwards',
                                animationDelay: `${index * 0.1}s`,
                                opacity: 0,
                            }}
                        >
                            <MovieCard movie={movie} onSelect={handleSelectMovie} />
                        </Grid>
                    ))}
                </Grid>

                {movies.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" color="text.secondary">
                            Không có phim nào đang chiếu
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
}; 
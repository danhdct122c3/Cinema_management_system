import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, Button, CircularProgress, useTheme, alpha } from '@mui/material';
import { MovieCard } from '../components/MovieCard';
import { movieService } from '../services/api';
import { Movie } from '../types';
import { useNavigate } from 'react-router-dom';

export const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const theme = useTheme();

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

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5'
                }}
            >
                <CircularProgress size={60} />
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
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.9)})`,
                    color: 'white',
                    py: { xs: 8, md: 12 },
                    mb: 6,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                mb: 3,
                                fontSize: { xs: '2.5rem', md: '3.5rem' }
                            }}
                        >
                            Book Your Perfect Movie Experience
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 4,
                                opacity: 0.9,
                                fontSize: { xs: '1.2rem', md: '1.5rem' }
                            }}
                        >
                            Discover the latest blockbusters and secure the best seats in the house
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={() => navigate('/booking-history')}
                            sx={{
                                py: 2,
                                px: 4,
                                fontSize: '1.1rem',
                                textTransform: 'none',
                                borderRadius: 2,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
                                },
                                transition: 'all 0.2s',
                            }}
                        >
                            View My Bookings
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ pb: 8 }}>
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        mb: 4,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: theme.palette.text.primary,
                    }}
                >
                    Now Showing
                </Typography>

                <Grid
                    container
                    spacing={4}
                    justifyContent="center"
                    sx={{
                        opacity: 0,
                        animation: 'fadeIn 0.5s ease-out forwards',
                        '@keyframes fadeIn': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(20px)',
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)',
                            },
                        },
                    }}
                >
                    {movies.map((movie) => (
                        <Grid item key={movie.id} xs={12} sm={6} md={4} lg={4}>
                            <MovieCard movie={movie} onSelect={handleSelectMovie} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}; 
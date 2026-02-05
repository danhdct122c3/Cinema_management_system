import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    Grid,
    CircularProgress,
    Paper,
    useTheme,
    alpha,
    Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie, Screening } from '../types';
import { movieService } from '../services/api';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const ScreeningList: React.FC = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [screenings, setScreenings] = useState<Screening[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const theme = useTheme();

    const fetchScreenings = async () => {
        try {
            if (!movieId) return;
            const screeningsResponse = await movieService.getMovieScreenings(Number(movieId));
            setScreenings(screeningsResponse.data);
        } catch (error) {
            console.error('Error fetching screenings:', error);
            setError('Failed to load screenings. Please try again later.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!movieId) return;

                const [movieResponse, screeningsResponse] = await Promise.all([
                    movieService.getMovieById(Number(movieId)),
                    movieService.getMovieScreenings(Number(movieId))
                ]);

                setMovie(movieResponse.data);
                setScreenings(screeningsResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load screenings. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();

        // Set up polling for screenings
        const interval = setInterval(fetchScreenings, 5000); // Poll every 5 seconds

        return () => {
            clearInterval(interval); // Cleanup on unmount
        };
    }, [movieId]);

    const handleSelectScreening = (screening: Screening) => {
        navigate(`/movie/${movieId}/screening/${screening.id}/seats`);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: alpha(theme.palette.primary.main, 0.03)
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error || !movie) {
        return (
            <Container>
                <Typography color="error" align="center" variant="h5" sx={{ mt: 4 }}>
                    {error || 'Movie not found'}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/')}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 4
                        }}
                    >
                        Back to Movies
                    </Button>
                </Box>
            </Container>
        );
    }

    // Group screenings by date
    const screeningsByDate = screenings.reduce((acc, screening) => {
        const date = new Date(screening.screeningTime).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(screening);
        return acc;
    }, {} as Record<string, Screening[]>);

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: alpha(theme.palette.primary.main, 0.03),
            pb: 8
        }}>
            {/* Movie Info Section */}
            <Box
                sx={{
                    background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.9)})`,
                    color: 'white',
                    pt: 4,
                    pb: 6,
                }}
            >
                <Container maxWidth="lg">
                    <Button
                        variant="text"
                        color="inherit"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        sx={{
                            mb: 4,
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                        }}
                    >
                        Back to Movies
                    </Button>

                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={8}
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    transform: 'translateY(0)',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                    }
                                }}
                            >
                                <img
                                    src={movie.imageUrl}
                                    alt={movie.title}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {movie.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTimeIcon /> {movie.duration} minutes
                                </Typography>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarTodayIcon /> {new Date(movie.releaseDate).getFullYear()}
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                                {movie.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Typography variant="body1">
                                    <strong>Director:</strong> {movie.director}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Genre:</strong> {movie.genre}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        backgroundColor: 'white',
                    }}
                >
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                            Available Screenings
                        </Typography>

                        {Object.entries(screeningsByDate).map(([date, dateScreenings]) => (
                            <Box key={date} sx={{ mb: 4 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        color: theme.palette.primary.main,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {new Date(date).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Typography>
                                <Grid container spacing={2}>
                                    {dateScreenings.map((screening) => (
                                        <Grid item xs={12} sm={6} md={4} key={screening.id}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                                    }
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        {new Date(screening.screeningTime).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </Typography>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        mb: 2,
                                                        color: screening.availableSeats > 0
                                                            ? theme.palette.success.main
                                                            : theme.palette.error.main
                                                    }}>
                                                        <EventSeatIcon />
                                                        <Typography>
                                                            {screening.availableSeats} seats available
                                                        </Typography>
                                                    </Box>
                                                    <Button
                                                        variant="contained"
                                                        fullWidth
                                                        onClick={() => handleSelectScreening(screening)}
                                                        disabled={screening.availableSeats === 0}
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform: 'none',
                                                            py: 1,
                                                            fontWeight: 'bold',
                                                            backgroundColor: screening.availableSeats === 0
                                                                ? theme.palette.error.main
                                                                : theme.palette.primary.main,
                                                            '&:hover': {
                                                                backgroundColor: screening.availableSeats === 0
                                                                    ? theme.palette.error.dark
                                                                    : theme.palette.primary.dark,
                                                            }
                                                        }}
                                                    >
                                                        {screening.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                                {Object.keys(screeningsByDate).length > 1 && (
                                    <Divider sx={{ my: 4 }} />
                                )}
                            </Box>
                        ))}

                        {screenings.length === 0 && (
                            <Typography
                                align="center"
                                color="text.secondary"
                                sx={{ py: 4 }}
                            >
                                No screenings available for this movie.
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}; 
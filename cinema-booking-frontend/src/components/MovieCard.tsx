import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { Movie } from '../types';

interface MovieCardProps {
    movie: Movie;
    onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
    const navigate = useNavigate();

    // Age rating based on genre (demo)
    const getAgeRating = (genreName: string | undefined) => {
        if (!genreName) return 'T13';
        const genre = genreName.toLowerCase();
        if (genre.includes('action') || genre.includes('horror')) return 'T18';
        if (genre.includes('thriller')) return 'T16';
        return 'T13';
    };

    return (
        <Card
            sx={{
                width: 280,
                minWidth: 280,
                maxWidth: 280,
                backgroundColor: 'background.paper',
                transition: 'all 0.28s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-6px) scale(1.02)',
                    boxShadow: '0 20px 36px -20px rgba(0, 0, 0, 0.45)',
                    '& .movie-poster': {
                        transform: 'scale(1.05)',
                    },
                },
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid #E5E7EB',
                boxShadow: '0 6px 16px -10px rgba(0, 0, 0, 0.2)',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%',
                    aspectRatio: '280 / 420',
                    cursor: 'pointer',
                }}
                onClick={() => navigate(`/movie/${movie.id}`)}
            >
                <CardMedia
                    component="img"
                    image={movie.imageUrl || 'https://via.placeholder.com/280x420?text=No+Image'}
                    alt={movie.title}
                    loading="lazy"
                    className="movie-poster"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.02) 45%, rgba(17, 24, 39, 0.65) 100%)',
                    }}
                />
                {/* Age Rating Badge */}
                <Chip
                    label={getAgeRating(movie.genreNames?.[0])}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(229, 9, 20, 0.9)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        height: 24,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                />

            </Box>
            <CardContent sx={{ p: 2.5, pt: 2 }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        mb: 1.5,
                        height: '2.6em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        color: 'text.primary',
                        lineHeight: 1.3,
                    }}
                >
                    {movie.title}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Chip
                        label={movie.genreNames?.join(', ') || 'Không rõ'}
                        size="small"
                        sx={{
                            width: 'fit-content',
                            backgroundColor: 'rgba(229, 9, 20, 0.08)',
                            color: 'primary.main',
                            border: '1px solid rgba(229, 9, 20, 0.2)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            height: 24,
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    sx={{
                        py: 1.2,
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            boxShadow: '0 8px 20px -12px rgba(229, 9, 20, 0.8)',
                        },
                        transition: 'all 0.3s',
                    }}
                >
                    Đặt Vé Ngay
                </Button>
            </CardContent>
        </Card>
    );
}; 
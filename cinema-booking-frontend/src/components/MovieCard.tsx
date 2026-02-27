import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { Movie } from '../types';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface MovieCardProps {
    movie: Movie;
    onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
    // Generate random rating for demo (7.0 - 9.5)
    const rating = (Math.random() * 2.5 + 7).toFixed(1);
    
    // Age rating based on genre (demo)
    const getAgeRating = (genre: string) => {
        if (genre.toLowerCase().includes('action') || genre.toLowerCase().includes('horror')) return 'T18';
        if (genre.toLowerCase().includes('thriller')) return 'T16';
        return 'T13';
    };

    return (
        <Card
            sx={{
                maxWidth: 280,
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 16px 40px -12px rgba(255, 107, 0, 0.4)',
                    '& .movie-poster': {
                        transform: 'scale(1.05)',
                    },
                    '& .book-button': {
                        backgroundColor: '#ff6b00',
                    },
                },
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    height="400"
                    image={movie.imageUrl || 'https://via.placeholder.com/280x400?text=No+Image'}
                    alt={movie.title}
                    className="movie-poster"
                    sx={{
                        transition: 'transform 0.3s ease-in-out',
                        objectFit: 'cover',
                    }}
                />
                {/* Rating Badge */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(10px)',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        border: '1px solid rgba(255, 193, 7, 0.3)',
                    }}
                >
                    <StarIcon sx={{ fontSize: 18, color: '#ffc107' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ffc107', fontSize: '0.95rem' }}>
                        {rating}
                    </Typography>
                </Box>
                {/* Age Rating Badge */}
                <Chip
                    label={getAgeRating(movie.genre)}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(255, 107, 0, 0.9)',
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
                        label={movie.genre}
                        size="small"
                        sx={{
                            width: 'fit-content',
                            backgroundColor: 'rgba(255, 107, 0, 0.1)',
                            color: '#ff6b00',
                            border: '1px solid rgba(255, 107, 0, 0.3)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            height: 24,
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => onSelect(movie)}
                    className="book-button"
                    sx={{
                        py: 1.2,
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        backgroundColor: 'rgba(255, 107, 0, 0.9)',
                        color: 'white',
                        border: '1px solid rgba(255, 107, 0, 0.3)',
                        '&:hover': {
                            backgroundColor: '#ff6b00',
                            boxShadow: '0 4px 20px rgba(255, 107, 0, 0.4)',
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
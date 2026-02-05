import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { Movie } from '../types';

interface MovieCardProps {
    movie: Movie;
    onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
    return (
        <Card
            sx={{
                maxWidth: 345,
                margin: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
                },
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="400"
                    image={movie.imageUrl}
                    alt={movie.title}
                    sx={{
                        transition: 'transform 0.3s',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                    }}
                >
                    <Chip
                        label={movie.genre}
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    />
                </Box>
            </Box>
            <CardContent sx={{ p: 3 }}>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        mb: 2,
                        height: '3.6em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {movie.title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        height: '4.5em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {movie.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', marginRight: '4px' }}>Duration:</span> {movie.duration} min
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', marginRight: '4px' }}>Director:</span> {movie.director}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => onSelect(movie)}
                    sx={{
                        mt: 2,
                        py: 1.5,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        backgroundColor: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            transform: 'scale(1.02)',
                        },
                        transition: 'all 0.2s',
                    }}
                >
                    Book Now
                </Button>
            </CardContent>
        </Card>
    );
}; 
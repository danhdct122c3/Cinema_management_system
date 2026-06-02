import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    FormControl,
    IconButton,
    InputBase,
    MenuItem,
    Paper,
    Select,
    Typography,
    alpha,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { genreService, movieService, showtimeService } from '../services/api';
import { Genre, Movie } from '../types';
import { useGenre } from '../context/GenreContext';
import { useSearch } from '../context/SearchContext';

type MovieStatusFilter = 'ALL' | 'NOW_SHOWING' | 'COMING_SOON';

const ALLOWED_STATUSES: Array<Movie['status']> = ['NOW_SHOWING', 'COMING_SOON'];

const STATUS_OPTIONS: Array<{ value: MovieStatusFilter; label: string }> = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'NOW_SHOWING', label: 'Phim đang chiếu' },
    { value: 'COMING_SOON', label: 'Phim sắp chiếu' },
];

const getStatusLabel = (status: Movie['status']) => {
    if (status === 'NOW_SHOWING') return 'Đang chiếu';
    if (status === 'COMING_SOON') return 'Sắp chiếu';
    return 'Đã kết thúc';
};

const getStatusChipColor = (status: Movie['status']) => {
    if (status === 'NOW_SHOWING') {
        return {
            bg: alpha('#16A34A', 0.14),
            border: alpha('#16A34A', 0.35),
            text: '#166534',
        };
    }

    return {
        bg: alpha('#2563EB', 0.14),
        border: alpha('#2563EB', 0.35),
        text: '#1E3A8A',
    };
};

export const MoviesCatalog: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { selectedGenreId, selectedGenreName, setSelectedGenre } = useGenre();
    const { searchKeyword, setSearchKeyword } = useSearch();

    const [genres, setGenres] = useState<Genre[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [localSearchInput, setLocalSearchInput] = useState(searchKeyword || '');

    const initialStatusFromQuery = (searchParams.get('status') || 'ALL').toUpperCase();
    const [statusFilter, setStatusFilter] = useState<MovieStatusFilter>(
        initialStatusFromQuery === 'NOW_SHOWING' || initialStatusFromQuery === 'COMING_SOON'
            ? (initialStatusFromQuery as MovieStatusFilter)
            : 'ALL'
    );

    useEffect(() => {
        setLocalSearchInput(searchKeyword || '');
    }, [searchKeyword]);

    useEffect(() => {
        const queryStatus = (searchParams.get('status') || 'ALL').toUpperCase();
        if (queryStatus === 'NOW_SHOWING' || queryStatus === 'COMING_SOON') {
            setStatusFilter(queryStatus as MovieStatusFilter);
            return;
        }
        setStatusFilter('ALL');
    }, [searchParams]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await genreService.getAllGenres();
                setGenres(response.data.result || []);
            } catch (err) {
                console.error('Error fetching genres:', err);
            }
        };

        fetchGenres();
    }, []);

    const selectedGenreLabel = useMemo(() => {
        if (!selectedGenreId) return null;
        if (selectedGenreName) return selectedGenreName;
        return genres.find((genre) => genre.id === selectedGenreId)?.name || null;
    }, [selectedGenreId, selectedGenreName, genres]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                setError('');

                let response;
                if (searchKeyword) {
                    response = await movieService.searchMovies(searchKeyword);
                } else if (statusFilter === 'NOW_SHOWING') {
                    response = await movieService.getMoviesByStatus('NOW_SHOWING');
                } else if (statusFilter === 'COMING_SOON') {
                    response = await movieService.getMoviesByStatus('COMING_SOON');
                } else {
                    response = await movieService.getAllMovies();
                }

                const sourceMovies = response.data.result || [];
                const showtimesResponse = await showtimeService.getAllShowtimes();
                const activeShowtimeMovieIds = new Set(
                    (showtimesResponse.data.result || [])
                        .filter((showtime) => showtime.status === 'ACTIVE')
                        .map((showtime) => showtime.movieId)
                );

                const filtered = sourceMovies
                    .filter((movie) => ALLOWED_STATUSES.includes(movie.status))
                    .filter((movie) => activeShowtimeMovieIds.has(movie.id))
                    .filter((movie) => statusFilter === 'ALL' || movie.status === statusFilter)
                    .filter((movie) => {
                        if (!selectedGenreId) return true;

                        if (movie.genreIds?.includes(selectedGenreId)) return true;

                        if (selectedGenreLabel && movie.genreNames?.some((name) => name === selectedGenreLabel)) {
                            return true;
                        }

                        return false;
                    });

                setMovies(filtered);
            } catch (err) {
                console.error('Error fetching movies catalog:', err);
                setError('Không thể tải danh sách phim. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [searchKeyword, selectedGenreId, selectedGenreLabel, statusFilter]);

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const keyword = localSearchInput.trim();
        setSearchKeyword(keyword.length > 0 ? keyword : null);
    };

    const handleStatusChange = (value: MovieStatusFilter) => {
        setStatusFilter(value);

        if (value === 'ALL') {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.delete('status');
                return next;
            });
            return;
        }

        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('status', value);
            return next;
        });
    };

    const handleGenreChange = (genreId: string) => {
        if (!genreId) {
            setSelectedGenre(null, null);
            return;
        }

        const genre = genres.find((item) => item.id === genreId);
        setSelectedGenre(genreId, genre?.name || null);
    };

    return (
        <Box className="page-shell" sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 5 }}>
            <Container maxWidth="lg">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3.5 },
                        mb: 3,
                        border: '1px solid #E5E7EB',
                        borderRadius: 3,
                        background: 'linear-gradient(120deg, #FFFFFF 0%, #F8FAFC 52%, #FFE4E6 100%)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                        <LocalMoviesIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.6rem', md: '2.1rem' } }}>
                            Danh Sách Phim
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Tìm kiếm và lọc phim đang chiếu hoặc sắp chiếu theo nhu cầu của bạn.
                    </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, border: '1px solid #E5E7EB', borderRadius: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <FilterAltIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Bộ lọc phim
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1.4fr' }, gap: 1.5 }}>
                        <FormControl size="small" fullWidth>
                            <Select value={statusFilter} onChange={(event) => handleStatusChange(event.target.value as MovieStatusFilter)}>
                                {STATUS_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <Select value={selectedGenreId || ''} onChange={(event) => handleGenreChange(event.target.value)} displayEmpty>
                                <MenuItem value="">Tất cả thể loại</MenuItem>
                                {genres.map((genre) => (
                                    <MenuItem key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box
                            component="form"
                            onSubmit={handleSearchSubmit}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: 99,
                                px: 1.5,
                                py: 0.4,
                                border: '1px solid #D1D5DB',
                                backgroundColor: '#F9FAFB',
                                '&:focus-within': {
                                    borderColor: 'primary.main',
                                    backgroundColor: alpha('#E50914', 0.03),
                                },
                            }}
                        >
                            <InputBase
                                placeholder="Tìm theo tên phim..."
                                value={localSearchInput}
                                onChange={(event) => setLocalSearchInput(event.target.value)}
                                sx={{ flex: 1, fontSize: '0.92rem' }}
                            />
                            <IconButton type="submit" sx={{ color: 'primary.main', p: 0.6 }}>
                                <SearchIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && error && <Alert severity="error">{error}</Alert>}

                {!loading && !error && movies.length === 0 && (
                    <Alert severity="info">
                        Không có phim phù hợp với bộ lọc hiện tại.
                    </Alert>
                )}

                {!loading && !error && movies.length > 0 && (
                    <Box sx={{ display: 'grid', gap: 1.5 }}>
                        {movies.map((movie) => {
                            const statusTone = getStatusChipColor(movie.status);

                            return (
                                <Paper
                                    key={movie.id}
                                    elevation={0}
                                    sx={{
                                        border: '1px solid #E5E7EB',
                                        borderRadius: 3,
                                        p: 1.5,
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: '120px 1fr auto' },
                                        gap: 2,
                                        alignItems: 'center',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={movie.imageUrl || 'https://via.placeholder.com/120x170?text=No+Image'}
                                        alt={movie.title}
                                        sx={{
                                            width: { xs: '100%', sm: 120 },
                                            height: { xs: 200, sm: 170 },
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                            border: '1px solid #E5E7EB',
                                        }}
                                    />

                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                                            {movie.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.2 }}>
                                            <Chip
                                                label={getStatusLabel(movie.status)}
                                                size="small"
                                                sx={{
                                                    backgroundColor: statusTone.bg,
                                                    color: statusTone.text,
                                                    border: `1px solid ${statusTone.border}`,
                                                    fontWeight: 700,
                                                }}
                                            />
                                            <Chip
                                                label={movie.genreNames?.join(', ') || 'Không rõ thể loại'}
                                                size="small"
                                                sx={{
                                                    backgroundColor: alpha('#E50914', 0.08),
                                                    border: `1px solid ${alpha('#E50914', 0.24)}`,
                                                    color: '#B91C1C',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            Thời lượng: {movie.duration} phút
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Khởi chiếu: {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, gap: 1, minWidth: { sm: 150 } }}>
                                        <Button variant="outlined" onClick={() => navigate(`/movie/${movie.id}`)}>
                                            Xem Chi Tiết
                                        </Button>
                                        <Button variant="contained" onClick={() => navigate(`/movie/${movie.id}/showtimes`)}>
                                            Chọn Lịch Chiếu
                                        </Button>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Box>
                )}
            </Container>
        </Box>
    );
};

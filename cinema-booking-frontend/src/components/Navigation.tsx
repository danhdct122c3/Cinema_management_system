import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem, Avatar, Select, FormControl, InputBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { useGenre } from '../context/GenreContext';
import { useSearch } from '../context/SearchContext';
import { genreService } from '../services/api';
import { Genre } from '../types';
import { useAuth } from '../context/AuthContext';

export const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const { selectedGenreId, setSelectedGenre } = useGenre();
    const { searchKeyword, setSearchKeyword } = useSearch();
    const { isLoggedIn: authLoggedIn, user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        // Fetch genres
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const response = await genreService.getAllGenres();
            setGenres(response.data.result);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const handleGenreChange = (event: any) => {
        const genreId = event.target.value;
        const selectedGenre = genres.find(g => g.id === genreId);
        
        if (!genreId) {
            setSelectedGenre(null, null);
            navigate('/');
        } else {
            setSelectedGenre(genreId, selectedGenre?.name || null);
            navigate('/');
        }
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (searchInput.trim()) {
            setSearchKeyword(searchInput.trim());
            setSelectedGenre(null, null); // Reset genre filter when searching
            navigate('/');
        }
    };

    const handleSearchClear = () => {
        setSearchInput('');
        setSearchKeyword(null);
    };

    const handleLogoClick = () => {
        // Reset all filters and search
        setSelectedGenre(null, null);
        setSearchKeyword(null);
        setSearchInput('');
        navigate('/');
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        navigate('/');
    };

    const getUserInitial = () => {
        const email = user?.email || '';
        return email.charAt(0).toUpperCase();
    };

    return (
        <AppBar position="sticky" elevation={0} sx={{ 
            backgroundColor: '#ffffff',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={handleLogoClick}>
                        <MovieIcon sx={{ fontSize: 32, color: '#ff6b00' }} />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: '#ff6b00',
                                letterSpacing: '0.5px',
                            }}
                        >
                            Cinema Booking
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button
                            sx={{
                                color: 'text.primary',
                                '&:hover': {
                                    color: '#ff6b00',
                                    backgroundColor: 'rgba(255, 107, 0, 0.08)',
                                },
                            }}
                            startIcon={<HomeIcon />}
                            onClick={() => navigate('/')}
                        >
                            Trang Chủ
                        </Button>
                        <Button
                            sx={{
                                color: 'text.primary',
                                '&:hover': {
                                    color: '#ff6b00',
                                    backgroundColor: 'rgba(255, 107, 0, 0.08)',
                                },
                            }}
                            startIcon={<HistoryIcon />}
                            onClick={() => navigate('/booking-history')}
                        >
                            Lịch Sử Đặt Vé
                        </Button>

                        {/* Genre Filter */}
                        <FormControl sx={{ minWidth: 150 }} size="small">
                            <Select
                                value={selectedGenreId || ''}
                                onChange={handleGenreChange}
                                displayEmpty
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#ff6b00',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#ff6b00',
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="">Tất cả thể loại</MenuItem>
                                {genres.map((genre) => (
                                    <MenuItem key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Search Box */}
                        <Box
                            component="form"
                            onSubmit={handleSearchSubmit}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                borderRadius: 1,
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                px: 1.5,
                                py: 0.5,
                                '&:hover': {
                                    borderColor: '#ff6b00',
                                    backgroundColor: 'rgba(255, 107, 0, 0.05)',
                                },
                                '&:focus-within': {
                                    borderColor: '#ff6b00',
                                    backgroundColor: 'rgba(255, 107, 0, 0.02)',
                                },
                                minWidth: 200,
                            }}
                        >
                            <InputBase
                                placeholder="Tìm phim..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                sx={{
                                    flex: 1,
                                    fontSize: '0.875rem',
                                    '& input': {
                                        padding: 0,
                                    },
                                    '& input::placeholder': {
                                        opacity: 0.7,
                                    },
                                }}
                            />
                            <IconButton
                                type="submit"
                                size="small"
                                sx={{
                                    color: '#ff6b00',
                                    p: 0.5,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 107, 0, 0.1)',
                                    },
                                }}
                            >
                                <SearchIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {authLoggedIn ? (
                            <>
                                <IconButton
                                    onClick={handleMenuOpen}
                                    sx={{
                                        ml: 1,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 107, 0, 0.08)',
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 36, 
                                            height: 36, 
                                            bgcolor: '#ff6b00',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {getUserInitial()}
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem disabled>
                                        <Typography variant="body2" color="text.secondary">
                                            {user?.email}
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleMenuClose(); navigate('/booking-history'); }}>
                                        <HistoryIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Lịch sử đặt vé
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Đăng xuất
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    startIcon={<LoginIcon />}
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        borderColor: '#ff6b00',
                                        color: '#ff6b00',
                                        '&:hover': {
                                            borderColor: '#d95a00',
                                            backgroundColor: 'rgba(255, 107, 0, 0.08)',
                                        },
                                    }}
                                >
                                    Đăng Nhập
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        backgroundColor: '#ff6b00',
                                        '&:hover': {
                                            backgroundColor: '#d95a00',
                                        },
                                    }}
                                >
                                    Đăng Ký
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

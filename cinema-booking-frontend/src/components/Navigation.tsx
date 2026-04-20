import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Select,
    FormControl,
    InputBase,
    Drawer,
    useMediaQuery,
    useTheme,
    alpha,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import HistoryIcon from '@mui/icons-material/History';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useGenre } from '../context/GenreContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { genreService } from '../services/api';
import { Genre } from '../types';

export const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Contexts
    const { selectedGenreId, setSelectedGenre } = useGenre();
    const { setSearchKeyword } = useSearch();
    const { isLoggedIn: authLoggedIn, user, logout } = useAuth();

    // States
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [movieMenuAnchorEl, setMovieMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
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
        } else {
            setSelectedGenre(genreId, selectedGenre?.name || null);
        }
        navigate('/movies');
        if (isMobile) {
            setMobileDrawerOpen(false);
        }
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const keyword = searchInput.trim();
        setSearchKeyword(keyword.length > 0 ? keyword : null);
        navigate('/movies');
    };

    const handleLogoClick = () => {
        window.location.href = '/';
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMovieMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMovieMenuAnchorEl(event.currentTarget);
    };

    const handleMovieMenuClose = () => {
        setMovieMenuAnchorEl(null);
    };

    const handleOpenMoviesPage = (status?: 'NOW_SHOWING' | 'COMING_SOON') => {
        if (status) {
            navigate(`/movies?status=${status}`);
        } else {
            navigate('/movies');
        }
        handleMovieMenuClose();
        if (isMobile) {
            setMobileDrawerOpen(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        setMobileDrawerOpen(false);
        navigate('/');
    };

    const getUserInitial = () => {
        const email = user?.email || '';
        return email.charAt(0).toUpperCase();
    };

    const isActivePath = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const navButtonSx = (active: boolean) => ({
        color: active ? 'primary.main' : 'text.primary',
        whiteSpace: 'nowrap',
        borderRadius: 999,
        height: 44,
        px: 2,
        fontWeight: active ? 700 : 600,
        backgroundColor: active ? alpha('#E50914', 0.08) : 'transparent',
        transition: 'all 0.25s ease',
        '&:hover': {
            color: 'primary.main',
            backgroundColor: alpha('#E50914', 0.06),
        },
    });

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #D1D5DB',
            }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr auto', md: '260px minmax(0, 1fr) 260px' },
                        alignItems: 'center',
                        py: { xs: 1, md: 1.3 },
                        minHeight: { xs: 'auto', md: 78 },
                        gap: { xs: 1, md: 2 },
                    }}>
                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', minWidth: { md: 260 }, width: { md: '100%' } }} onClick={handleLogoClick}>
                            <MovieIcon sx={{ fontSize: { xs: 27, sm: 30 }, color: 'primary.main' }} />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 800,
                                    color: 'primary.main',
                                    letterSpacing: '0.3px',
                                    display: { xs: 'none', sm: 'block' },
                                    lineHeight: 1.1,
                                    fontSize: { sm: '1.7rem', md: '1.85rem' },
                                }}
                            >
                                Cinema Booking
                            </Typography>
                        </Box>

                        {/* Desktop Navigation */}
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            px: 1.5,
                            width: '100%',
                        }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    borderRadius: 0,
                                    border: 'none',
                                    px: 0,
                                    py: 0,
                                    width: 'min(100%, 700px)',
                                    minHeight: 46,
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <Button
                                    sx={navButtonSx(isActivePath('/movies'))}
                                    startIcon={<MovieIcon />}
                                    onMouseEnter={handleMovieMenuOpen}
                                    onClick={() => handleOpenMoviesPage()}
                                >
                                    Phim
                                </Button>
                                <Menu
                                    anchorEl={movieMenuAnchorEl}
                                    open={Boolean(movieMenuAnchorEl)}
                                    onClose={handleMovieMenuClose}
                                    MenuListProps={{
                                        onMouseLeave: handleMovieMenuClose,
                                    }}
                                >
                                    <MenuItem onClick={() => handleOpenMoviesPage('NOW_SHOWING')}>
                                        Phim đang chiếu
                                    </MenuItem>
                                    <MenuItem onClick={() => handleOpenMoviesPage('COMING_SOON')}>
                                        Phim sắp chiếu
                                    </MenuItem>
                                </Menu>

                                {/* Genre Filter */}
                                <FormControl sx={{ minWidth: 170 }} size="small">
                                    <Select
                                        value={selectedGenreId || ''}
                                        onChange={handleGenreChange}
                                        displayEmpty
                                        sx={{
                                            height: 44,
                                            backgroundColor: 'transparent',
                                            borderRadius: 999,
                                            '& .MuiSelect-select': {
                                                px: 2,
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                            },
                                            '&:hover': {
                                                backgroundColor: alpha('#E50914', 0.04),
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: alpha('#E50914', 0.04),
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
                                        height: 44,
                                        backgroundColor: 'transparent',
                                        borderRadius: 999,
                                        border: '1px solid transparent',
                                        px: 1.4,
                                        ml: 0,
                                        minWidth: 250,
                                        maxWidth: 320,
                                        '&:hover': {
                                            backgroundColor: alpha('#E50914', 0.02),
                                        },
                                        '&:focus-within': {
                                            borderColor: 'transparent',
                                            backgroundColor: alpha('#E50914', 0.03),
                                        },
                                        width: '100%',
                                    }}
                                >
                                    <InputBase
                                        placeholder="Tìm phim..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        sx={{
                                            flex: 1,
                                            fontSize: '0.875rem',
                                            mr: 0.5,
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
                                            color: 'primary.main',
                                            p: 0.5,
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                    >
                                        <SearchIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>

                        {/* Desktop Auth Button */}
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            minWidth: 260,
                            width: '100%',
                        }}>
                            {authLoggedIn ? (
                                <>
                                    <IconButton onClick={handleMenuOpen} sx={{ border: '1px solid #E5E7EB', p: 0.5 }}>
                                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                                            {getUserInitial()}
                                        </Avatar>
                                    </IconButton>
                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                        <MenuItem disabled>
                                            <Typography variant="body2">{user?.email}</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleMenuClose(); navigate('/booking-history'); }}>
                                            <HistoryIcon sx={{ mr: 1 }} />
                                            Lịch sử đặt vé
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            <LogoutIcon sx={{ mr: 1 }} />
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
                                        sx={{ borderRadius: 999, height: 40, px: 2 }}
                                    >
                                        Đăng Nhập
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<PersonAddIcon />}
                                        onClick={() => navigate('/register')}
                                        sx={{ borderRadius: 999, height: 40, px: 2 }}
                                    >
                                        Đăng Ký
                                    </Button>
                                </>
                            )}
                        </Box>

                        {/* Mobile Menu Button */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
                            <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{ color: 'primary.main' }}>
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>

                    {/* Mobile Search Bar */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, pb: 1 }}>
                        <Box component="form" onSubmit={handleSearchSubmit} sx={{ width: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 99, px: 1.5, py: 0.5 }}>
                            <InputBase placeholder="Tìm phim..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} sx={{ flex: 1 }} />
                            <IconButton type="submit" size="small" sx={{ color: 'primary.main' }}>
                                <SearchIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer anchor="right" open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)}>
                <Box sx={{ width: 280, p: 2, backgroundColor: '#FFFFFF', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: 'primary.main' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Genre Filter */}
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Thể loại</Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <Select value={selectedGenreId || ''} onChange={(e) => { handleGenreChange(e); setMobileDrawerOpen(false); }} displayEmpty>
                            <MenuItem value="">Tất cả thể loại</MenuItem>
                            {genres.map((genre) => <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    {/* Navigation Items */}
                    <MenuItem onClick={() => handleOpenMoviesPage('NOW_SHOWING')} sx={{ mb: 1, borderRadius: 1 }}>
                        <MovieIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography>Phim Đang Chiếu</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleOpenMoviesPage('COMING_SOON')} sx={{ mb: 1, borderRadius: 1 }}>
                        <MovieIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography>Phim Sắp Chiếu</Typography>
                    </MenuItem>

                    <Box sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', my: 2 }} />

                    {/* Auth Section */}
                    {authLoggedIn ? (
                        <>
                            <MenuItem disabled sx={{ mb: 1 }}>
                                <Avatar sx={{ mr: 2, width: 32, height: 32, bgcolor: 'primary.main' }}>{getUserInitial()}</Avatar>
                                <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => { navigate('/booking-history'); setMobileDrawerOpen(false); }} sx={{ mb: 1, borderRadius: 1 }}>
                                <HistoryIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography>Lịch sử đặt vé</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ borderRadius: 1 }}>
                                <LogoutIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography>Đăng xuất</Typography>
                            </MenuItem>
                        </>
                    ) : (
                        <>
                            <Button fullWidth variant="outlined" startIcon={<LoginIcon />} onClick={() => { navigate('/login'); setMobileDrawerOpen(false); }} sx={{ mb: 1 }}>
                                Đăng Nhập
                            </Button>
                            <Button fullWidth variant="contained" startIcon={<PersonAddIcon />} onClick={() => { navigate('/register'); setMobileDrawerOpen(false); }}>
                                Đăng Ký
                            </Button>
                        </>
                    )}
                </Box>
            </Drawer>
        </>
    );
};
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
import HomeIcon from '@mui/icons-material/Home';
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
        navigate('/');
        if (isMobile) {
            setMobileDrawerOpen(false);
        }
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (searchInput.trim()) {
            setSearchKeyword(searchInput.trim());
            setSelectedGenre(null, null);
            navigate('/');
        }
    };

    const handleLogoClick = () => {
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
        px: 2,
        fontWeight: active ? 700 : 600,
        backgroundColor: active ? alpha('#E50914', 0.1) : 'transparent',
        transition: 'all 0.25s ease',
        '&:hover': {
            color: 'primary.main',
            backgroundColor: alpha('#E50914', 0.12),
            transform: 'translateY(-1px)',
        },
    });

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #E5E7EB',
            }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{
                        justifyContent: 'space-between',
                        py: 1,
                        flexWrap: 'wrap',
                        gap: 1,
                    }}>
                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={handleLogoClick}>
                            <MovieIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: 'primary.main' }} />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: 'primary.main',
                                    letterSpacing: '0.5px',
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                Cinema Booking
                            </Typography>
                        </Box>

                        {/* Desktop Navigation */}
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 2,
                            alignItems: 'center',
                            flex: 1,
                            justifyContent: 'center',
                        }}>
                            <Button
                                sx={navButtonSx(isActivePath('/'))}
                                startIcon={<HomeIcon />}
                                onClick={() => navigate('/')}
                            >
                                Trang Chủ
                            </Button>
                            <Button
                                sx={navButtonSx(isActivePath('/booking-history'))}
                                startIcon={<HistoryIcon />}
                                onClick={() => navigate('/booking-history')}
                            >
                                Lịch Sử Đặt Vé
                            </Button>

                            {/* Genre Filter */}
                            <FormControl sx={{ minWidth: 140 }} size="small">
                                <Select
                                    value={selectedGenreId || ''}
                                    onChange={handleGenreChange}
                                    displayEmpty
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#D1D5DB',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'primary.main',
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
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: 99,
                                    border: '1px solid #E5E7EB',
                                    px: 1.5,
                                    py: 0.5,
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: alpha('#E50914', 0.04),
                                    },
                                    '&:focus-within': {
                                        borderColor: 'primary.main',
                                        backgroundColor: alpha('#E50914', 0.03),
                                    },
                                    width: 200,
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
                                        color: 'primary.main',
                                        p: 0.5,
                                        '&:hover': {
                                            backgroundColor: alpha('#E50914', 0.1),
                                        },
                                    }}
                                >
                                    <SearchIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Desktop Auth Button */}
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                        }}>
                            {authLoggedIn ? (
                                <>
                                    <IconButton onClick={handleMenuOpen}>
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
                                    <Button variant="outlined" startIcon={<LoginIcon />} onClick={() => navigate('/login')}>
                                        Đăng Nhập
                                    </Button>
                                    <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => navigate('/register')}>
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
                    <MenuItem onClick={() => { navigate('/'); setMobileDrawerOpen(false); }} sx={{ mb: 1, borderRadius: 1 }}>
                        <HomeIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography>Trang Chủ</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/booking-history'); setMobileDrawerOpen(false); }} sx={{ mb: 1, borderRadius: 1 }}>
                        <HistoryIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography>Lịch Sử Đặt Vé</Typography>
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
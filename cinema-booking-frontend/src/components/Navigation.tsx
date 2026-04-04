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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Contexts
    const { selectedGenreId, setSelectedGenre } = useGenre();
    const { searchKeyword, setSearchKeyword } = useSearch();
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

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        sx={{
                            justifyContent: 'space-between',
                            py: 1,
                            flexWrap: 'wrap',
                            gap: 1,
                        }}
                    >
                        {/* Logo */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                cursor: 'pointer',
                            }}
                            onClick={handleLogoClick}
                        >
                            <MovieIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: '#ff6b00' }} />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: '#ff6b00',
                                    letterSpacing: '0.5px',
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                Cinema Booking
                            </Typography>
                        </Box>

                        {/* Desktop Navigation */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: 2,
                                alignItems: 'center',
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                sx={{
                                    color: 'text.primary',
                                    whiteSpace: 'nowrap',
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
                                    whiteSpace: 'nowrap',
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
                            <FormControl sx={{ minWidth: 140 }} size="small">
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
                        </Box>

                        {/* Desktop Auth Buttons */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: 1,
                                alignItems: 'center',
                            }}
                        >
                            {authLoggedIn ? (
                                <>
                                    <IconButton
                                        onClick={handleMenuOpen}
                                        sx={{
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
                                        <MenuItem
                                            onClick={() => {
                                                handleMenuClose();
                                                navigate('/booking-history');
                                            }}
                                        >
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

                        {/* Mobile Menu Button */}
                        <Box
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                ml: 'auto',
                            }}
                        >
                            <IconButton
                                onClick={() => setMobileDrawerOpen(true)}
                                sx={{
                                    color: '#ff6b00',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 107, 0, 0.08)',
                                    },
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>

                    {/* Mobile Search Bar */}
                    <Box
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            pb: 1,
                        }}
                    >
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
                                width: '100%',
                                '&:hover': {
                                    borderColor: '#ff6b00',
                                    backgroundColor: 'rgba(255, 107, 0, 0.05)',
                                },
                                '&:focus-within': {
                                    borderColor: '#ff6b00',
                                    backgroundColor: 'rgba(255, 107, 0, 0.02)',
                                },
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
                    </Box>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
            >
                <Box sx={{ width: 280, p: 2 }}>
                    {/* Close Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <IconButton
                            onClick={() => setMobileDrawerOpen(false)}
                            sx={{
                                color: '#ff6b00',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Genre Filter in Drawer */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                            Thể loại
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                value={selectedGenreId || ''}
                                onChange={(event) => {
                                    handleGenreChange(event);
                                    setMobileDrawerOpen(false);
                                }}
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
                    </Box>

                    {/* Navigation Menu Items */}
                    <MenuItem
                        onClick={() => {
                            navigate('/');
                            setMobileDrawerOpen(false);
                        }}
                        sx={{ mb: 1, borderRadius: 1 }}
                    >
                        <HomeIcon sx={{ mr: 2, color: '#ff6b00' }} />
                        <Typography>Trang Chủ</Typography>
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            navigate('/booking-history');
                            setMobileDrawerOpen(false);
                        }}
                        sx={{ mb: 1, borderRadius: 1 }}
                    >
                        <HistoryIcon sx={{ mr: 2, color: '#ff6b00' }} />
                        <Typography>Lịch Sử Đặt Vé</Typography>
                    </MenuItem>

                    <Box sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', my: 2 }} />

                    {/* Auth Section in Drawer */}
                    {authLoggedIn ? (
                        <>
                            <MenuItem disabled sx={{ mb: 1 }}>
                                <Avatar
                                    sx={{
                                        mr: 2,
                                        width: 32,
                                        height: 32,
                                        bgcolor: '#ff6b00',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {getUserInitial()}
                                </Avatar>
                                <Typography variant="body2" color="text.secondary">
                                    {user?.email}
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    navigate('/booking-history');
                                    setMobileDrawerOpen(false);
                                }}
                                sx={{ mb: 1, borderRadius: 1 }}
                            >
                                <HistoryIcon sx={{ mr: 2, color: '#ff6b00', fontSize: 20 }} />
                                <Typography>Lịch sử đặt vé</Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleLogout();
                                }}
                                sx={{ borderRadius: 1 }}
                            >
                                <LogoutIcon sx={{ mr: 2, color: '#ff6b00', fontSize: 20 }} />
                                <Typography>Đăng xuất</Typography>
                            </MenuItem>
                        </>
                    ) : (
                        <>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<LoginIcon />}
                                onClick={() => {
                                    navigate('/login');
                                    setMobileDrawerOpen(false);
                                }}
                                sx={{
                                    borderColor: '#ff6b00',
                                    color: '#ff6b00',
                                    mb: 1,
                                    '&:hover': {
                                        borderColor: '#d95a00',
                                        backgroundColor: 'rgba(255, 107, 0, 0.08)',
                                    },
                                }}
                            >
                                Đăng Nhập
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<PersonAddIcon />}
                                onClick={() => {
                                    navigate('/register');
                                    setMobileDrawerOpen(false);
                                }}
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
            </Drawer>
        </>
    );
};
                                        },
                                    }}
                                >
                                    Đăng Ký
                                </Button>
                            </>
                        )}
=======
>>>>>>> main
                    </Box>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
            >
                <Box sx={{ width: 280, p: 2 }}>
                    {/* Close Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <IconButton
                            onClick={() => setMobileDrawerOpen(false)}
                            sx={{
                                color: '#ff6b00',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Genre Filter in Drawer */}
                    <FormControl fullWidth sx={{ mb: 2 }} size="small">
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                            Thể loại
                        </Typography>
                        <Select
                            value={selectedGenreId || ''}
                            onChange={(event) => {
                                handleGenreChange(event);
                                setMobileDrawerOpen(false);
                            }}
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

                    {/* Navigation Menu Items */}
                    <MenuItem
                        onClick={() => {
                            navigate('/');
                            setMobileDrawerOpen(false);
                        }}
                        sx={{ mb: 1, borderRadius: 1, display: 'none' }}
                    >
                        <HomeIcon sx={{ mr: 2, color: '#ff6b00' }} />
                        <Typography>Trang Chủ</Typography>
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            navigate('/booking-history');
                            setMobileDrawerOpen(false);
                        }}
                        sx={{ mb: 1, borderRadius: 1, display: 'none' }}
                    >
                        <HistoryIcon sx={{ mr: 2, color: '#ff6b00' }} />
                        <Typography>Lịch Sử Đặt Vé</Typography>
                    </MenuItem>

                    <Box sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', my: 2 }} />

                    {/* Auth Buttons in Drawer */}
                    {isLoggedIn ? (
                        <>
                            <MenuItem disabled sx={{ mb: 1 }}>
                                <Avatar 
                                    sx={{ 
                                        mr: 2,
                                        width: 32, 
                                        height: 32, 
                                        bgcolor: '#ff6b00',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {getUserInitial()}
                                </Avatar>
                                <Typography variant="body2" color="text.secondary">
                                    {userEmail}
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    navigate('/booking-history');
                                    setMobileDrawerOpen(false);
                                }}
                                sx={{ mb: 1, borderRadius: 1 }}
                            >
                                <HistoryIcon sx={{ mr: 2, color: '#ff6b00', fontSize: 20 }} />
                                <Typography>Lịch sử đặt vé</Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleLogout();
                                    setMobileDrawerOpen(false);
                                }}
                                sx={{ borderRadius: 1 }}
                            >
                                <LogoutIcon sx={{ mr: 2, color: '#ff6b00', fontSize: 20 }} />
                                <Typography>Đăng xuất</Typography>
                            </MenuItem>
                        </>
                    ) : (
                        <>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<LoginIcon />}
                                onClick={() => {
                                    navigate('/login');
                                    setMobileDrawerOpen(false);
                                }}
                                sx={{
                                    borderColor: '#ff6b00',
                                    color: '#ff6b00',
                                    mb: 1,
                                    '&:hover': {
                                        borderColor: '#d95a00',
                                        backgroundColor: 'rgba(255, 107, 0, 0.08)',
                                    },
                                }}
                            >
                                Đăng Nhập
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<PersonAddIcon />}
                                onClick={() => {
                                    navigate('/register');
                                    setMobileDrawerOpen(false);
                                }}
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
            </Drawer>
        </>
    );
};

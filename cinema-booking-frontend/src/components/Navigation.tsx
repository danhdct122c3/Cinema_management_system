import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

export const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // Check login status
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const email = localStorage.getItem('userEmail') || '';
        setIsLoggedIn(loggedIn);
        setUserEmail(email);
    }, []);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
        setUserEmail('');
        handleMenuClose();
        navigate('/');
    };

    const getUserInitial = () => {
        return userEmail.charAt(0).toUpperCase();
    };

    return (
        <AppBar position="sticky" elevation={0} sx={{ 
            backgroundColor: '#ffffff',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
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

                        {isLoggedIn ? (
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
                                            {userEmail}
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

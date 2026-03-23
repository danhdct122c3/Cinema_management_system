import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText, ListItemButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MovieIcon from '@mui/icons-material/Movie';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ChairIcon from '@mui/icons-material/Chair';

const drawerWidth = 260;

interface MenuItem {
    text: string;
    icon: JSX.Element;
    path: string;
}

const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Quản lý Phim', icon: <MovieIcon />, path: '/admin/movies' },
    { text: 'Phòng Chiếu', icon: <ChairIcon />, path: '/admin/rooms' },
    { text: 'Suất Chiếu', icon: <EventIcon />, path: '/admin/screenings' },
    { text: 'Đặt Vé', icon: <ConfirmationNumberIcon />, path: '/admin/bookings' },
];

export const AdminLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        handleMenuClose();
        navigate('/');
    };

    const drawer = (
        <Box>
            <Box
                sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        Admin Panel
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Cinema Management
                    </Typography>
                </Box>
            </Box>
            <Divider />
            <List sx={{ px: 2, py: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.text}
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                backgroundColor: isActive ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                                color: isActive ? '#ff6b00' : 'text.primary',
                                '&:hover': {
                                    backgroundColor: isActive ? 'rgba(255, 107, 0, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: isActive ? '#ff6b00' : 'inherit', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontWeight: isActive ? 600 : 400,
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
            <Divider />
            <List sx={{ px: 2, py: 2 }}>
                <ListItemButton
                    onClick={() => navigate('/')}
                    sx={{
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Về Trang Chủ" />
                </ListItemButton>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: 'white',
                    color: 'text.primary',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        Quản Trị Hệ Thống
                    </Typography>
                    <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                        <Avatar sx={{ bgcolor: '#ff6b00' }}>A</Avatar>
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
                                admin@cinema.vn
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                            Đăng xuất
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

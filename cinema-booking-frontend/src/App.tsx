import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { MovieList } from './pages/MovieList';
import { MoviesCatalog } from './pages/MoviesCatalog';
import { MovieDetail } from './pages/MovieDetail';
import { ScreeningList } from './pages/ScreeningList';
import { SeatSelection } from './pages/SeatSelection';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { BookingHistory } from './pages/BookingHistory';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Navigation } from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import { GenreProvider } from './context/GenreContext';
import { SearchProvider } from './context/SearchContext';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminMovies } from './pages/AdminMovies';
import { AdminRooms } from './pages/AdminRooms';
import { AdminScreenings } from './pages/AdminScreenings';
import { AdminBookings } from './pages/AdminBookings';
import { AdminUsers } from './pages/AdminUsers';
import { AdminRoles } from './pages/AdminRoles';
import { AdminPermissions } from './pages/AdminPermissions';
import { AdminLogin } from './pages/AdminLogin';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AUTH_TOKEN_CLEARED_EVENT, holdService } from './services/api';
import { CROSS_TAB_HOLD_RELEASE_KEY, type CrossTabHoldReleasePayload } from './constants/seatHold';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#E50914',
            light: '#F43F5E',
            dark: '#B91C1C',
            contrastText: '#fff',
        },
        secondary: {
            main: '#111827',
            light: '#1F2937',
            dark: '#030712',
        },
        background: {
            default: '#F3F4F6',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#111827',
            secondary: '#6B7280',
        },
    },
    typography: {
        fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
        },
        h2: {
            fontWeight: 800,
        },
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 700,
        },
        button: {
            fontWeight: 700,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 14,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#F3F4F6',
                    color: '#111827',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 20px',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px -12px rgba(0, 0, 0, 0.35)',
                    },
                    '&:active': {
                        transform: 'scale(0.95)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(12px)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 16,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 12px -6px rgba(0, 0, 0, 0.18)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 14px 30px -14px rgba(0, 0, 0, 0.26)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

function App() {
    const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);
    const [sessionExpiredMessage, setSessionExpiredMessage] = useState('Bạn đã hết phiên đăng nhập. Vui lòng đăng nhập lại.');
    const lastNoticeAtRef = useRef(0);

    useEffect(() => {
        const handleTokenCleared = (event: Event) => {
            const customEvent = event as CustomEvent<{ tokenKey?: string; reason?: string }>;
            const reason = customEvent.detail?.reason;
            const refreshFailureReasons = ['refresh-failed', 'empty-refresh-token', 'missing-token-before-refresh'];

            if (reason && !refreshFailureReasons.includes(reason)) {
                return;
            }

            const now = Date.now();
            if (now - lastNoticeAtRef.current < 1200) {
                return;
            }

            lastNoticeAtRef.current = now;
            const isAdminSession = customEvent.detail?.tokenKey === 'adminAccessToken';
            setSessionExpiredMessage(
                isAdminSession
                    ? 'Bạn đã hết phiên đăng nhập quản trị. Vui lòng đăng nhập lại.'
                    : 'Bạn đã hết phiên đăng nhập. Vui lòng đăng nhập lại.'
            );
            setSessionExpiredOpen(true);
        };

        window.addEventListener(AUTH_TOKEN_CLEARED_EVENT, handleTokenCleared);
        return () => {
            window.removeEventListener(AUTH_TOKEN_CLEARED_EVENT, handleTokenCleared);
        };
    }, []);

    useEffect(() => {
        const handleCrossTabHoldRelease = (event: StorageEvent) => {
            if (event.key !== CROSS_TAB_HOLD_RELEASE_KEY || !event.newValue) {
                return;
            }

            try {
                const payload = JSON.parse(event.newValue) as CrossTabHoldReleasePayload;
                if (!Array.isArray(payload.seatShowTimeIds) || payload.seatShowTimeIds.length === 0) {
                    return;
                }

                holdService.releaseHold(payload.seatShowTimeIds).catch((err) => {
                    console.warn('Cross-tab hold release request failed:', err);
                });
            } catch (err) {
                console.warn('Invalid cross-tab hold release payload:', err);
            }
        };

        window.addEventListener('storage', handleCrossTabHoldRelease);
        return () => {
            window.removeEventListener('storage', handleCrossTabHoldRelease);
        };
    }, []);

    return (
        <AuthProvider>
            <AdminAuthProvider>
                <GenreProvider>
                    <SearchProvider>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <Router>
                                <Routes>
                                    {/* Auth routes - no navigation */}
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />

                                    {/* Admin auth route */}
                                    <Route path="/admin/login" element={<AdminLogin />} />

                                    {/* Admin routes - with admin layout */}
                                    <Route path="/admin" element={<AdminLayout />}>
                                        <Route index element={<AdminDashboard />} />
                                        <Route path="movies" element={<AdminMovies />} />
                                        <Route path="rooms" element={<AdminRooms />} />
                                        <Route path="screenings" element={<AdminScreenings />} />
                                        <Route path="bookings" element={<AdminBookings />} />
                                        <Route path="users" element={<AdminUsers />} />
                                        <Route path="roles" element={<AdminRoles />} />
                                        <Route path="permissions" element={<AdminPermissions />} />
                                    </Route>

                                    {/* Main routes - with navigation */}
                                    <Route path="*" element={
                                        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                                            <Navigation />
                                            <Routes>
                                                <Route path="/" element={<MovieList />} />
                                                <Route path="/movies" element={<MoviesCatalog />} />
                                                <Route path="/movie/:id" element={<MovieDetail />} />
                                                <Route path="/movie/:movieId/showtimes" element={<ScreeningList />} />
                                                <Route path="/movie/:movieId/showtime/:showtimeId/seats" element={<SeatSelection />} />
                                                <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                                                <Route path="/booking-history" element={<BookingHistory />} />
                                            </Routes>
                                        </Box>
                                    } />
                                </Routes>
                                <Snackbar
                                    open={sessionExpiredOpen}
                                    autoHideDuration={4500}
                                    onClose={() => setSessionExpiredOpen(false)}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                >
                                    <Alert
                                        onClose={() => setSessionExpiredOpen(false)}
                                        severity="warning"
                                        sx={{ width: '100%' }}
                                    >
                                        {sessionExpiredMessage}
                                    </Alert>
                                </Snackbar>
                            </Router>
                        </ThemeProvider>
                    </SearchProvider>
                </GenreProvider>
            </AdminAuthProvider>
        </AuthProvider>
    );
}

export default App;
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { movieService, showtimeService } from '../services/api';
import { Movie, ShowTimeResponse } from '../types';
import axios from 'axios';

interface Room {
    id: string;
    roomName: string;
}

const API_BASE_URL = 'http://localhost:8080/home';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export const AdminScreenings: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);

    // Showtime Management
    const [showtimes, setShowtimes] = useState<ShowTimeResponse[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [openShowtimeDialog, setOpenShowtimeDialog] = useState(false);
    const [loadingShowtimes, setLoadingShowtimes] = useState(true);
    const [errorShowtime, setErrorShowtime] = useState('');
    const [successShowtime, setSuccessShowtime] = useState('');
    const [showtimeFormData, setShowtimeFormData] = useState({
        movieId: '',
        roomId: '',
        startTime: '',
        endTime: '',
    });

    // Seat Price Management
    const [selectedShowtime, setSelectedShowtime] = useState<ShowTimeResponse | null>(null);
    const [openPriceDialog, setOpenPriceDialog] = useState(false);
    const [priceFormData, setPriceFormData] = useState({
        normalPrice: 150000,
        vipPrice: 200000,
    });
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [errorPrice, setErrorPrice] = useState('');
    const [successPrice, setSuccessPrice] = useState('');

    // Load initial data
    useEffect(() => {
        fetchShowtimes();
        fetchMovies();
        fetchRooms();
    }, []);

    const fetchShowtimes = async () => {
        try {
            setLoadingShowtimes(true);
            const response = await showtimeService.getAllShowtimes();
            setShowtimes(response.data.result || []);
            setErrorShowtime('');
        } catch (error) {
            console.error('Error fetching showtimes:', error);
            setErrorShowtime('Không thể tải danh sách suất chiếu');
        } finally {
            setLoadingShowtimes(false);
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await movieService.getAllMovies();
            setMovies(response.data.result || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/rooms`);
            setRooms(response.data.result || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    // Showtime Dialog
    const handleOpenShowtimeDialog = () => {
        setShowtimeFormData({
            movieId: '',
            roomId: '',
            startTime: '',
            endTime: '',
        });
        setErrorShowtime('');
        setSuccessShowtime('');
        setOpenShowtimeDialog(true);
    };

    const handleCloseShowtimeDialog = () => {
        setOpenShowtimeDialog(false);
    };

    const handleShowtimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShowtimeFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateShowtime = async () => {
        try {
            setLoadingShowtimes(true);
            setErrorShowtime('');

            if (!showtimeFormData.movieId || !showtimeFormData.roomId) {
                setErrorShowtime('Vui lòng chọn phim và phòng chiếu');
                return;
            }

            if (!showtimeFormData.startTime || !showtimeFormData.endTime) {
                setErrorShowtime('Vui lòng nhập thời gian bắt đầu và kết thúc');
                return;
            }

            const response = await showtimeService.createShowtime({
                movieId: showtimeFormData.movieId,
                roomId: showtimeFormData.roomId,
                startTime: new Date(showtimeFormData.startTime).toISOString(),
                endTime: new Date(showtimeFormData.endTime).toISOString(),
            } as any);

            if (response.data.result) {
                setSuccessShowtime('Tạo suất chiếu thành công!');
                handleCloseShowtimeDialog();
                fetchShowtimes();
                setTimeout(() => setSuccessShowtime(''), 3000);
            }
        } catch (error: any) {
            console.error('Error creating showtime:', error);
            setErrorShowtime(
                error.response?.data?.message || 'Lỗi khi tạo suất chiếu'
            );
        } finally {
            setLoadingShowtimes(false);
        }
    };

    // Price Dialog
    const handleOpenPriceDialog = async (showtime: ShowTimeResponse) => {
        try {
            setSelectedShowtime(showtime);
            setErrorPrice('');
            setSuccessPrice('');
            
            // Fetch current seat prices from database
            const response = await showtimeService.getSeatsByShowtime(showtime.id);
            const seats = response.data.result || [];
            
            // Get current prices by seat type
            const normalSeat = seats.find(s => s.seatType === 'NORMAL');
            const vipSeat = seats.find(s => s.seatType === 'VIP');
            
            setPriceFormData({
                normalPrice: normalSeat?.price || 150000,
                vipPrice: vipSeat?.price || 200000,
            });
            
            setOpenPriceDialog(true);
        } catch (error) {
            console.error('Error fetching seat prices:', error);
            setPriceFormData({
                normalPrice: 150000,
                vipPrice: 200000,
            });
            setOpenPriceDialog(true);
        }
    };

    const handleClosePriceDialog = () => {
        setOpenPriceDialog(false);
        setSelectedShowtime(null);
    };

    const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPriceFormData(prev => ({
            ...prev,
            [name]: parseInt(value) || 0,
        }));
    };

    const handleUpdatePrice = async () => {
        try {
            setLoadingPrice(true);
            setErrorPrice('');

            if (priceFormData.normalPrice <= 0 || priceFormData.vipPrice <= 0) {
                setErrorPrice('Giá ghế phải lớn hơn 0');
                setLoadingPrice(false);
                return;
            }

            if (!selectedShowtime) return;

            // Update NORMAL price
            await showtimeService.updateSeatPrice(
                selectedShowtime.id,
                'NORMAL',
                priceFormData.normalPrice
            );

            // Update VIP price
            await showtimeService.updateSeatPrice(
                selectedShowtime.id,
                'VIP',
                priceFormData.vipPrice
            );

            setSuccessPrice(`Cập nhật giá ghế thành công!`);
            setTimeout(() => {
                handleClosePriceDialog();
                setSuccessPrice('');
            }, 1500);
        } catch (error: any) {
            console.error('Error updating price:', error);
            setErrorPrice(
                error.response?.data?.message || 'Lỗi khi cập nhật giá'
            );
        } finally {
            setLoadingPrice(false);
        }
    };

    const getMovieTitle = (movieId: string) => {
        return movies.find(m => m.id === movieId)?.title || movieId;
    };

    const getRoomName = (roomId: string) => {
        return rooms.find(r => r.id === roomId)?.roomName || roomId;
    };

    return (
        <Box sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>
                    🎬 Quản Lý Suất Chiếu & Giá Ghế
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
                <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)}>
                    <Tab label="📽️ Suất Chiếu" />
                    <Tab label="💺 Giá Ghế" />
                </Tabs>

                {/* Tab 1: Showtimes */}
                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ px: 3, pb: 3 }}>
                        {successShowtime && (
                            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                {successShowtime}
                            </Alert>
                        )}
                        {errorShowtime && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {errorShowtime}
                            </Alert>
                        )}

                        <Box sx={{ mb: 3 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenShowtimeDialog}
                                sx={{
                                    background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                }}
                            >
                                Tạo Suất Chiếu
                            </Button>
                        </Box>

                        {loadingShowtimes ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                                            <TableCell sx={{ fontWeight: 700 }}>Phim</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Phòng</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Thời Gian</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {showtimes.map((showtime) => (
                                            <TableRow key={showtime.id}>
                                                <TableCell>{getMovieTitle(showtime.movieId)}</TableCell>
                                                <TableCell>{getRoomName(showtime.roomId)}</TableCell>
                                                <TableCell>
                                                    {new Date(showtime.startTime).toLocaleString('vi-VN')}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={showtime.status === 'ACTIVE' ? 'Hoạt Động' : 'Đã Hủy'}
                                                        size="small"
                                                        color={showtime.status === 'ACTIVE' ? 'success' : 'error'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenPriceDialog(showtime)}
                                                        title="Cập nhật giá"
                                                        sx={{ color: '#ff6b00' }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </TabPanel>

                {/* Tab 2: Seat Prices */}
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ px: 3, pb: 3 }}>
                        {successPrice && (
                            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                {successPrice}
                            </Alert>
                        )}
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            💡 Chọn suất chiếu từ tab "Suất Chiếu" ở trên để cập nhật giá ghế
                        </Typography>
                    </Box>
                </TabPanel>
            </Paper>

            {/* Create Showtime Dialog */}
            <Dialog open={openShowtimeDialog} onClose={handleCloseShowtimeDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
                    Tạo Suất Chiếu
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            select
                            label="Phim"
                            name="movieId"
                            value={showtimeFormData.movieId}
                            onChange={handleShowtimeInputChange as any}
                            fullWidth
                            disabled={loadingShowtimes}
                        >
                            {movies.map(movie => (
                                <MenuItem key={movie.id} value={movie.id}>
                                    {movie.title}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Phòng Chiếu"
                            name="roomId"
                            value={showtimeFormData.roomId}
                            onChange={handleShowtimeInputChange as any}
                            fullWidth
                            disabled={loadingShowtimes}
                        >
                            {rooms.map(room => (
                                <MenuItem key={room.id} value={room.id}>
                                    {room.roomName}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            type="datetime-local"
                            label="Thời Gian Bắt Đầu"
                            name="startTime"
                            value={showtimeFormData.startTime}
                            onChange={handleShowtimeInputChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            disabled={loadingShowtimes}
                        />

                        <TextField
                            type="datetime-local"
                            label="Thời Gian Kết Thúc"
                            name="endTime"
                            value={showtimeFormData.endTime}
                            onChange={handleShowtimeInputChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            disabled={loadingShowtimes}
                        />

                        {errorShowtime && (
                            <Alert severity="error">{errorShowtime}</Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={handleCloseShowtimeDialog} disabled={loadingShowtimes}>
                        Huỷ
                    </Button>
                    <Button
                        onClick={handleCreateShowtime}
                        variant="contained"
                        disabled={loadingShowtimes}
                        sx={{
                            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
                            textTransform: 'none',
                        }}
                    >
                        {loadingShowtimes ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                        Tạo
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Price Dialog */}
            <Dialog open={openPriceDialog} onClose={handleClosePriceDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
                    Cập Nhật Giá Ghế
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedShowtime && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Phim:</strong> {getMovieTitle(selectedShowtime.movieId)}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Thời Gian:</strong> {new Date(selectedShowtime.startTime).toLocaleString('vi-VN')}
                                </Typography>
                            </Paper>

                            <TextField
                                label="Giá Ghế NORMAL"
                                name="normalPrice"
                                type="number"
                                value={priceFormData.normalPrice}
                                onChange={handlePriceInputChange}
                                inputProps={{ step: 10000, min: 0 }}
                                fullWidth
                                disabled={loadingPrice}
                            />

                            <TextField
                                label="Giá Ghế VIP"
                                name="vipPrice"
                                type="number"
                                value={priceFormData.vipPrice}
                                onChange={handlePriceInputChange}
                                inputProps={{ step: 10000, min: 0 }}
                                fullWidth
                                disabled={loadingPrice}
                            />

                            {errorPrice && (
                                <Alert severity="error">{errorPrice}</Alert>
                            )}

                            {successPrice && (
                                <Alert severity="success">{successPrice}</Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={handleClosePriceDialog} disabled={loadingPrice}>
                        Huỷ
                    </Button>
                    <Button
                        onClick={handleUpdatePrice}
                        variant="contained"
                        disabled={loadingPrice}
                        sx={{
                            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
                            textTransform: 'none',
                            px: 3,
                            fontWeight: 600,
                        }}
                    >
                        {loadingPrice ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                        Cập Nhật Giá
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

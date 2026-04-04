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
import { movieService, screeningService } from '../services/api';
import { Movie, Screening } from '../types';
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

    // Screening Management
    const [screenings, setScreenings] = useState<Screening[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingScreening, setEditingScreening] = useState<Screening | null>(null);
    const [loadingScreenings, setLoadingScreenings] = useState(true);
    const [errorScreening, setErrorScreening] = useState('');
    const [successScreening, setSuccessScreening] = useState('');
    const [formData, setFormData] = useState({
        movieId: '',
        roomId: '',
        startTime: '',
        endTime: '',
    });

    // Seat Price Management
    const [openPriceDialog, setOpenPriceDialog] = useState(false);
    const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null);
    const [priceFormData, setPriceFormData] = useState({
        normalPrice: 150000,
        vipPrice: 200000,
    });
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [errorPrice, setErrorPrice] = useState('');
    const [successPrice, setSuccessPrice] = useState('');

    // Load initial data
    useEffect(() => {
        fetchScreenings();
        fetchMovies();
        fetchRooms();
    }, []);

    const fetchScreenings = async () => {
        try {
            setLoadingScreenings(true);
            const response = await screeningService.getAllScreenings();
            setScreenings(response.data.result || []);
            setErrorScreening('');
        } catch (error) {
            console.error('Error fetching screenings:', error);
            setErrorScreening('Không thể tải danh sách suất chiếu');
        } finally {
            setLoadingScreenings(false);
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

    // Screening Dialog
    const handleOpenDialog = (screening?: Screening) => {
        if (screening) {
            setEditingScreening(screening);
            setFormData({
                movieId: screening.movieId || screening.movie?.id,
                roomId: screening.roomId || 'Room 1',
                startTime: new Date(screening.screeningTime).toISOString().slice(0, 16),
                endTime: '',
            });
        } else {
            setEditingScreening(null);
            setFormData({
                movieId: '',
                roomId: '',
                startTime: '',
                endTime: '',
            });
        }
        setErrorScreening('');
        setSuccessScreening('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingScreening(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoadingScreenings(true);
            setErrorScreening('');

            if (!formData.movieId || !formData.roomId) {
                setErrorScreening('Vui lòng chọn phim và phòng chiếu');
                setLoadingScreenings(false);
                return;
            }

            if (!formData.startTime || !formData.endTime) {
                setErrorScreening('Vui lòng nhập thời gian bắt đầu và kết thúc');
                setLoadingScreenings(false);
                return;
            }

            if (editingScreening) {
                // TODO: Implement update API call
                console.log('Updating screening:', formData);
                setSuccessScreening('Cập nhật suất chiếu thành công!');
            } else {
                // TODO: Implement create API call
                console.log('Creating screening:', formData);
                setSuccessScreening('Tạo suất chiếu thành công!');
            }

            handleCloseDialog();
            fetchScreenings();
            setTimeout(() => setSuccessScreening(''), 3000);
        } catch (error: any) {
            console.error('Error submitting screening:', error);
            setErrorScreening(
                error.response?.data?.message || 'Lỗi khi xử lý suất chiếu'
            );
        } finally {
            setLoadingScreenings(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // TODO: Implement delete API call
            console.log('Deleting screening:', id);
            setSuccessScreening('Xóa suất chiếu thành công!');
            fetchScreenings();
            setTimeout(() => setSuccessScreening(''), 3000);
        } catch (error: any) {
            console.error('Error deleting screening:', error);
            setErrorScreening('Lỗi khi xóa suất chiếu');
        }
    };

    // Price Dialog
    const handleOpenPriceDialog = async (screening: Screening) => {
        try {
            setSelectedScreening(screening);
            setErrorPrice('');
            setSuccessPrice('');

            // TODO: Fetch current seat prices from API
            setPriceFormData({
                normalPrice: 150000,
                vipPrice: 200000,
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
        setSelectedScreening(null);
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

            if (!selectedScreening) return;

            // TODO: Implement update price API call
            console.log('Updating prices:', priceFormData);

            setSuccessPrice('Cập nhật giá ghế thành công!');
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

            {successScreening && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    {successScreening}
                </Alert>
            )}
            {errorScreening && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {errorScreening}
                </Alert>
            )}

            <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
                <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)}>
                    <Tab label="📽️ Suất Chiếu" />
                    <Tab label="💺 Giá Ghế" />
                </Tabs>

                {/* Tab 1: Screenings */}
                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ px: 3, pb: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog()}
                                sx={{
                                    background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #ff5500 0%, #ff7700 100%)',
                                    },
                                }}
                            >
                                Thêm Suất Chiếu
                            </Button>
                        </Box>

                        {loadingScreenings ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0, 0, 0, 0.08)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                                            <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Phim</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Phòng Chiếu</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Thời Gian Chiếu</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Ghế Trống</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {screenings.map((screening) => (
                                            <TableRow
                                                key={screening.id}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                    },
                                                }}
                                            >
                                                <TableCell>{screening.id}</TableCell>
                                                <TableCell>
                                                    <Typography fontWeight={600}>{screening.movie?.title || getMovieTitle(screening.movieId)}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getRoomName(screening.roomId)}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                            color: '#2196f3',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(screening.screeningTime).toLocaleString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={`${screening.availableSeats || 0} ghế`}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor:
                                                                (screening.availableSeats || 0) > 20
                                                                    ? 'rgba(76, 175, 80, 0.1)'
                                                                    : 'rgba(255, 193, 7, 0.1)',
                                                            color: (screening.availableSeats || 0) > 20 ? '#4caf50' : '#ffc107',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenDialog(screening)}
                                                        sx={{ color: '#2196f3' }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(screening.id)}
                                                        sx={{ color: '#f44336' }}
                                                    >
                                                        <DeleteIcon />
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

            {/* Create/Edit Screening Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
                    {editingScreening ? 'Chỉnh Sửa Suất Chiếu' : 'Thêm Suất Chiếu Mới'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            select
                            label="Chọn Phim"
                            name="movieId"
                            value={formData.movieId}
                            onChange={handleInputChange as any}
                            fullWidth
                            disabled={loadingScreenings}
                            required
                        >
                            {movies.map((movie) => (
                                <MenuItem key={movie.id} value={movie.id}>
                                    {movie.title}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Phòng Chiếu"
                            name="roomId"
                            value={formData.roomId}
                            onChange={handleInputChange as any}
                            fullWidth
                            disabled={loadingScreenings}
                            required
                        >
                            {rooms.map((room) => (
                                <MenuItem key={room.id} value={room.id}>
                                    {room.roomName}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            type="datetime-local"
                            label="Thời Gian Bắt Đầu"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            disabled={loadingScreenings}
                            required
                        />

                        <TextField
                            type="datetime-local"
                            label="Thời Gian Kết Thúc"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            disabled={loadingScreenings}
                            required
                        />

                        {errorScreening && (
                            <Alert severity="error">{errorScreening}</Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} disabled={loadingScreenings} sx={{ textTransform: 'none' }}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loadingScreenings}
                        sx={{
                            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
                            textTransform: 'none',
                            px: 3,
                            fontWeight: 600,
                        }}
                    >
                        {loadingScreenings ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                        {editingScreening ? 'Cập Nhật' : 'Thêm Mới'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Price Dialog */}
            <Dialog open={openPriceDialog} onClose={handleClosePriceDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
                    Cập Nhật Giá Ghế
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedScreening && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Phim:</strong> {selectedScreening.movie?.title || getMovieTitle(selectedScreening.movieId)}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Thời Gian:</strong> {new Date(selectedScreening.screeningTime).toLocaleString('vi-VN')}
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
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { movieService, screeningService } from '../services/api';
import { Movie, Screening } from '../types';

export const AdminScreenings: React.FC = () => {
    const [screenings, setScreenings] = useState<Screening[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingScreening, setEditingScreening] = useState<Screening | null>(null);
    const [formData, setFormData] = useState({
        movieId: '',
        startTime: '',
        endTime: '',
        roomNumber: '',
    });

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await movieService.getAllMovies();
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const handleOpenDialog = (screening?: Screening) => {
        if (screening) {
            setEditingScreening(screening);
            setFormData({
                movieId: screening.movie.id.toString(),
                startTime: new Date(screening.screeningTime).toISOString().slice(0, 16),
                endTime: '',
                roomNumber: 'Room 1',
            });
        } else {
            setEditingScreening(null);
            setFormData({
                movieId: '',
                startTime: '',
                endTime: '',
                roomNumber: 'Room 1',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingScreening(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        // TODO: Implement API call to create/update screening
        console.log('Submitting:', formData);
        handleCloseDialog();
    };

    const handleDelete = (id: number) => {
        // TODO: Implement API call to delete screening
        console.log('Deleting screening:', id);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>
                    Quản Lý Suất Chiếu
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #ff5500 0%, #ff7700 100%)',
                        },
                    }}
                >
                    Thêm Suất Chiếu
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                            <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Phim</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Phòng Chiếu</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Thời Gian Chiếu</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Ghế Trống</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                                Thao Tác
                            </TableCell>
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
                                    <Typography fontWeight={600}>{screening.movie.title}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label="Room 1"
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
                                        label={`${screening.availableSeats} ghế`}
                                        size="small"
                                        sx={{
                                            backgroundColor:
                                                screening.availableSeats > 20
                                                    ? 'rgba(76, 175, 80, 0.1)'
                                                    : 'rgba(255, 193, 7, 0.1)',
                                            color: screening.availableSeats > 20 ? '#4caf50' : '#ffc107',
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

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
                    {editingScreening ? 'Chỉnh Sửa Suất Chiếu' : 'Thêm Suất Chiếu Mới'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            select
                            label="Chọn Phim"
                            name="movieId"
                            value={formData.movieId}
                            onChange={handleInputChange}
                            required
                        >
                            {movies.map((movie) => (
                                <MenuItem key={movie.id} value={movie.id}>
                                    {movie.title}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            select
                            label="Phòng Chiếu"
                            name="roomNumber"
                            value={formData.roomNumber}
                            onChange={handleInputChange}
                            required
                        >
                            <MenuItem value="Room 1">Room 1</MenuItem>
                            <MenuItem value="Room 2">Room 2</MenuItem>
                            <MenuItem value="Room 3">Room 3</MenuItem>
                            <MenuItem value="Room 4">Room 4</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            label="Thời Gian Chiếu"
                            name="startTime"
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
                            textTransform: 'none',
                            px: 3,
                            fontWeight: 600,
                        }}
                    >
                        {editingScreening ? 'Cập Nhật' : 'Thêm Mới'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

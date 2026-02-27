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
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { movieService } from '../services/api';
import { Movie } from '../types';

export const AdminMovies: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        genre: '',
        releaseDate: '',
        imageUrl: '',
        ticketPrice: '',
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

    const handleOpenDialog = (movie?: Movie) => {
        if (movie) {
            setEditingMovie(movie);
            setFormData({
                title: movie.title,
                description: movie.description,
                duration: movie.duration.toString(),
                genre: movie.genre,
                releaseDate: movie.releaseDate,
                imageUrl: movie.imageUrl,
                ticketPrice: movie.ticketPrice.toString(),
            });
        } else {
            setEditingMovie(null);
            setFormData({
                title: '',
                description: '',
                duration: '',
                genre: '',
                releaseDate: '',
                imageUrl: '',
                ticketPrice: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingMovie(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        // TODO: Implement API call to create/update movie
        console.log('Submitting:', formData);
        handleCloseDialog();
        // fetchMovies(); // Refresh list after save
    };

    const handleDelete = (id: number) => {
        // TODO: Implement API call to delete movie
        console.log('Deleting movie:', id);
        // fetchMovies(); // Refresh list after delete
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>
                    Quản Lý Phim
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
                    Thêm Phim Mới
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
                            <TableCell sx={{ fontWeight: 700 }}>Hình Ảnh</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Tên Phim</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Thể Loại</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Thời Lượng</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Giá Vé</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Ngày Khởi Chiếu</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                                Thao Tác
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movies.map((movie) => (
                            <TableRow
                                key={movie.id}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                    },
                                }}
                            >
                                <TableCell>{movie.id}</TableCell>
                                <TableCell>
                                    <img
                                        src={movie.imageUrl}
                                        alt={movie.title}
                                        style={{
                                            width: 60,
                                            height: 90,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography fontWeight={600}>{movie.title}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={movie.genre}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(255, 107, 0, 0.1)',
                                            color: '#ff6b00',
                                            fontWeight: 600,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{movie.duration} phút</TableCell>
                                <TableCell>{movie.ticketPrice.toLocaleString()} VNĐ</TableCell>
                                <TableCell>{new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(movie)}
                                        sx={{ color: '#2196f3' }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(movie.id)}
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
                    {editingMovie ? 'Chỉnh Sửa Phim' : 'Thêm Phim Mới'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Tên Phim"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Mô Tả"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                            required
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Thời Lượng (phút)"
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Thể Loại"
                                name="genre"
                                value={formData.genre}
                                onChange={handleInputChange}
                                required
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Ngày Khởi Chiếu"
                                name="releaseDate"
                                type="date"
                                value={formData.releaseDate}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Giá Vé (VNĐ)"
                                name="ticketPrice"
                                type="number"
                                value={formData.ticketPrice}
                                onChange={handleInputChange}
                                required
                            />
                        </Box>
                        <TextField
                            fullWidth
                            label="URL Hình Ảnh"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
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
                        {editingMovie ? 'Cập Nhật' : 'Thêm Mới'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

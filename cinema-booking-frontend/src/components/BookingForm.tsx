import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { BookingRequest } from '../types';

interface BookingFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: BookingRequest) => void;
    screeningId: number;
    seatId: number;
}

export const BookingForm: React.FC<BookingFormProps> = ({
    open,
    onClose,
    onSubmit,
    screeningId,
    seatId,
}) => {
    const [formData, setFormData] = React.useState<Omit<BookingRequest, 'screeningId' | 'seatId'>>({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            screeningId,
            seatId,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Enter Your Information</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            name="customerEmail"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Phone"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Confirm Booking
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { MovieList } from './pages/MovieList';
import { ScreeningList } from './pages/ScreeningList';
import { SeatSelection } from './pages/SeatSelection';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { BookingHistory } from './pages/BookingHistory';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:movieId/screenings" element={<ScreeningList />} />
          <Route path="/movie/:movieId/screening/:screeningId/seats" element={<SeatSelection />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/booking-history" element={<BookingHistory />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

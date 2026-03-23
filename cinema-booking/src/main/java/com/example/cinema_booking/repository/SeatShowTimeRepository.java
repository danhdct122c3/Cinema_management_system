package com.example.cinema_booking.repository;


import com.example.cinema_booking.entity.SeatShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatShowTimeRepository  extends JpaRepository<SeatShowTime, String> {
    boolean existsByShowtimeId(String id);

    List<SeatShowTime> findByShowtimeId(String showTimeId);
}

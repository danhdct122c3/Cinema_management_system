package com.example.cinema_booking.dto.response;


import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.entity.Room;
import com.example.cinema_booking.enums.ShowTimeStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data  //@Data = @Getter + @Setter + @ToString + @EqualsAndHashCode + @RequiredArgsConstructor
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowTimeResponse {

    String id;

    String movieId;
    Movie movie;  // NEW: Full movie object for frontend

    String roomId;
    String roomName;  // NEW: Room name for display
    
    Room room;  // NEW: Full room object for frontend

    LocalDateTime startTime;


    LocalDateTime endTime;

    String status;
}

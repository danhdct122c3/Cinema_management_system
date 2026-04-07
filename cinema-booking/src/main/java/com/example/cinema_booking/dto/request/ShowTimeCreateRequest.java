package com.example.cinema_booking.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;


import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowTimeCreateRequest {

    String movieId;


    String roomId;

    LocalDateTime startTime;

}

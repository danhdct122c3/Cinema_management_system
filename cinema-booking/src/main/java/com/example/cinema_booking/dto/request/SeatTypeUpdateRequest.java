package com.example.cinema_booking.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatTypeUpdateRequest {
    @NotBlank(message = "NOT_NULL")
    String seatType;
    @NotNull
   @Min(1)
    Double price;

}

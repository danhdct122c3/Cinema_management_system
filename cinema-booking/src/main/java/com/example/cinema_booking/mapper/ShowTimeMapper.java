package com.example.cinema_booking.mapper;

import com.example.cinema_booking.dto.request.ShowTimeCreateRequest;
import com.example.cinema_booking.dto.response.ShowTimeResponse;
import com.example.cinema_booking.entity.ShowTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface ShowTimeMapper {

    ShowTime toShowTime(ShowTimeCreateRequest request);

    @Mapping(target = "movieId", source = "movie.id")
    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "roomName", source = "room.roomName")
    ShowTimeResponse toShowTimeResponse(ShowTime showTime);
}

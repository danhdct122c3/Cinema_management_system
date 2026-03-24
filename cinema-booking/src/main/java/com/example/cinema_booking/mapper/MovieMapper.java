package com.example.cinema_booking.mapper;

import com.example.cinema_booking.dto.request.MovieCreateRequest;
import com.example.cinema_booking.dto.request.MovieUpdateRequest;
import com.example.cinema_booking.dto.response.MovieResponse;
import com.example.cinema_booking.entity.Genre;
import com.example.cinema_booking.entity.Movie;
import com.example.cinema_booking.service.GenreService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MovieMapper {

    @Mapping(target = "genre", ignore = true) //  để Service xử lý
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Movie toMovie(MovieCreateRequest request);

    @Mapping(target = "genreId", source = "genre.id")
    @Mapping(target = "genreName", source = "genre.name")
    MovieResponse toMovieResponse(Movie movie);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateMovieFromRequest(MovieUpdateRequest request, @MappingTarget Movie movie);

    List<MovieResponse> toMovieResponseList(List<Movie> movies);
}

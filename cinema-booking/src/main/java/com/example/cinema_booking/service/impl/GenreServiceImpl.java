package com.example.cinema_booking.service.impl;

import com.example.cinema_booking.entity.Genre;
import com.example.cinema_booking.exception.AppException;
import com.example.cinema_booking.exception.ErrorCode;
import com.example.cinema_booking.repository.GenreRepository;
import com.example.cinema_booking.service.GenreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenreServiceImpl implements GenreService {
    GenreRepository genreRepository;

    @Override
    public Genre findOrCreateGenre(String genreId, String genreName) {
        // 1. Nếu có genreId, tìm và trả về
        if (genreId != null && !genreId.isBlank()) {
            return genreRepository.findById(genreId)
                    .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_EXIST));
        }

        // 2. Nếu không có genreId, kiểm tra genreName
        if (genreName == null || genreName.isBlank()) {
            throw new AppException(ErrorCode.INVALID_GENRE);
        }

        // 3. Tìm genre theo tên (tránh trùng)
        Optional<Genre> existing = genreRepository.findByNameIgnoreCase(genreName.trim());
        if (existing.isPresent()) {
            return existing.get();
        }

        // 4. Tạo mới
        Genre newGenre = new Genre();
        newGenre.setName(genreName.trim());
        return genreRepository.save(newGenre);
    }


    public List<Genre> findAllGenres() {
        return genreRepository.findAll();
    }

    @Override
    public Genre createGenre(String genreName) {
        if (genreName == null || genreName.isBlank()) {
            throw new AppException(ErrorCode.INVALID_GENRE);
        }

        // Check nếu genre đã tồn tại (tránh trùng lặp)
        Optional<Genre> existing = genreRepository.findByNameIgnoreCase(genreName.trim());
        if (existing.isPresent()) {
            throw new AppException(ErrorCode.GENRE_ALREADY_EXIST);
        }

        // Tạo genre mới
        Genre newGenre = new Genre();
        newGenre.setName(genreName.trim());
        return genreRepository.save(newGenre);
    }
}

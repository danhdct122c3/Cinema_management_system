package com.example.cinema_booking.service;

import com.example.cinema_booking.dto.request.AuthenticationRequest;

public interface AuthenticateService {
        boolean authenticate(AuthenticationRequest request);
}

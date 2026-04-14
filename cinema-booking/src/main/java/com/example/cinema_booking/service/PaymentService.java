package com.example.cinema_booking.service;

import com.example.cinema_booking.dto.response.PaymentResponse;

import java.io.UnsupportedEncodingException;
import java.util.Map;

public interface PaymentService {
    PaymentResponse createPayment(String bookingId, String ipAddress) throws UnsupportedEncodingException;

    String buildVnpayReturnRedirectUrl(Map<String, String> vnpParams);

    Map<String, String> handleVnpayIpn(Map<String, String> vnpParams);
}

package com.example.cinema_booking.controller;


import com.example.cinema_booking.config.VNPayConfig;
import com.example.cinema_booking.dto.request.APIResponse;
import com.example.cinema_booking.dto.response.PaymentResponse;
import com.example.cinema_booking.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentService paymentService;

    @GetMapping("/create_payment")
    public APIResponse<PaymentResponse> createPayment(@RequestParam String bookingId, HttpServletRequest request)
            throws UnsupportedEncodingException {
        String ipAddress = VNPayConfig.getIpAddress(request);

        return APIResponse.<PaymentResponse>builder()
                .result(paymentService.createPayment(bookingId, ipAddress))
                .build();
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<Void> vnpayReturn(@RequestParam Map<String, String> vnpParams) {
        String redirectUrl = paymentService.buildVnpayReturnRedirectUrl(vnpParams);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .build();
    }

    @GetMapping("/vnpay-ipn")
    public Map<String, String> vnpayIpn(@RequestParam Map<String, String> vnpParams) {
        return paymentService.handleVnpayIpn(vnpParams);
    }
}

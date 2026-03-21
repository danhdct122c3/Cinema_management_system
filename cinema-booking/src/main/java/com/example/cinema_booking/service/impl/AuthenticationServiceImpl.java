package com.example.cinema_booking.service.impl;


import com.example.cinema_booking.dto.request.AuthenticationRequest;
import com.example.cinema_booking.dto.request.IntrospectRequest;
import com.example.cinema_booking.dto.response.AuthenticationResponse;
import com.example.cinema_booking.dto.response.IntrospectResponse;
import com.example.cinema_booking.exception.AppException;
import com.example.cinema_booking.exception.ErrorCode;
import com.example.cinema_booking.repository.UserRepository;
import com.example.cinema_booking.service.AuthenticateService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j

public class AuthenticationServiceImpl implements AuthenticateService {
    UserRepository userRepository;


    // Sau này thay bằng cách lấy từ file config hoặc biến môi trường, ko nên hardcode như này
    @NonFinal
    protected static final String SIGNED_KEY = "0e796109b182226d16e5ba239be1c9ce38c78d378444b4b8e2058e914ff887b8";

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException
    {
        var token = request.getToken();

        JWSVerifier verifier = new MACVerifier(SIGNED_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        return IntrospectResponse.builder()
                .valid(verified && expirationTime.after(new Date()))
                .build();

    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));


        // Khua Điền hash mật khaâẩu phần này nha con  + salt.
        if (user.getPassword() == null || !user.getPassword().equals(request.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var token = generateToken(request.getEmail());

        return AuthenticationResponse.builder()
                .token(token)
                .isAuthenticated(true)
                .build();
    }

    private String generateToken(String email) {

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(email)
                .issuer("cinema-booking")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .claim("customClaim", "Custom")
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNED_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {

            log.error("Error while signing the token: {}", e.getMessage());

            throw new RuntimeException(e);
        }

    }


}

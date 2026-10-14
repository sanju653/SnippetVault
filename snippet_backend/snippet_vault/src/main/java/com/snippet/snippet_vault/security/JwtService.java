package com.snippet.snippet_vault.security;

import com.snippet.snippet_vault.exception.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET_KEY ;


    // Access token = 1 hour
    private final long ACCESS_TOKEN_EXPIRATION =
            1000L * 60 * 60;

    // Refresh token = 7 days
    private final long REFRESH_TOKEN_EXPIRATION =
            1000L * 60 * 60 * 24 * 7;


    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    // Generate JWT
    public String generateToken(String email, long expirationTime) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + expirationTime)
                )
                .signWith(getSigningKey())
                .compact();
    }

    // Generate Access Token
    public String generateAccessToken(String email) {

        return generateToken(
                email,
                ACCESS_TOKEN_EXPIRATION
        );
    }


    // Generate Refresh Token
    public String generateRefreshToken(String email) {

        return generateToken(
                email,
                REFRESH_TOKEN_EXPIRATION
        );
    }


    // Extract email from JWT
    public String extractEmail(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    // Check whether JWT is expired
    public boolean isTokenExpired(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getExpiration().before(new Date());
    }

    // Validate JWT
    public boolean isTokenValid(String token, String email) {

        String tokenEmail = extractEmail(token);

        return tokenEmail.equals(email)
                && !isTokenExpired(token);
    }

    public String refreshAccessToken(String refreshToken) {

        try {
            String email = extractEmail(refreshToken);

            if (isTokenExpired(refreshToken)) {
                throw new UnauthorizedException("Refresh token has expired");
            }

            return generateAccessToken(email);
        } catch (UnauthorizedException exception) {
            throw exception;

        } catch (io.jsonwebtoken.JwtException |
                 IllegalArgumentException exception) {

            throw new UnauthorizedException(
                    "Invalid or expired refresh token"
            );


        }

    }
}

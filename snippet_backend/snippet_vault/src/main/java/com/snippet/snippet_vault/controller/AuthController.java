package com.snippet.snippet_vault.controller;

import com.snippet.snippet_vault.dto.*;
import com.snippet.snippet_vault.entity.User;
import com.snippet.snippet_vault.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse>register(@Valid @RequestBody SignupRequest request){
       UserResponse userResponse= authService.registerUser(request);
       return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);

    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {
       LoginResponse loginResponse=authService.login(request);

        return ResponseEntity.ok(loginResponse);

    }
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {

        RefreshTokenResponse response =
                authService.refreshAccessToken(
                        request.getRefreshToken()
                );

        return ResponseEntity.ok(response);
    }

}

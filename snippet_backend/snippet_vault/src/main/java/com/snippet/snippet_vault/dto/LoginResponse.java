package com.snippet.snippet_vault.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;


@Data
   @AllArgsConstructor
    @NoArgsConstructor
    public class LoginResponse {

        private String accessToken;
        private String refreshToken;
        private UserResponse user;
    }


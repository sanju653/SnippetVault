package com.snippet.snippet_vault.service;

import com.snippet.snippet_vault.dto.*;
import com.snippet.snippet_vault.exception.BadRequestException;
import com.snippet.snippet_vault.exception.EmailAlreadyExistsException;
import com.snippet.snippet_vault.entity.Role;
import com.snippet.snippet_vault.entity.User;
import com.snippet.snippet_vault.repository.UserRepository;
import com.snippet.snippet_vault.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private  final JwtService jwtService;

    public UserResponse registerUser(SignupRequest signUpRequest){
       if(userRepository.existsByEmail(signUpRequest.getEmail())){
           throw new EmailAlreadyExistsException( "User with this email already exists ");
       }
       User user= User.builder()
               .name(signUpRequest.getName())
               .email(signUpRequest.getEmail())
               .password(passwordEncoder.encode(signUpRequest.getPassword()))
               .role(Role.USER)
               .createdAt(LocalDateTime.now())
                       .build();
              User savedUser= userRepository.save(user);
              return new UserResponse(
                      savedUser.getId(),
                      savedUser.getName(),
                      savedUser.getEmail(),
                      savedUser.getRole().toString(),
                      savedUser.getCreatedAt()
              );

    }

    public LoginResponse login(LoginRequest loginRequest){
      User user= userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()->new BadRequestException("Invalid email or password "));

      if(!passwordEncoder.matches(loginRequest.getPassword(),user.getPassword())) throw  new BadRequestException("Invalid email or password");

        String accessToken=jwtService.generateAccessToken(user.getEmail());
        String refreshToken =
                jwtService.generateRefreshToken(user.getEmail());

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().toString(),
                user.getCreatedAt()
        );
        return new LoginResponse(
                accessToken,
                refreshToken,
                userResponse
        );
    }
    public RefreshTokenResponse refreshAccessToken(
            String refreshToken
    ) {

        String accessToken =
                jwtService.refreshAccessToken(refreshToken);

        return new RefreshTokenResponse(accessToken);
    }



}

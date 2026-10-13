package com.snippet.snippet_vault.security;

import com.snippet.snippet_vault.entity.Role;
import com.snippet.snippet_vault.entity.User;
import com.snippet.snippet_vault.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final OAuth2AuthorizedClientService authorizedClientService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        OAuth2AuthenticationToken oauthToken =
                (OAuth2AuthenticationToken) authentication;

        String registrationId =
                oauthToken.getAuthorizedClientRegistrationId();

        String email =
                oauthUser.getAttribute("email");

        String name =
                oauthUser.getAttribute("name");

        // GitHub may not provide email directly
        if ("github".equals(registrationId) && email == null) {

            OAuth2AuthorizedClient client =
                    authorizedClientService.loadAuthorizedClient(
                            registrationId,
                            oauthToken.getName()
                    );

            if (client != null) {

                String githubAccessToken =
                        client.getAccessToken().getTokenValue();

                RestClient restClient = RestClient.create();

                List<Map<String, Object>> emails =
                        restClient.get()
                                .uri("https://api.github.com/user/emails")
                                .header(
                                        HttpHeaders.AUTHORIZATION,
                                        "Bearer " + githubAccessToken
                                )
                                .retrieve()
                                .body(
                                        new ParameterizedTypeReference<
                                                List<Map<String, Object>>>() {}
                                );

                if (emails != null) {

                    // First try primary + verified email
                    for (Map<String, Object> emailData : emails) {

                        Boolean primary =
                                (Boolean) emailData.get("primary");

                        Boolean verified =
                                (Boolean) emailData.get("verified");

                        if (Boolean.TRUE.equals(primary)
                                && Boolean.TRUE.equals(verified)) {

                            email = (String) emailData.get("email");
                            break;
                        }
                    }

                    // If primary verified email wasn't found,
                    // try any verified email
                    if (email == null) {

                        for (Map<String, Object> emailData : emails) {

                            Boolean verified =
                                    (Boolean) emailData.get("verified");

                            if (Boolean.TRUE.equals(verified)) {

                                email = (String) emailData.get("email");
                                break;
                            }
                        }
                    }
                }
            }
        }

        // Stop instead of creating a user with null email
        if (email == null || email.isBlank()) {
            throw new RuntimeException(
                    "Unable to get email from OAuth provider"
            );
        }

        // GitHub name can be null
        if (name == null || name.isBlank()) {
            name = oauthUser.getAttribute("login");
        }

        // Use email prefix if the provider doesn't supply a name
        if (name == null || name.isBlank()) {
            name = email.substring(0, email.indexOf("@"));
        }

        // Find existing user or create a new one
        String finalName = name;
        String finalEmail = email;

        User user =
                userRepository.findByEmail(email)
                        .orElseGet(() -> {

                            User newUser =
                                    User.builder()
                                            .name(finalName)
                                            .email(finalEmail)
                                            .password(
                                                    passwordEncoder.encode(
                                                            UUID.randomUUID()
                                                                    .toString()
                                                    )
                                            )
                                            .role(Role.USER)
                                            .createdAt(LocalDateTime.now())
                                            .build();

                            return userRepository.save(newUser);
                        });

        // Generate Snippet Vault JWTs
        String accessToken =
                jwtService.generateAccessToken(user.getEmail());

        String refreshToken =
                jwtService.generateRefreshToken(user.getEmail());

        // Redirect to Snippet Vault frontend
        String redirectUrl =
                "https://snippetvault-sand.vercel.app/oauth2/success"
                        + "?accessToken=" + accessToken
                        + "&refreshToken=" + refreshToken
                        + "&id=" + user.getId()
                        + "&name=" + java.net.URLEncoder.encode(
                        user.getName(),
                        java.nio.charset.StandardCharsets.UTF_8
                )
                        + "&email=" + java.net.URLEncoder.encode(
                        user.getEmail(),
                        java.nio.charset.StandardCharsets.UTF_8
                );

        response.sendRedirect(redirectUrl);
    }
}
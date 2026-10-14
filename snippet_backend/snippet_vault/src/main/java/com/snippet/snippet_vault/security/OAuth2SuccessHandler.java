package com.snippet.snippet_vault.security;

import com.snippet.snippet_vault.entity.Role;
import com.snippet.snippet_vault.entity.User;
import com.snippet.snippet_vault.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {


    private static final String FRONTEND_ORIGIN_SESSION_KEY =
            "SNIPPET_VAULT_FRONTEND_ORIGIN";

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final OAuth2AuthorizedClientService authorizedClientService;

    @Value("${app.frontend.local-url}")
    private String localFrontendUrl;

    @Value("${app.frontend.production-url}")
    private String productionFrontendUrl;

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

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        // GitHub may not provide an email in its initial user profile.
        if ("github".equals(registrationId)
                && (email == null || email.isBlank())) {

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

                    // Prefer the primary, verified email.
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

                    // Otherwise, use any verified email.
                    if (email == null || email.isBlank()) {

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

        if (email == null || email.isBlank()) {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unable to retrieve email from OAuth provider"
            );
            return;
        }

        // GitHub may not provide a display name.
        if (name == null || name.isBlank()) {
            name = oauthUser.getAttribute("login");
        }

        if (name == null || name.isBlank()) {
            name = email.substring(0, email.indexOf("@"));
        }

        String finalName = name;
        String finalEmail = email;

        // Find the existing user or create a new user.
        User user = userRepository.findByEmail(finalEmail)
                .orElseGet(() -> {

                    User newUser = User.builder()
                            .name(finalName)
                            .email(finalEmail)
                            .password(
                                    passwordEncoder.encode(
                                            UUID.randomUUID().toString()
                                    )
                            )
                            .role(Role.USER)
                            .createdAt(LocalDateTime.now())
                            .build();

                    return userRepository.save(newUser);
                });

        // Generate SnippetVault JWTs.
        String accessToken =
                jwtService.generateAccessToken(user.getEmail());

        String refreshToken =
                jwtService.generateRefreshToken(user.getEmail());

        // Read the frontend choice saved before OAuth2 login began.
        String origin = null;

        if (request.getSession(false) != null) {
            origin = (String) request.getSession(false).getAttribute(
                    FRONTEND_ORIGIN_SESSION_KEY
            );

            request.getSession(false).removeAttribute(
                    FRONTEND_ORIGIN_SESSION_KEY
            );
        }

        // Only accept the two explicitly supported choices.
        String frontendUrl;

        if ("local".equals(origin)) {
            frontendUrl = localFrontendUrl;
        } else {
            frontendUrl = productionFrontendUrl;
        }

        // Construct the frontend callback URL.
        String redirectUrl =
                frontendUrl + "/oauth2/success"
                        + "?accessToken=" + encode(accessToken)
                        + "&refreshToken=" + encode(refreshToken)
                        + "&id=" + user.getId()
                        + "&name=" + encode(user.getName())
                        + "&email=" + encode(user.getEmail());

        response.sendRedirect(redirectUrl);
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }


}

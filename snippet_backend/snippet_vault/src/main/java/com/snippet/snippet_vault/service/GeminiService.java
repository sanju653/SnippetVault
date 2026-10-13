package com.snippet.snippet_vault.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeminiService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    // Tried in order. If one is overloaded, the next one is used.
    private static final List<String> MODELS = List.of(
            "gemini-3.1-flash-lite",
            "gemini-3-flash-preview",
            "gemini-2.5-flash"
    );
    private static final int RETRIES_PER_MODEL = 2;

    private final Client client;

    public GeminiService(@Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public String generateContent(String prompt) {
        for (String model : MODELS) {
            for (int attempt = 1; attempt <= RETRIES_PER_MODEL; attempt++) {
                try {
                    GenerateContentResponse response = client.models.generateContent(model, prompt, null);
                    String generatedText = response.text();

                    if (generatedText == null || generatedText.isBlank()) {
                        logger.warn("Gemini ({}) returned an empty response.", model);
                        return null;
                    }
                    return generatedText;

                } catch (Exception exception) {
                    logger.warn("Gemini model {} failed (attempt {}): {}", model, attempt, exception.getMessage());
                    sleep(attempt * 1000L); // wait 1s, then 2s
                }
            }
        }
        logger.error("Gemini content generation failed on all models.");
        return null;
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
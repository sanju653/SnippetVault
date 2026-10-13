package com.snippet.snippet_vault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SnippetRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Code content is required")
    private String codeContent;

    @NotBlank(message = "Language is required")
    private String language;

    @Size(max = 2000, message = "Summary cannot exceed 2000 characters")
    private String summary;

    @Size(max = 1000, message = "Tags cannot exceed 1000 characters")
    private String tags;
}
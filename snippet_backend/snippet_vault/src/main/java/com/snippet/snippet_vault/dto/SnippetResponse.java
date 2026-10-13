package com.snippet.snippet_vault.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SnippetResponse {

    private Long id;
    private String title;
    private String codeContent;
    private String language;
    private String summary;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
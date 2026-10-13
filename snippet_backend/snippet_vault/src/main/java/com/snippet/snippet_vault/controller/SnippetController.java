package com.snippet.snippet_vault.controller;

import com.snippet.snippet_vault.dto.CodeExplanationResponse;
import com.snippet.snippet_vault.dto.SnippetRequest;
import com.snippet.snippet_vault.dto.SnippetResponse;
import com.snippet.snippet_vault.service.SnippetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/snippets")
@RequiredArgsConstructor
public class SnippetController {

    private final SnippetService snippetService;

    @PostMapping
    public ResponseEntity<SnippetResponse>createSnippet(Authentication authentication, @Valid @RequestBody SnippetRequest snippetRequest){
        SnippetResponse snippetResponse=snippetService.createSnippet(authentication.getName(), snippetRequest);
        return ResponseEntity.ok()
                .body(snippetResponse);
    }
    @PostMapping("/{id}/generate-ai")
    public ResponseEntity<SnippetResponse> regenerateAiContent(
            @PathVariable Long id,
            Authentication authentication
    ) {
        SnippetResponse response = snippetService.regenerateAiContent(
                authentication.getName(),
                id
        );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/{snippetId}")
    public ResponseEntity<SnippetResponse>getSnippet(Authentication authentication,@PathVariable Long snippetId){
        SnippetResponse snippetResponse=snippetService.getSnippet(authentication.getName(),snippetId);
            return ResponseEntity.ok().body(snippetResponse);
    }
    @GetMapping
    public ResponseEntity<List<SnippetResponse>> getAllSnippets(Authentication authentication){
        List<SnippetResponse> snippetResponses=snippetService.getAllSnippets(authentication.getName());
        return ResponseEntity.ok()
                .body(snippetResponses);
    }
    @PutMapping("/{snippetId}")
    public ResponseEntity<SnippetResponse>updateSnippet(Authentication authentication, @PathVariable Long snippetId, @Valid @RequestBody SnippetRequest snippetRequest){
        SnippetResponse snippetResponse=snippetService.updateSnippet(authentication.getName(), snippetId,snippetRequest);
        return ResponseEntity.ok()
                .body(snippetResponse);
    }

    @DeleteMapping("/{snippetId}")
    public ResponseEntity<String>deleteSnippet(Authentication authentication,@PathVariable Long snippetId){
       snippetService.deleteSnippet(authentication.getName(),snippetId);
        return ResponseEntity.ok().body("Snippet deleted Successfully");
    }

    //@RequestParam reads values from URL query parameters.
    //required = false,It means the parameter is optional.When a parameter is omitted, Spring Boot normally assigns null to the corresponding String variable.
    @GetMapping("/search")
    public ResponseEntity<List<SnippetResponse>> searchSnippets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String tag,
            Authentication authentication
    ) {
        List<SnippetResponse> results = snippetService.searchSnippets(
                authentication.getName(),
                search,
                language,
                tag
        );

        return ResponseEntity.ok(results);
    }
    @PostMapping("/{id}/explain")
    public ResponseEntity<CodeExplanationResponse> explainCode(
            @PathVariable Long id,
            Authentication authentication
    ) {
        CodeExplanationResponse response = snippetService.explainCode(
                authentication.getName(),
                id
        );

        return ResponseEntity.ok(response);
    }


}

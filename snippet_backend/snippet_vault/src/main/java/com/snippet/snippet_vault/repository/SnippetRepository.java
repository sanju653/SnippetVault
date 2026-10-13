package com.snippet.snippet_vault.repository;

import com.snippet.snippet_vault.entity.Snippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface SnippetRepository extends JpaRepository<Snippet,Long> {


    List<Snippet> findByUserId(Long userId);

    Optional<Snippet> findByIdAndUserId(Long id, Long userId);

    List<Snippet> findByUserIdAndTitleContainingIgnoreCase(
            Long userId,
            String title
    );

    List<Snippet> findByUserIdAndCodeContentContainingIgnoreCase(
            Long userId,
            String codeContent
    );

    List<Snippet> findByUserIdAndLanguageIgnoreCase(
            Long userId,
            String language
    );

    List<Snippet> findByUserIdAndTagsContainingIgnoreCase(
            Long userId,
            String tag
    );
}

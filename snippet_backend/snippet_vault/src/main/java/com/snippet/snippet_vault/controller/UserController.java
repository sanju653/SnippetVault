package com.snippet.snippet_vault.controller;

import com.snippet.snippet_vault.dto.UserResponse;
import com.snippet.snippet_vault.dto.UserUpdateRequest;
import com.snippet.snippet_vault.entity.User;
import com.snippet.snippet_vault.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserResponse>getuser( Authentication authentication){
        User user=userService.findByEmail(authentication.getName());
         UserResponse userResponse=new UserResponse(
                 user.getId(),user.getName(),user.getEmail(),user.getRole().toString(),user.getCreatedAt()
         );
         return ResponseEntity.ok(userResponse);

    }

    @PutMapping
    public ResponseEntity<UserResponse>updateUser(
            Authentication authentication, @Valid @RequestBody UserUpdateRequest request
    ){
        UserResponse updatedUser =
                userService.updateUser(authentication.getName(), request);

        return ResponseEntity.ok(updatedUser);

    }
    @DeleteMapping
    public ResponseEntity<String> deleteUser(
            Authentication authentication) {



        userService.deleteUser(authentication.getName());

        return ResponseEntity.ok("User deleted successfully");
    }
}

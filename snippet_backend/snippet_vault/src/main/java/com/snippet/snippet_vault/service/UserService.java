package com.snippet.snippet_vault.service;

import com.snippet.snippet_vault.exception.ResourceNotFoundException;
import com.snippet.snippet_vault.dto.UserResponse;
import com.snippet.snippet_vault.dto.UserUpdateRequest;
import com.snippet.snippet_vault.entity.User;
import com.snippet.snippet_vault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;


    public User findByEmail(String email){
       return userRepository.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("User doest exist with this email"));

    }

    public UserResponse updateUser(String email, UserUpdateRequest userUpdateRequest){
        User existedUser=userRepository.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("User doest exist with this email"));

       existedUser.setName(userUpdateRequest.getName());
       existedUser.setEmail(userUpdateRequest.getEmail());
       User updatedUser=userRepository.save(existedUser);
       return new UserResponse(updatedUser.getId(),
               updatedUser.getName(),updatedUser.getEmail(),updatedUser.getRole().toString(),updatedUser.getCreatedAt());



    }
    public void deleteUser(String email){
       User user= userRepository.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("User doest exist with this email"));
       userRepository.deleteById(user.getId());


    }




}

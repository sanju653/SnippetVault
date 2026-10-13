package com.snippet.snippet_vault.exception;

public class EmailAlreadyExistsException extends RuntimeException{
    public  EmailAlreadyExistsException(String message){
        super(message);
    }
}

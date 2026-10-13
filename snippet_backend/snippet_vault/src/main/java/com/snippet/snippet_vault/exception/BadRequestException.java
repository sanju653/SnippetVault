package com.snippet.snippet_vault.exception;

public class BadRequestException  extends RuntimeException{
    public BadRequestException(String message){
        super(message);
    }
}

package com.thymeleafvalidator.infrastructure.config;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void testHandleExceptionWithMessage() {
        Exception ex = new IllegalArgumentException("Invalid argument passed");
        ResponseEntity<Map<String, String>> response = handler.handleException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Invalid argument passed", response.getBody().get("error"));
    }

    @Test
    void testHandleExceptionWithNullMessage() {
        Exception ex = new NullPointerException();
        ResponseEntity<Map<String, String>> response = handler.handleException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Unknown error", response.getBody().get("error"));
    }
}

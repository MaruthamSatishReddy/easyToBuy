package com.easyToBuy.dto;

public record AuthResponse(
        String token,
        String type,
        String id,
        String email,
        String fullName,
        String role) {
    public AuthResponse(String token, String id, String email, String fullName, String role) {
        this(token, "Bearer", id, email, fullName, role);
    }
}

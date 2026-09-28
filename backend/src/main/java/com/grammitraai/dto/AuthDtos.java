package com.grammitraai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class AuthDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String identifier; // mobile or email
        private String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String mobileNumber;
        private String password;
        private String preferredLanguage;
        private String state;
        private String district;
        private String block;
        private String panchayat;
        private String role; // FARMER, OFFICER, ADMIN
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String fullName;
        private String mobileNumber;
        private String email;
        private String role;
        private String state;
        private String district;
        private String block;
        private String panchayat;

        public AuthResponse(String token, Long id, String fullName, String mobileNumber, String email, String role, String state, String district, String block, String panchayat) {
            this.token = token;
            this.id = id;
            this.fullName = fullName;
            this.mobileNumber = mobileNumber;
            this.email = email;
            this.role = role;
            this.state = state;
            this.district = district;
            this.block = block;
            this.panchayat = panchayat;
        }
    }
}

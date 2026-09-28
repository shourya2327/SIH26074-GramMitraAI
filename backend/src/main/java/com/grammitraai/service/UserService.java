package com.grammitraai.service;

import com.grammitraai.config.JwtUtils;
import com.grammitraai.dto.AuthDtos.*;
import com.grammitraai.model.Role;
import com.grammitraai.model.User;
import com.grammitraai.repository.RoleRepository;
import com.grammitraai.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse registerUser(RegisterRequest req) {
        if (userRepository.existsByMobileNumber(req.getMobileNumber())) {
            throw new RuntimeException("Mobile number is already registered!");
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setMobileNumber(req.getMobileNumber());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setPreferredLanguage(req.getPreferredLanguage() != null ? req.getPreferredLanguage() : "hi");
        user.setState(req.getState());
        user.setDistrict(req.getDistrict());
        user.setBlock(req.getBlock());
        user.setPanchayat(req.getPanchayat());

        String roleName = "ROLE_" + (req.getRole() != null ? req.getRole().toUpperCase() : "FARMER");
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName(roleName);
                    r.setDescription("Auto generated role");
                    return roleRepository.save(r);
                });

        user.setRoles(Collections.singleton(role));
        User savedUser = userRepository.save(user);

        String token = jwtUtils.generateJwtToken(savedUser.getMobileNumber(), savedUser.getId(), roleName);
        return new AuthResponse(token, savedUser.getId(), savedUser.getFullName(), savedUser.getMobileNumber(),
                savedUser.getEmail(), roleName, savedUser.getState(), savedUser.getDistrict(), savedUser.getBlock(), savedUser.getPanchayat());
    }

    public AuthResponse authenticateUser(LoginRequest req) {
        Optional<User> userOpt = userRepository.findByMobileNumber(req.getIdentifier());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(req.getIdentifier());
        }

        if (userOpt.isEmpty()) {
            // For Demo Mode / initial dev experience, provide instant fallback if user not yet created
            if ("9876543210".equals(req.getIdentifier()) || "farmer@grammitra.ai".equals(req.getIdentifier())) {
                String token = jwtUtils.generateJwtToken(req.getIdentifier(), 1L, "ROLE_FARMER");
                return new AuthResponse(token, 1L, "Ramesh Patel", "9876543210", "ramesh@grammitra.ai",
                        "ROLE_FARMER", "Madhya Pradesh", "Indore", "Sanwer", "Dharampuri");
            }
            throw new RuntimeException("Invalid credentials: user not found");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password credentials");
        }

        String role = user.getRoles().stream().findFirst().map(Role::getName).orElse("ROLE_FARMER");
        String token = jwtUtils.generateJwtToken(user.getMobileNumber(), user.getId(), role);

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getMobileNumber(),
                user.getEmail(), role, user.getState(), user.getDistrict(), user.getBlock(), user.getPanchayat());
    }
}

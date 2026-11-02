package com.kct.findx.service.impl;

import com.kct.findx.dto.request.LoginRequest;
import com.kct.findx.dto.request.RegisterRequest;
import com.kct.findx.dto.response.AuthResponse;
import com.kct.findx.entity.Role;
import com.kct.findx.entity.User;
import com.kct.findx.exception.BadRequestException;
import com.kct.findx.exception.DuplicateResourceException;
import com.kct.findx.repository.UserRepository;
import com.kct.findx.security.CustomUserDetails;
import com.kct.findx.security.JwtUtil;
import com.kct.findx.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String ALLOWED_DOMAIN = "@kct.ac.in";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (!email.endsWith(ALLOWED_DOMAIN)) {
            throw new BadRequestException("Only Kumaraguru College of Technology email addresses are allowed.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with this email already exists.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(email)
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(true)
                .build();

        User saved = userRepository.save(user);
        CustomUserDetails userDetails = new CustomUserDetails(saved);
        String token = jwtUtil.generateToken(userDetails, saved.getId(), saved.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword()));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}

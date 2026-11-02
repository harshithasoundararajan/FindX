package com.kct.findx.service;

import com.kct.findx.dto.request.LoginRequest;
import com.kct.findx.dto.request.RegisterRequest;
import com.kct.findx.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}

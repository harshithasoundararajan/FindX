package com.kct.findx.service;

import com.kct.findx.dto.response.PageResponse;
import com.kct.findx.dto.response.StatsResponse;
import com.kct.findx.dto.response.UserResponse;

public interface AdminService {
    PageResponse<UserResponse> getAllUsers(int page, int size);
    UserResponse setUserEnabled(Long userId, boolean enabled);
    StatsResponse getStats();
}

package com.kct.findx.controller;

import com.kct.findx.dto.request.CategoryRequest;
import com.kct.findx.dto.request.ClaimDecisionRequest;
import com.kct.findx.dto.request.LocationRequest;
import com.kct.findx.dto.response.*;
import com.kct.findx.service.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administrator operations: users, categories, locations, claims, statistics")
public class AdminController {

    private final AdminService adminService;
    private final CategoryService categoryService;
    private final LocationService locationService;
    private final ClaimService claimService;

    @GetMapping("/users")
    public ApiResponse<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(adminService.getAllUsers(page, size));
    }

    @PatchMapping("/users/{id}/status")
    public ApiResponse<UserResponse> setUserStatus(@PathVariable Long id, @RequestParam boolean enabled) {
        return ApiResponse.success("User status updated", adminService.setUserEnabled(id, enabled));
    }

    @GetMapping("/stats")
    public ApiResponse<StatsResponse> getStats() {
        return ApiResponse.success(adminService.getStats());
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<LookupResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created", categoryService.create(request)));
    }

    @DeleteMapping("/categories/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ApiResponse.success("Category deleted", null);
    }

    @PostMapping("/locations")
    public ResponseEntity<ApiResponse<LookupResponse>> createLocation(@Valid @RequestBody LocationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Location created", locationService.create(request)));
    }

    @DeleteMapping("/locations/{id}")
    public ApiResponse<Void> deleteLocation(@PathVariable Long id) {
        locationService.delete(id);
        return ApiResponse.success("Location deleted", null);
    }

    @GetMapping("/claims")
    public ApiResponse<PageResponse<ClaimResponse>> getAllClaims(
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(claimService.getAllClaims(status, page, size));
    }

    @PatchMapping("/claims/{id}/decision")
    public ApiResponse<ClaimResponse> decideClaim(@PathVariable Long id, @Valid @RequestBody ClaimDecisionRequest request) {
        return ApiResponse.success("Claim decision recorded", claimService.decide(id, request.getDecision()));
    }
}

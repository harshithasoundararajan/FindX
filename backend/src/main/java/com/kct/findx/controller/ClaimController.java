package com.kct.findx.controller;

import com.kct.findx.dto.request.ClaimRequest;
import com.kct.findx.dto.response.ApiResponse;
import com.kct.findx.dto.response.ClaimResponse;
import com.kct.findx.dto.response.PageResponse;
import com.kct.findx.security.CustomUserDetails;
import com.kct.findx.service.ClaimService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
@Tag(name = "Claims", description = "Submit and track claims on found items")
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    public ResponseEntity<ApiResponse<ClaimResponse>> submit(@Valid @RequestBody ClaimRequest request,
                                                               @AuthenticationPrincipal CustomUserDetails principal) {
        ClaimResponse response = claimService.submitClaim(request, principal.getUser().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Claim submitted successfully", response));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<PageResponse<ClaimResponse>>> getMyClaims(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<ClaimResponse> result = claimService.getMyClaims(principal.getUser().getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}

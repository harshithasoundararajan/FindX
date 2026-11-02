package com.kct.findx.service;

import com.kct.findx.dto.request.ClaimRequest;
import com.kct.findx.dto.response.ClaimResponse;
import com.kct.findx.dto.response.PageResponse;

public interface ClaimService {
    ClaimResponse submitClaim(ClaimRequest request, Long claimerId);
    PageResponse<ClaimResponse> getMyClaims(Long claimerId, int page, int size);
    PageResponse<ClaimResponse> getAllClaims(String status, int page, int size);
    ClaimResponse decide(Long claimId, String decision);
}

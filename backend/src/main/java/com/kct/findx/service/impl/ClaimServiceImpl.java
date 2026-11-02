package com.kct.findx.service.impl;

import com.kct.findx.dto.request.ClaimRequest;
import com.kct.findx.dto.response.ClaimResponse;
import com.kct.findx.dto.response.PageResponse;
import com.kct.findx.entity.*;
import com.kct.findx.exception.BadRequestException;
import com.kct.findx.exception.ResourceNotFoundException;
import com.kct.findx.mapper.ClaimMapper;
import com.kct.findx.repository.ClaimRepository;
import com.kct.findx.repository.ItemRepository;
import com.kct.findx.repository.UserRepository;
import com.kct.findx.service.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final ClaimMapper claimMapper;

    @Override
    @Transactional
    public ClaimResponse submitClaim(ClaimRequest request, Long claimerId) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        User claimer = userRepository.findById(claimerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (item.getStatus() == ItemStatus.RETURNED || item.getStatus() == ItemStatus.CLAIMED) {
            throw new BadRequestException("This item is no longer available for claims");
        }

        if (item.getOwner().getId().equals(claimerId)) {
            throw new BadRequestException("You cannot claim an item you reported yourself");
        }

        if (claimRepository.existsByItemIdAndClaimerIdAndStatus(item.getId(), claimerId, ClaimStatus.PENDING)) {
            throw new BadRequestException("You already have a pending claim on this item");
        }

        Claim claim = Claim.builder()
                .item(item)
                .claimer(claimer)
                .reason(request.getReason())
                .proof(request.getProof())
                .status(ClaimStatus.PENDING)
                .build();

        return claimMapper.toResponse(claimRepository.save(claim));
    }

    @Override
    public PageResponse<ClaimResponse> getMyClaims(Long claimerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ClaimResponse> result = claimRepository.findByClaimerId(claimerId, pageable).map(claimMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    public PageResponse<ClaimResponse> getAllClaims(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Claim> result;
        if (status != null && !status.equalsIgnoreCase("all")) {
            ClaimStatus filter;
            try {
                filter = ClaimStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new BadRequestException("Invalid claim status: " + status);
            }
            result = claimRepository.findByStatus(filter, pageable);
        } else {
            result = claimRepository.findAll(pageable);
        }
        return PageResponse.from(result.map(claimMapper::toResponse));
    }

    @Override
    @Transactional
    public ClaimResponse decide(Long claimId, String decision) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new BadRequestException("This claim has already been decided");
        }

        ClaimStatus newStatus;
        try {
            newStatus = ClaimStatus.valueOf(decision.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Decision must be APPROVED or REJECTED");
        }

        if (newStatus != ClaimStatus.APPROVED && newStatus != ClaimStatus.REJECTED) {
            throw new BadRequestException("Decision must be APPROVED or REJECTED");
        }

        claim.setStatus(newStatus);

        if (newStatus == ClaimStatus.APPROVED) {
            Item item = claim.getItem();
            item.setStatus(ItemStatus.CLAIMED);
            itemRepository.save(item);
        }

        return claimMapper.toResponse(claimRepository.save(claim));
    }
}

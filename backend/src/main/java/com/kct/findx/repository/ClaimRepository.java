package com.kct.findx.repository;

import com.kct.findx.entity.Claim;
import com.kct.findx.entity.ClaimStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    Page<Claim> findByClaimerId(Long claimerId, Pageable pageable);
    Page<Claim> findByStatus(ClaimStatus status, Pageable pageable);
    long countByStatus(ClaimStatus status);
    boolean existsByItemIdAndClaimerIdAndStatus(Long itemId, Long claimerId, ClaimStatus status);
}

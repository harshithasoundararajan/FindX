package com.kct.findx.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsResponse {
    private long totalUsers;
    private long totalItems;
    private long totalLost;
    private long totalFound;
    private long totalClaimed;
    private long totalReturned;
    private long pendingClaims;
}

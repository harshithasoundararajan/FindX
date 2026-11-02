package com.kct.findx.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimResponse {
    private Long id;
    private Long itemId;
    private String itemTitle;
    private Long claimerId;
    private String claimerName;
    private String reason;
    private String proof;
    private String status;
    private LocalDateTime createdAt;
}

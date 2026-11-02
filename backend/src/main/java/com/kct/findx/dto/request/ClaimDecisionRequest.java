package com.kct.findx.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimDecisionRequest {
    @NotBlank(message = "Decision is required")
    private String decision; // APPROVED or REJECTED
}

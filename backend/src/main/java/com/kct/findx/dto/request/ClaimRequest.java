package com.kct.findx.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimRequest {

    @NotNull(message = "Item id is required")
    private Long itemId;

    @NotBlank(message = "Reason is required")
    private String reason;

    private String proof;
}

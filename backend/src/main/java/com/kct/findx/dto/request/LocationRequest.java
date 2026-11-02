package com.kct.findx.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationRequest {
    @NotBlank(message = "Location name is required")
    private String name;
}

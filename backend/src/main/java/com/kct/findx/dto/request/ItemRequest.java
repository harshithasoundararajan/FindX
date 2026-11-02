package com.kct.findx.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Location is required")
    private Long locationId;

    @NotNull(message = "Status is required")
    private String status; // LOST or FOUND

    private String imageUrl;

    @NotNull(message = "Date is required")
    private LocalDate date;
}

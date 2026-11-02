package com.kct.findx.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Long categoryId;
    private String location;
    private Long locationId;
    private String status;
    private Long ownerId;
    private String ownerName;
    private String imageUrl;
    private LocalDate date;
    private LocalDateTime createdAt;
}

package com.kct.findx.controller;

import com.kct.findx.dto.request.ItemRequest;
import com.kct.findx.dto.response.ApiResponse;
import com.kct.findx.dto.response.ItemResponse;
import com.kct.findx.dto.response.PageResponse;
import com.kct.findx.security.CustomUserDetails;
import com.kct.findx.service.ItemService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Tag(name = "Items", description = "Report, browse, search lost and found items")
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ApiResponse<ItemResponse>> create(@Valid @RequestBody ItemRequest request,
                                                              @AuthenticationPrincipal CustomUserDetails principal) {
        ItemResponse response = itemService.create(request, principal.getUser().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Item reported successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ItemResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        PageResponse<ItemResponse> result = itemService.search(keyword, categoryId, locationId, status, page, size, sortBy, direction);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ItemResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(itemService.getById(id)));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<PageResponse<ItemResponse>>> getMyItems(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PageResponse<ItemResponse> result = itemService.getMyItems(principal.getUser().getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ItemResponse>> update(@PathVariable Long id,
                                                              @Valid @RequestBody ItemRequest request,
                                                              @AuthenticationPrincipal CustomUserDetails principal) {
        boolean isAdmin = principal.getUser().getRole().name().equals("ADMIN");
        ItemResponse response = itemService.update(id, request, principal.getUser().getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Item updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id,
                                                      @AuthenticationPrincipal CustomUserDetails principal) {
        boolean isAdmin = principal.getUser().getRole().name().equals("ADMIN");
        itemService.delete(id, principal.getUser().getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Item deleted successfully", null));
    }

    @PatchMapping("/{id}/return")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ItemResponse>> markReturned(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Item marked as returned", itemService.markReturned(id)));
    }
}

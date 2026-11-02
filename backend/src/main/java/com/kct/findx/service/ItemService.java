package com.kct.findx.service;

import com.kct.findx.dto.request.ItemRequest;
import com.kct.findx.dto.response.ItemResponse;
import com.kct.findx.dto.response.PageResponse;

public interface ItemService {
    ItemResponse create(ItemRequest request, Long ownerId);
    ItemResponse getById(Long id);
    PageResponse<ItemResponse> search(String keyword, Long categoryId, Long locationId,
                                       String status, int page, int size, String sortBy, String direction);
    ItemResponse update(Long id, ItemRequest request, Long requesterId, boolean isAdmin);
    void delete(Long id, Long requesterId, boolean isAdmin);
    PageResponse<ItemResponse> getMyItems(Long ownerId, int page, int size);
    ItemResponse markReturned(Long id);
}

package com.kct.findx.service.impl;

import com.kct.findx.dto.request.ItemRequest;
import com.kct.findx.dto.response.ItemResponse;
import com.kct.findx.dto.response.PageResponse;
import com.kct.findx.entity.*;
import com.kct.findx.exception.BadRequestException;
import com.kct.findx.exception.ForbiddenException;
import com.kct.findx.exception.ResourceNotFoundException;
import com.kct.findx.mapper.ItemMapper;
import com.kct.findx.repository.CategoryRepository;
import com.kct.findx.repository.ItemRepository;
import com.kct.findx.repository.LocationRepository;
import com.kct.findx.repository.UserRepository;
import com.kct.findx.service.ItemService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ItemServiceImpl implements ItemService {

    // Whitelist of sortable fields so a client cannot trigger a 500 with an arbitrary property name.
    private static final Set<String> SORTABLE_FIELDS = Set.of("createdAt", "date", "title", "status");

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final ItemMapper itemMapper;

    @Override
    @Transactional
    public ItemResponse create(ItemRequest request, Long ownerId) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ItemStatus status = parseStatus(request.getStatus());
        if (status != ItemStatus.LOST && status != ItemStatus.FOUND) {
            throw new BadRequestException("Status must be LOST or FOUND when reporting an item");
        }

        Item item = Item.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .location(location)
                .status(status)
                .owner(owner)
                .imageUrl(request.getImageUrl())
                .date(request.getDate())
                .build();

        return itemMapper.toResponse(itemRepository.save(item));
    }

    @Override
    public ItemResponse getById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return itemMapper.toResponse(item);
    }

    @Override
    public PageResponse<ItemResponse> search(String keyword, Long categoryId, Long locationId,
                                              String status, int page, int size, String sortBy, String direction) {

        String sortField = SORTABLE_FIELDS.contains(sortBy) ? sortBy : "createdAt";
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        Pageable pageable = PageRequest.of(safePage, safeSize, sort);

        Specification<Item> spec = buildSpecification(keyword, categoryId, locationId, status);
        Page<Item> result = itemRepository.findAll(spec, pageable);

        Page<ItemResponse> mapped = result.map(itemMapper::toResponse);
        return PageResponse.from(mapped);
    }

    private Specification<Item> buildSpecification(String keyword, Long categoryId, Long locationId, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (locationId != null) {
                predicates.add(cb.equal(root.get("location").get("id"), locationId));
            }
            if (status != null && !status.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(root.get("status"), parseStatus(status)));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Override
    @Transactional
    public ItemResponse update(Long id, ItemRequest request, Long requesterId, boolean isAdmin) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (!isAdmin && !item.getOwner().getId().equals(requesterId)) {
            throw new ForbiddenException("You can only edit items you reported");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setCategory(category);
        item.setLocation(location);
        item.setStatus(parseStatus(request.getStatus()));
        item.setImageUrl(request.getImageUrl());
        item.setDate(request.getDate());

        return itemMapper.toResponse(itemRepository.save(item));
    }

    @Override
    @Transactional
    public void delete(Long id, Long requesterId, boolean isAdmin) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (!isAdmin && !item.getOwner().getId().equals(requesterId)) {
            throw new ForbiddenException("You can only delete items you reported");
        }
        itemRepository.delete(item);
    }

    @Override
    public PageResponse<ItemResponse> getMyItems(Long ownerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ItemResponse> result = itemRepository.findByOwnerId(ownerId, pageable).map(itemMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    @Transactional
    public ItemResponse markReturned(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        item.setStatus(ItemStatus.RETURNED);
        return itemMapper.toResponse(itemRepository.save(item));
    }

    private ItemStatus parseStatus(String status) {
        try {
            return ItemStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}

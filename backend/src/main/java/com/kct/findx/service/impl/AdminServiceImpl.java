package com.kct.findx.service.impl;

import com.kct.findx.dto.response.PageResponse;
import com.kct.findx.dto.response.StatsResponse;
import com.kct.findx.dto.response.UserResponse;
import com.kct.findx.entity.ClaimStatus;
import com.kct.findx.entity.ItemStatus;
import com.kct.findx.entity.User;
import com.kct.findx.exception.ResourceNotFoundException;
import com.kct.findx.mapper.UserMapper;
import com.kct.findx.repository.ClaimRepository;
import com.kct.findx.repository.ItemRepository;
import com.kct.findx.repository.UserRepository;
import com.kct.findx.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ClaimRepository claimRepository;
    private final UserMapper userMapper;

    @Override
    public PageResponse<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<UserResponse> result = userRepository.findAll(pageable).map(userMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    public UserResponse setUserEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(enabled);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public StatsResponse getStats() {
        return StatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalItems(itemRepository.count())
                .totalLost(itemRepository.countByStatus(ItemStatus.LOST))
                .totalFound(itemRepository.countByStatus(ItemStatus.FOUND))
                .totalClaimed(itemRepository.countByStatus(ItemStatus.CLAIMED))
                .totalReturned(itemRepository.countByStatus(ItemStatus.RETURNED))
                .pendingClaims(claimRepository.countByStatus(ClaimStatus.PENDING))
                .build();
    }
}

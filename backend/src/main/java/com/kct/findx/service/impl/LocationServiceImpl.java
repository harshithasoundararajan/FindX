package com.kct.findx.service.impl;

import com.kct.findx.dto.request.LocationRequest;
import com.kct.findx.dto.response.LookupResponse;
import com.kct.findx.entity.Location;
import com.kct.findx.exception.DuplicateResourceException;
import com.kct.findx.exception.ResourceNotFoundException;
import com.kct.findx.mapper.LookupMapper;
import com.kct.findx.repository.LocationRepository;
import com.kct.findx.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final LookupMapper lookupMapper;

    @Override
    public List<LookupResponse> getAll() {
        return locationRepository.findAll().stream().map(lookupMapper::toResponse).toList();
    }

    @Override
    public LookupResponse create(LocationRequest request) {
        if (locationRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Location already exists");
        }
        Location saved = locationRepository.save(Location.builder().name(request.getName()).build());
        return lookupMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Location not found");
        }
        locationRepository.deleteById(id);
    }
}

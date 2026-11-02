package com.kct.findx.service.impl;

import com.kct.findx.dto.request.CategoryRequest;
import com.kct.findx.dto.response.LookupResponse;
import com.kct.findx.entity.Category;
import com.kct.findx.exception.DuplicateResourceException;
import com.kct.findx.exception.ResourceNotFoundException;
import com.kct.findx.mapper.LookupMapper;
import com.kct.findx.repository.CategoryRepository;
import com.kct.findx.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final LookupMapper lookupMapper;

    @Override
    public List<LookupResponse> getAll() {
        return categoryRepository.findAll().stream().map(lookupMapper::toResponse).toList();
    }

    @Override
    public LookupResponse create(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Category already exists");
        }
        Category saved = categoryRepository.save(Category.builder().name(request.getName()).build());
        return lookupMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found");
        }
        categoryRepository.deleteById(id);
    }
}

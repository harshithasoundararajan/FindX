package com.kct.findx.service;

import com.kct.findx.dto.request.CategoryRequest;
import com.kct.findx.dto.response.LookupResponse;

import java.util.List;

public interface CategoryService {
    List<LookupResponse> getAll();
    LookupResponse create(CategoryRequest request);
    void delete(Long id);
}

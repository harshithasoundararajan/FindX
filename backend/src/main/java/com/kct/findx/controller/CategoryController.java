package com.kct.findx.controller;

import com.kct.findx.dto.response.ApiResponse;
import com.kct.findx.dto.response.LookupResponse;
import com.kct.findx.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Item categories lookup")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<LookupResponse>> getAll() {
        return ApiResponse.success(categoryService.getAll());
    }
}

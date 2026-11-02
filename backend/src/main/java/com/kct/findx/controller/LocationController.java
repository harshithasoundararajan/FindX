package com.kct.findx.controller;

import com.kct.findx.dto.response.ApiResponse;
import com.kct.findx.dto.response.LookupResponse;
import com.kct.findx.service.LocationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@Tag(name = "Locations", description = "Campus locations lookup")
public class LocationController {

    private final LocationService locationService;

    @GetMapping
    public ApiResponse<List<LookupResponse>> getAll() {
        return ApiResponse.success(locationService.getAll());
    }
}

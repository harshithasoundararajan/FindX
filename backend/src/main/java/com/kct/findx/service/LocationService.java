package com.kct.findx.service;

import com.kct.findx.dto.request.LocationRequest;
import com.kct.findx.dto.response.LookupResponse;

import java.util.List;

public interface LocationService {
    List<LookupResponse> getAll();
    LookupResponse create(LocationRequest request);
    void delete(Long id);
}

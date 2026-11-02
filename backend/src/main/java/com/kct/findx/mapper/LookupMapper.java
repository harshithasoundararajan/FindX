package com.kct.findx.mapper;

import com.kct.findx.dto.response.LookupResponse;
import com.kct.findx.entity.Category;
import com.kct.findx.entity.Location;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LookupMapper {
    LookupResponse toResponse(Category category);
    LookupResponse toResponse(Location location);
}

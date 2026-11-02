package com.kct.findx.mapper;

import com.kct.findx.dto.response.ClaimResponse;
import com.kct.findx.entity.Claim;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ClaimMapper {

    @Mapping(target = "itemId", source = "item.id")
    @Mapping(target = "itemTitle", source = "item.title")
    @Mapping(target = "claimerId", source = "claimer.id")
    @Mapping(target = "claimerName", source = "claimer.name")
    ClaimResponse toResponse(Claim claim);
}

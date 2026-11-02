package com.kct.findx.mapper;

import com.kct.findx.dto.response.ItemResponse;
import com.kct.findx.entity.Item;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ItemMapper {

    @Mapping(target = "category", source = "category.name")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "location", source = "location.name")
    @Mapping(target = "locationId", source = "location.id")
    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "ownerName", source = "owner.name")
    ItemResponse toResponse(Item item);
}

package com.kct.findx.mapper;

import com.kct.findx.dto.response.UserResponse;
import com.kct.findx.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}

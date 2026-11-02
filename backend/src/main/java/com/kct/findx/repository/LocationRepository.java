package com.kct.findx.repository;

import com.kct.findx.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
    boolean existsByNameIgnoreCase(String name);
}

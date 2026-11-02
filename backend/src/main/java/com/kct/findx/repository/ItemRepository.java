package com.kct.findx.repository;

import com.kct.findx.entity.Item;
import com.kct.findx.entity.ItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ItemRepository extends JpaRepository<Item, Long>, JpaSpecificationExecutor<Item> {
    Page<Item> findByOwnerId(Long ownerId, Pageable pageable);
    long countByStatus(ItemStatus status);
}

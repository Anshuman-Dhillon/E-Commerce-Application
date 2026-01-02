package com.ecommerceapp.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ecommerceapp.backend.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCreatorId(Long creatorId);
    
    @Query(value = "SELECT * FROM (SELECT * FROM PRODUCT ORDER BY PRODUCTID DESC) WHERE ROWNUM = 1", nativeQuery = true)
    Optional<Product> findTopByOrderByProductIdDesc();
}
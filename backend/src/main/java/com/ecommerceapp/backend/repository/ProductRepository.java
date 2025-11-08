package com.ecommerceapp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerceapp.backend.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> { }
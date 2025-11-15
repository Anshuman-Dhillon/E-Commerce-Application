package com.ecommerceapp.backend.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerceapp.backend.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Customer c WHERE c.email = :email")
    boolean existsByEmail(@Param("email") String email);
    
    @Query(value = "SELECT * FROM (SELECT * FROM CUSTOMER ORDER BY CUSTOMERID DESC) WHERE ROWNUM = 1", nativeQuery = true)
    Optional<Customer> findTopByOrderByCustomerIdDesc();
}

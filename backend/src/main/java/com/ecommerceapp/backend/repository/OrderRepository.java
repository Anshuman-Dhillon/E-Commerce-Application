package com.ecommerceapp.backend.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ecommerceapp.backend.model.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByCustomerIdOrderByOrderDateDesc(Long customerId);
    
    @Query(value = "SELECT * FROM (SELECT * FROM ORDERS ORDER BY ORDERID DESC) WHERE ROWNUM = 1", nativeQuery = true)
    Orders findTopByOrderByOrderIdDesc();
    
    Optional<Orders> findByOrderIdAndCustomerId(Long orderId, Long customerId);
}
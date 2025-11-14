package com.ecommerceapp.backend.repository;
import com.ecommerceapp.backend.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {
    
    /**
     * Orders: Transaction History by Customer
     */
    // This query demonstrates essential SELECT/WHERE filtering for transaction history.**
    List<Orders> findByCustomerIdOrderByOrderDateDesc(Long customerId);
}
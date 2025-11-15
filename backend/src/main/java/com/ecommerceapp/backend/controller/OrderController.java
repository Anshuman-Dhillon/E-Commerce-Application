package com.ecommerceapp.backend.controller;

import com.ecommerceapp.backend.model.Orders;
import com.ecommerceapp.backend.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000") 
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Orders: Transaction History 
     */
    @GetMapping("/history/{customerId}")
    public List<Orders> getOrderHistory(@PathVariable Long customerId) {
        //provides the Orders/Transaction History by Customer ID.
        return orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
    }
    
}
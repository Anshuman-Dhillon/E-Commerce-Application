package com.ecommerceapp.backend.controller;

import java.util.Date;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerceapp.backend.model.Orders;
import com.ecommerceapp.backend.repository.OrderRepository;

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

    /**
     * Create a new order for a customer
     */
    @PostMapping("")
    public ResponseEntity<?> createOrder(@RequestBody OrderPayload payload) {
        if (payload == null || payload.customerId == null || payload.orderAmount == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing order data");
        }
        Orders order = new Orders();
        // Assign next orderId
        Long nextOrderId = 1L;
        Orders top = orderRepository.findTopByOrderByOrderIdDesc();
        if (top != null && top.getOrderId() != null) {
            nextOrderId = top.getOrderId() + 1L;
        }
        order.setOrderId(nextOrderId);
        order.setCustomerId(payload.customerId);
        order.setOrderAmount(payload.orderAmount);
        order.setOrderStatus(payload.orderStatus != null ? payload.orderStatus : "Processing");
        order.setOrderDate(new Date());
        orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    // DTO for order creation
    public static class OrderPayload {
        public Long customerId;
        public Double orderAmount;
        public String orderStatus;
        public java.util.List<Item> items;
        public static class Item {
            public Long productId;
            public Integer quantity;
        }
    }
    
}
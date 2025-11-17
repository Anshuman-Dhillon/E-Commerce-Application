package com.ecommerceapp.backend.controller;

import java.util.Date;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerceapp.backend.model.Orders;
import com.ecommerceapp.backend.model.Product;
import com.ecommerceapp.backend.repository.OrderRepository;
import com.ecommerceapp.backend.repository.ProductRepository;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000") 
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderController(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
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
    @Transactional
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
        // If items are provided, decrement stock for each product
        if (payload.items != null) {
            for (OrderPayload.Item it : payload.items) {
                if (it == null || it.productId == null || it.quantity == null) continue;
                Optional<Product> pop = productRepository.findById(it.productId);
                if (!pop.isPresent()) {
                    throw new IllegalArgumentException("Product not found: " + it.productId);
                }
                Product p = pop.get();
                Integer current = p.getStock() == null ? 0 : p.getStock();
                System.out.println("DEBUG: Product " + it.productId + " current stock: " + current); // ADD THIS
                if (current < it.quantity) {
                    throw new IllegalArgumentException("Insufficient stock for product " + it.productId);
                }
                p.setStock(current - it.quantity);
                System.out.println("DEBUG: Product " + it.productId + " new stock: " + p.getStock()); // ADD THIS
                productRepository.save(p);
            }
        }
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
    
    /**
     * Allow a customer to cancel (delete) their own order.
     */
    @DeleteMapping("/{orderId}/customer/{customerId}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, @PathVariable Long customerId) {
        Optional<Orders> opt = orderRepository.findByOrderIdAndCustomerId(orderId, customerId);
        if (!opt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Order not found or does not belong to this customer");
        }
        Orders order = opt.get();
        orderRepository.delete(order);
        return ResponseEntity.ok().body("Order cancelled");
    }
    
}
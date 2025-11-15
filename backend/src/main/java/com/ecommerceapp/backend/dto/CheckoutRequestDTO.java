package com.ecommerceapp.backend.dto;

import java.util.List;

public class CheckoutRequestDTO {
    // Inner class representing a single item in the cart
    public static class CartItem {
        private Long productId;
        private Integer quantity;

        // Getters and Setters (Required for Spring to deserialize JSON payload)
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    private Long customerId;
    private Double totalAmount;
    private List<CartItem> items;

    // Getters and Setters (Required for Spring)
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }
}
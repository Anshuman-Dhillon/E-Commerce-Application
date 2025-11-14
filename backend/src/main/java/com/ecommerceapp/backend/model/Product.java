package com.ecommerceapp.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "PRODUCT")  
public class Product {
    
    @Id
    @Column(name = "PRODUCTID") 
    private Long productId;
    
    @Column(name = "NAME") 
    private String productName;
    
    @Column(name = "PRICE")
    private Double price;
    
    @Column(name = "DESCRIPTION")
    private String description;
    
    @Column(name = "STOCK")
    private Integer stock;
    
    @Column(name = "CATEGORYID")
    private Long categoryId;
    
    @Column(name = "SUPPLIERID")
    private Long supplierId;
    
    public Product() {}
    public Product(Long productId, String productName, Double price) { /* ... */ }
    
    // Getters
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public Double getPrice() { return price; }
    public String getDescription() { return description; }
    public Integer getStock() { return stock; }
    public Long getCategoryId() { return categoryId; }
    public Long getSupplierId() { return supplierId; }
    
    // Setters (JPA often needs them)
    public void setProductId(Long productId) { this.productId = productId; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setPrice(Double price) { this.price = price; }
    public void setDescription(String description) { this.description = description; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
}
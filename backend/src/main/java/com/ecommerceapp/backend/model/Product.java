package com.ecommerceapp.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "PRODUCT")  // Match your Oracle table name (uppercase in Oracle)
public class Product {
    
    @Id
    @Column(name = "PRODUCTID")  // Match your actual column name
    private Long productId;
    
    @Column(name = "NAME")  // Map to the actual "Name" column
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
    
    // Constructors
    public Product() {}
    
    public Product(Long productId, String productName, Double price) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
    }
    
    // Getters and Setters
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getStock() {
        return stock;
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    
    public Long getSupplierId() {
        return supplierId;
    }
    
    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }
}
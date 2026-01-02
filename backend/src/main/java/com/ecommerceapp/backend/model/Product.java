package com.ecommerceapp.backend.model;

import java.util.Date;

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
    
    @Column(name = "MODELURL")
    private String modelUrl;
    
    @Column(name = "THUMBNAILURL")
    private String thumbnailUrl;
    
    @Column(name = "CREATORID")
    private Long creatorId;
    
    @Column(name = "UPLOADDATE")
    private Date uploadDate;
    
    @Column(name = "DOWNLOADS")
    private Integer downloads;
    
    @Column(name = "ISAPPROVED")
    private Integer isApproved;
    
    public Product() {}
    public Product(Long productId, String productName, Double price) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
    }
    
    // Getters
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public Double getPrice() { return price; }
    public String getDescription() { return description; }
    public Integer getStock() { return stock; }
    public Long getCategoryId() { return categoryId; }
    public Long getSupplierId() { return supplierId; }
    public String getModelUrl() { return modelUrl; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public Long getCreatorId() { return creatorId; }
    public Date getUploadDate() { return uploadDate; }
    public Integer getDownloads() { return downloads; }
    public Integer getIsApproved() { return isApproved; }
    
    // Setters
    public void setProductId(Long productId) { this.productId = productId; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setPrice(Double price) { this.price = price; }
    public void setDescription(String description) { this.description = description; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public void setModelUrl(String modelUrl) { this.modelUrl = modelUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }
    public void setUploadDate(Date uploadDate) { this.uploadDate = uploadDate; }
    public void setDownloads(Integer downloads) { this.downloads = downloads; }
    public void setIsApproved(Integer isApproved) { this.isApproved = isApproved; }
}
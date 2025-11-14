package com.ecommerceapp.backend.model;
import jakarta.persistence.*;

@Entity
@Table(name = "CATEGORY")
public class Category {
    @Id @Column(name = "CATEGORYID") 
    private Long categoryId;
    
    @Column(name = "NAME") 
    private String name;
    
    // Default constructor is REQUIRED by JPA
    public Category() {} 
    
    // Getter for categoryId, required by JPA for relationship queries
    public Long getCategoryId() { return categoryId; }
    
    // Getter for DTO
    public String getName() { return name; }
}
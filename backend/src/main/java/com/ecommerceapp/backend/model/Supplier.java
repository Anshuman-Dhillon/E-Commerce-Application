package com.ecommerceapp.backend.model;
import jakarta.persistence.*;

@Entity
@Table(name = "SUPPLIER")
public class Supplier {
    @Id @Column(name = "SUPPLIERID") 
    private Long supplierId;
    
    @Column(name = "NAME") 
    private String name;
    
    // Default constructor is REQUIRED by JPA
    public Supplier() {}
    
    // Getter for supplierId, required by JPA for relationship queries
    public Long getSupplierId() { return supplierId; }
    
    // Getter for DTO
    public String getName() { return name; } 
}
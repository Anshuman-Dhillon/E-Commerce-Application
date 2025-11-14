package com.ecommerceapp.backend.model;
import jakarta.persistence.*;

@Entity
@Table(name = "CUSTOMER")
public class Customer {
    @Id @Column(name = "CUSTOMERID") 
    private Long customerId;
    
    @Column(name = "NAME") 
    private String name;

    @Column(name = "EMAIL") 
    private String email; 
    
    // Default constructors
    public Customer() {} 
    
    //  Getters  
    public Long getCustomerId() { return customerId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    
    
}
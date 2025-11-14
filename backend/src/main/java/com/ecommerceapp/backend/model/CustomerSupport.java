package com.ecommerceapp.backend.model;
import jakarta.persistence.*;

@Entity
@Table(name = "CUSTOMER_SUPPORT")
public class CustomerSupport {
    @Id @Column(name = "TICKETID") // Primary Key
    private Long ticketId;
    
    // Field for aggregation in the DTO
    @Column(name = "CUSTOMERID") 
    private Long customerId; 
    
    // Default constructor is REQUIRED by JPA
    public CustomerSupport() {}
    
    // Getter for ticketId (for JPA)
    public Long getTicketId() { return ticketId; }
    
    // Getter for customerId (for DTOs)
    public Long getCustomerId() { return customerId; } 
}
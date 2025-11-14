package com.ecommerceapp.backend.model;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "ORDERS") 
public class Orders {
    @Id @Column(name = "ORDERID") 
    private Long orderId;
    
    @Column(name = "CUSTOMERID") 
    private Long customerId; 

    @Column(name = "ORDERSTATUS") 
    private String orderStatus;

    @Column(name = "ORDERAMOUNT") 
    private Double orderAmount;

    @Column(name = "ORDERDATE") 
    private Date orderDate; 
    
    // Default constructor 
    public Orders() {}
    
    // Getters  
    public Long getOrderId() { return orderId; }
    public Long getCustomerId() { return customerId; }
    public String getOrderStatus() { return orderStatus; }
    public Double getOrderAmount() { return orderAmount; }
    public Date getOrderDate() { return orderDate; }
}
package com.ecommerceapp.backend.model;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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

    // Setters
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
    public void setOrderAmount(Double orderAmount) { this.orderAmount = orderAmount; }
    public void setOrderDate(Date orderDate) { this.orderDate = orderDate; }
}
package com.ecommerceapp.backend.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "CUSTOMER")
public class Customer {
    @Id @Column(name = "CUSTOMERID") 
    private Long customerId;
    
    @Column(name = "NAME") 
    private String name;

    @Column(name = "EMAIL") 
    private String email;
    
    @Column(name = "PASSWORD")
    private String password;
    
    @Column(name = "STREETNAME")
    private String streetName;

    @Column(name = "CITY")
    private String city;
    
    @Column(name = "USERROLE")
    private String userRole; // 'BUYER' or 'CREATOR'
    
    @Column(name = "CREATORBIO")
    private String creatorBio;
    
    @Column(name = "CREATORRATING")
    private Double creatorRating;
    
    // Default constructors
    public Customer() {} 
    
    public Customer(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.userRole = "BUYER"; // Default role
    }
    
    //  Getters  
    public Long getCustomerId() { return customerId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getStreetName() { return streetName; }
    public String getCity() { return city; }
    public String getUserRole() { return userRole; }
    public String getCreatorBio() { return creatorBio; }
    public Double getCreatorRating() { return creatorRating; }
    
    // Setters
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setStreetName(String streetName) { this.streetName = streetName; }
    public void setCity(String city) { this.city = city; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
    public void setCreatorBio(String creatorBio) { this.creatorBio = creatorBio; }
    public void setCreatorRating(Double creatorRating) { this.creatorRating = creatorRating; }
}
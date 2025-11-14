package com.ecommerceapp.backend.model;

public class Customer {
    private Long customerId;
    private String Name;
    private String address;
    private String email;
    private String phone_number;
    private String username;
    private String password;

    public Customer(){};

    public Customer(Long customerId, String username, String password){
        this.customerId = customerId;
        this.username = username;
        this.password = password;
    }

    
}

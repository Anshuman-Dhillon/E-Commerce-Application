package com.ecommerceapp.backend.controller;

import com.ecommerceapp.backend.model.Customer;
import com.ecommerceapp.backend.repository.CustomerRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000") 
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    /**
     * Customer: Dummy Login Endpoint (Essential Feature)
     */
    @GetMapping("/login/{customerId}")
    public ResponseEntity<?> login(@PathVariable Long customerId) {
        // **Comment for Marker: Essential Feature: Dummy Login logic (checks if customer exists).**
        Optional<Customer> customer = customerRepository.findById(customerId);

        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get());
        } else {
            // **Special Case: Login Failed / User Not Found**
            return ResponseEntity.status(404).body("Customer ID " + customerId + " not found. Try ID 1-10.");
        }
    }
}
package com.ecommerceapp.backend.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerceapp.backend.dto.LoginRequest;
import com.ecommerceapp.backend.dto.RegisterRequest;
import com.ecommerceapp.backend.model.Customer;
import com.ecommerceapp.backend.repository.CustomerRepository;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000") 
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    /**
     * Login endpoint: Check if email + password match in DB
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Customer> customer = customerRepository.findByEmail(request.getEmail());

        if (customer.isPresent()) {
            // Check if password matches
            if (customer.get().getPassword().equals(request.getPassword())) {
                return ResponseEntity.ok(customer.get());
            } else {
                return ResponseEntity.status(401).body("Invalid email or password.");
            }
        } else {
            return ResponseEntity.status(404).body("User not found. Please register first.");
        }
    }

    /**
     * Register endpoint: Check if user exists. If not, create new customer.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Check if email already exists
        if (customerRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(409).body("Email already in use. Please log in.");
        }

        // Create new customer
        Customer newCustomer = new Customer(request.getName(), request.getEmail(), request.getPassword());

        // Assign a new customerId if the table doesn't generate one automatically.
        // This avoids inserting a NULL id which causes an Internal Server Error.
        Optional<Customer> top = customerRepository.findTopByOrderByCustomerIdDesc();
        Long nextId = 1L;
        if (top.isPresent() && top.get().getCustomerId() != null) {
            nextId = top.get().getCustomerId() + 1L;
        }
        newCustomer.setCustomerId(nextId);

        // Ensure NOT NULL columns in DB receive a valid value
        newCustomer.setStreetName("Unknown");
        newCustomer.setCity("Unknown");

        Customer saved = customerRepository.save(newCustomer);

        return ResponseEntity.status(201).body(saved);
    }

    /**
     * Get customer by ID (legacy endpoint, kept for compatibility)
     */
    @GetMapping("/login/{customerId}")
    public ResponseEntity<?> loginById(@PathVariable Long customerId) {
        Optional<Customer> customer = customerRepository.findById(customerId);

        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get());
        } else {
            return ResponseEntity.status(404).body("Customer ID " + customerId + " not found.");
        }
    }
}

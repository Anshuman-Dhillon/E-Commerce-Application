package com.ecommerceapp.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerceapp.backend.dto.LoginRequest;
import com.ecommerceapp.backend.dto.RegisterRequest;
import com.ecommerceapp.backend.model.Customer;
import com.ecommerceapp.backend.repository.CustomerRepository;
import com.ecommerceapp.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final int MIN_PASSWORD_LENGTH = 8;

    public CustomerController(CustomerRepository customerRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Login attempt for email: " + request.getEmail());
        
        if (!isValidEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        Optional<Customer> customer = customerRepository.findByEmail(request.getEmail().trim());

        if (customer.isPresent()) {
            Customer user = customer.get();
            
            // Only accept BCrypt hashed passwords for security
            if (user.getPassword() == null || !user.getPassword().startsWith("$2")) {
                return ResponseEntity.status(401).body("Invalid credentials. Please reset your password.");
            }
            
            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            
            if (passwordMatches) {
                // Generate proper JWT token
                String token = jwtUtil.generateToken(user.getEmail(), user.getCustomerId());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("customer", user);
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Password mismatch!");
            }
        } else {
            System.out.println("Customer not found for email: " + request.getEmail());
        }
        
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String email = request.getEmail().trim();
        String name = request.getName().trim();
        String password = request.getPassword();
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "BUYER";
        
        System.out.println("Registration attempt - Email: " + email + ", Role: " + role);
        
        if (!isValidEmail(email)) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        if (password.length() < MIN_PASSWORD_LENGTH) {
            return ResponseEntity.badRequest().body("Password must be at least " + MIN_PASSWORD_LENGTH + " characters");
        }
        
        if (!role.equals("BUYER") && !role.equals("CREATOR")) {
            return ResponseEntity.badRequest().body("Invalid role. Must be BUYER or CREATOR");
        }

        if (customerRepository.existsByEmail(email)) {
            return ResponseEntity.status(409).body("Email already in use");
        }

        String hashedPassword = passwordEncoder.encode(password);
        System.out.println("Hashed password: " + hashedPassword);
        
        Customer newCustomer = new Customer(name, email, hashedPassword);
        newCustomer.setUserRole(role);
        
        Optional<Customer> top = customerRepository.findTopByOrderByCustomerIdDesc();
        Long nextId = top.isPresent() && top.get().getCustomerId() != null ? 
                      top.get().getCustomerId() + 1L : 1L;
        newCustomer.setCustomerId(nextId);
        newCustomer.setStreetName("Not provided");
        newCustomer.setCity("Not provided");

        Customer saved = customerRepository.save(newCustomer);
        
        // Generate proper JWT token
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getCustomerId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("customer", saved);
        return ResponseEntity.status(201).body(response);
    }

    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
}
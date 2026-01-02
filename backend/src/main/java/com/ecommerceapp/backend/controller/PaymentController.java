package com.ecommerceapp.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerceapp.backend.dto.PaymentRequest;
import com.ecommerceapp.backend.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            return ResponseEntity.badRequest().body("Invalid amount");
        }
        
        Map<String, Object> result = paymentService.processPayment(
            request.getAmount(),
            request.getCurrency() != null ? request.getCurrency() : "USD",
            request.getPaymentMethodId()
        );
        
        if ("succeeded".equals(result.get("status"))) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(400).body(result);
        }
    }
}
package com.ecommerceapp.backend.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    
    /**
     * SIMULATED PAYMENT SERVICE
     * This is for demonstration/testing purposes only.
     * No real money is processed.
     * Always accepts test card: 4242 4242 4242 4242
     */
    public Map<String, Object> processPayment(Double amount, String currency, String paymentMethodId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Simulate processing delay (like a real payment gateway)
            Thread.sleep(1500);
            
            // Check if using the "test" card number (simulated validation)
            boolean isTestCard = paymentMethodId != null && 
                                (paymentMethodId.contains("4242") || 
                                 paymentMethodId.startsWith("pm_"));
            
            // Simulate payment validation
            if (amount == null || amount <= 0) {
                result.put("status", "failed");
                result.put("message", "Invalid amount");
                return result;
            }
            
            // Simulate success (90% success rate for realistic testing)
            // You can change this to 100% if you want all payments to succeed
            boolean success = Math.random() > 0.1; // 90% success rate
            
            if (success) {
                // Generate a fake transaction ID
                String transactionId = "sim_" + UUID.randomUUID().toString().substring(0, 8);
                
                result.put("status", "succeeded");
                result.put("transactionId", transactionId);
                result.put("amount", amount);
                result.put("currency", currency);
                result.put("message", "Payment processed successfully (SIMULATED)");
                result.put("simulation", true); // Flag to indicate this is fake
                
                // Log the simulated transaction
                System.out.println("=== SIMULATED PAYMENT ===");
                System.out.println("Transaction ID: " + transactionId);
                System.out.println("Amount: $" + amount + " " + currency);
                System.out.println("Status: SUCCESS");
                System.out.println("========================");
            } else {
                result.put("status", "failed");
                result.put("message", "Payment declined (simulated). Please try again with card 4242 4242 4242 4242");
                result.put("simulation", true);
                
                System.out.println("=== SIMULATED PAYMENT ===");
                System.out.println("Amount: $" + amount + " " + currency);
                System.out.println("Status: DECLINED");
                System.out.println("========================");
            }
            
        } catch (InterruptedException e) {
            result.put("status", "error");
            result.put("message", "Payment processing error");
            result.put("simulation", true);
            Thread.currentThread().interrupt();
        }
        
        return result;
    }
}
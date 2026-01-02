package com.ecommerceapp.backend.dto;

public class PaymentRequest {
    private Double amount;
    private String currency;
    private String paymentMethodId;
    
    public PaymentRequest() {}
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getPaymentMethodId() { return paymentMethodId; }
    public void setPaymentMethodId(String paymentMethodId) { this.paymentMethodId = paymentMethodId; }
}
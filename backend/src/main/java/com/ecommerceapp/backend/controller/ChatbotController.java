package com.ecommerceapp.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerceapp.backend.service.ChatbotService;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatbotController {
    
    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestBody ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty");
        }

        try {
            String response = chatbotService.getChatResponse(
                request.getMessage(), 
                request.getHistory()
            );
            
            Map<String, String> result = new HashMap<>();
            result.put("response", response);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Chatbot service error: " + e.getMessage());
        }
    }

    public static class ChatRequest {
        private String message;
        private List<Map<String, String>> history;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public List<Map<String, String>> getHistory() { return history; }
        public void setHistory(List<Map<String, String>> history) { this.history = history; }
    }
}
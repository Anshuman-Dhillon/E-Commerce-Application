package com.ecommerceapp.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChatbotService {
    
    @Value("${llm.provider:fallback}")
    private String llmProvider; // Options: gemini, groq, huggingface, fallback
    
    @Value("${gemini.api.key:}")
    private String geminiApiKey;
    
    @Value("${groq.api.key:}")
    private String groqApiKey;
    
    @Value("${huggingface.api.key:}")
    private String huggingfaceApiKey;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    private static final String SYSTEM_PROMPT = 
        "You are a helpful customer support assistant for a 3D model marketplace. " +
        "Keep responses concise (2-3 sentences max). Help users with:\n" +
        "- Browsing and purchasing 3D models\n" +
        "- Uploading models as a creator\n" +
        "- File formats (GLB, GLTF)\n" +
        "- Licensing and commercial use\n" +
        "- Payment and refunds\n" +
        "Be friendly and professional.";

    public ChatbotService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String getChatResponse(String userMessage, List<Map<String, String>> conversationHistory) {
        try {
            switch (llmProvider.toLowerCase()) {
                case "gemini":
                    return getGeminiResponse(userMessage, conversationHistory);
                case "groq":
                    return getGroqResponse(userMessage, conversationHistory);
                case "huggingface":
                    return getHuggingFaceResponse(userMessage);
                default:
                    return getFallbackResponse(userMessage);
            }
        } catch (Exception e) {
            System.err.println("LLM API error: " + e.getMessage());
            return getFallbackResponse(userMessage);
        }
    }

    /**
     * GOOGLE GEMINI (FREE - RECOMMENDED)
     * Get free API key: https://makersuite.google.com/app/apikey
     * Free tier: 60 requests/minute
     */
    private String getGeminiResponse(String userMessage, List<Map<String, String>> history) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            System.out.println("No Gemini API key, using fallback");
            return getFallbackResponse(userMessage);
        }

        try {
            // Change this line in your getGeminiResponse method:
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;
            
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            
            // Add system context
            Map<String, Object> systemContent = new HashMap<>();
            systemContent.put("role", "user");
            List<Map<String, String>> systemParts = new ArrayList<>();
            systemParts.add(Map.of("text", SYSTEM_PROMPT));
            systemContent.put("parts", systemParts);
            contents.add(systemContent);
            
            // Add conversation history
            if (history != null) {
                for (Map<String, String> msg : history) {
                    Map<String, Object> content = new HashMap<>();
                    content.put("role", msg.get("role").equals("user") ? "user" : "model");
                    List<Map<String, String>> parts = new ArrayList<>();
                    parts.add(Map.of("text", msg.get("content")));
                    content.put("parts", parts);
                    contents.add(content);
                }
            }
            
            // Add current message
            Map<String, Object> userContent = new HashMap<>();
            userContent.put("role", "user");
            List<Map<String, String>> userParts = new ArrayList<>();
            userParts.add(Map.of("text", userMessage));
            userContent.put("parts", userParts);
            contents.add(userContent);
            
            requestBody.put("contents", contents);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            Map<String, Object> responseMap = objectMapper.readValue(response.getBody(), Map.class);
            
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return parts.get(0).get("text");
                }
            }
            
            return getFallbackResponse(userMessage);
        } catch (Exception e) {
            System.err.println("Gemini error: " + e.getMessage());
            return getFallbackResponse(userMessage);
        }
    }

    /**
     * GROQ (FREE - FAST)
     * Get free API key: https://console.groq.com/keys
     * Free tier: 7,000 requests/day
     */
    private String getGroqResponse(String userMessage, List<Map<String, String>> history) {
        if (groqApiKey == null || groqApiKey.isEmpty()) {
            System.out.println("No Groq API key, using fallback");
            return getFallbackResponse(userMessage);
        }

        try {
            String url = "https://api.groq.com/openai/v1/chat/completions";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama3-8b-8192"); // Fast and free
            requestBody.put("max_tokens", 300);
            requestBody.put("temperature", 0.7);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));
            
            if (history != null) {
                messages.addAll(history);
            }
            
            messages.add(Map.of("role", "user", "content", userMessage));
            requestBody.put("messages", messages);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            Map<String, Object> responseMap = objectMapper.readValue(response.getBody(), Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return (String) message.get("content");
            }

            return getFallbackResponse(userMessage);
        } catch (Exception e) {
            System.err.println("Groq error: " + e.getMessage());
            return getFallbackResponse(userMessage);
        }
    }

    /**
     * HUGGING FACE (FREE)
     * Get free API key: https://huggingface.co/settings/tokens
     * Free tier: Unlimited (with rate limits)
     */
    private String getHuggingFaceResponse(String userMessage) {
        if (huggingfaceApiKey == null || huggingfaceApiKey.isEmpty()) {
            System.out.println("No HuggingFace API key, using fallback");
            return getFallbackResponse(userMessage);
        }

        try {
            // Using Microsoft's Phi-2 model (free and fast)
            String url = "https://api-inference.huggingface.co/models/microsoft/phi-2";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(huggingfaceApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            String prompt = SYSTEM_PROMPT + "\n\nUser: " + userMessage + "\nAssistant:";
            requestBody.put("inputs", prompt);
            requestBody.put("parameters", Map.of(
                "max_new_tokens", 200,
                "temperature", 0.7,
                "return_full_text", false
            ));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            List<Map<String, Object>> responseList = objectMapper.readValue(response.getBody(), List.class);
            if (responseList != null && !responseList.isEmpty()) {
                String generatedText = (String) responseList.get(0).get("generated_text");
                return generatedText.trim();
            }

            return getFallbackResponse(userMessage);
        } catch (Exception e) {
            System.err.println("HuggingFace error: " + e.getMessage());
            return getFallbackResponse(userMessage);
        }
    }

    /**
     * FALLBACK RESPONSES (Always free, no API needed)
     */
    private String getFallbackResponse(String userMessage) {
        String msg = userMessage.toLowerCase();
        
        if (msg.contains("price") || msg.contains("cost") || msg.contains("expensive") || msg.contains("how much")) {
            return "Our 3D models range from $5 to $500 depending on complexity and detail. Browse our catalog to find models that fit your budget!";
        } else if (msg.contains("format") || msg.contains("file type") || msg.contains("extension")) {
            return "We primarily offer models in GLB and GLTF formats, which are widely compatible with most 3D software and game engines like Unity, Unreal Engine, and Blender.";
        } else if (msg.contains("upload") || msg.contains("creator") || msg.contains("sell") || msg.contains("become")) {
            return "To upload models, register as a Creator during sign-up. You'll get access to the Creator Dashboard where you can upload GLB files, add thumbnails, set prices, and manage your inventory.";
        } else if (msg.contains("license") || msg.contains("commercial") || msg.contains("can i use")) {
            return "All models come with a standard commercial license. You can use them in games, apps, and commercial projects. Check individual product pages for specific licensing details.";
        } else if (msg.contains("refund") || msg.contains("return") || msg.contains("money back")) {
            return "We offer a 30-day money-back guarantee if the model doesn't meet your expectations. Contact support@3dmodelshop.com with your order number for refunds.";
        } else if (msg.contains("download") || msg.contains("after purchase") || msg.contains("how to get")) {
            return "After purchase, you'll receive an immediate download link via email. You can also access your purchases anytime in the 'Orders History' section of your account.";
        } else if (msg.contains("payment") || msg.contains("pay") || msg.contains("credit card")) {
            return "We accept all major credit cards through our secure payment gateway. For testing, use card number 4242 4242 4242 4242. Your payment information is encrypted and secure.";
        } else if (msg.contains("hello") || msg.contains("hi") || msg.contains("hey")) {
            return "Hello! I'm here to help you with our 3D model marketplace. Feel free to ask me about pricing, file formats, uploading models, or making purchases!";
        } else if (msg.contains("help") || msg.contains("what can you")) {
            return "I can help you with: pricing information, file formats, licensing, payment methods, uploading models as a creator, refund policies, and general marketplace questions. What would you like to know?";
        } else if (msg.contains("thank")) {
            return "You're welcome! Is there anything else you'd like to know about our 3D models?";
        } else {
            return "I'm here to help! You can ask me about pricing, file formats, licensing, uploading models, purchasing, or refunds. What would you like to know about our 3D model marketplace?";
        }
    }
}
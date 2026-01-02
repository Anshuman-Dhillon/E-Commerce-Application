package com.ecommerceapp.backend.security;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private static final int MAX_REQUESTS_PER_MINUTE = 100;
    
    private final LoadingCache<String, AtomicInteger> requestCounts = CacheBuilder.newBuilder()
            .expireAfterWrite(1, TimeUnit.MINUTES)
            .build(new CacheLoader<String, AtomicInteger>() {
                @Override
                public AtomicInteger load(String key) {
                    return new AtomicInteger(0);
                }
            });

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String clientIp = getClientIP(request);
        
        try {
            AtomicInteger counter = requestCounts.get(clientIp);
            if (counter.incrementAndGet() > MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Rate limit exceeded. Try again later.");
                return;
            }
        } catch (ExecutionException e) {
            throw new ServletException(e);
        }
        
        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
package com.solarpanel.faultdetection.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Backend is working!", "status", "success");
    }
    
    @PostMapping("/echo")
    public Map<String, Object> echo(@RequestBody Map<String, Object> request) {
        return Map.of(
            "message", "Echo successful",
            "received", request,
            "timestamp", System.currentTimeMillis()
        );
    }
}
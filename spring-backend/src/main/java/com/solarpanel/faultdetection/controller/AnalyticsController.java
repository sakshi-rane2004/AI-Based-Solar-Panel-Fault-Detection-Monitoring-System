package com.solarpanel.faultdetection.controller;

import com.solarpanel.faultdetection.dto.AnalyticsSummaryResponse;
import com.solarpanel.faultdetection.dto.AnalyticsTrendsResponse;
import com.solarpanel.faultdetection.service.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);
    
    @Autowired
    private AnalyticsService analyticsService;
    
    /**
     * Get comprehensive analytics summary
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getAnalyticsSummary() {
        logger.info("Received analytics summary request");
        
        try {
            AnalyticsSummaryResponse summary = analyticsService.getAnalyticsSummary();
            logger.info("Analytics summary generated successfully");
            
            return ResponseEntity.ok(summary);
            
        } catch (Exception e) {
            logger.error("Error generating analytics summary: {}", e.getMessage(), e);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Failed to generate analytics summary",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Get analytics trends for specified date range
     */
    @GetMapping("/trends")
    public ResponseEntity<?> getAnalyticsTrends(
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "30") int days) {
        
        logger.info("Received analytics trends request - startDate: {}, endDate: {}, days: {}", 
                   startDate, endDate, days);
        
        try {
            AnalyticsTrendsResponse trends;
            
            // Use date range if both dates provided, otherwise use days parameter
            if (startDate != null && endDate != null) {
                trends = analyticsService.getAnalyticsTrends(startDate, endDate);
                logger.info("Generated trends for date range: {} to {}", startDate, endDate);
            } else {
                // Validate days parameter
                if (days < 1 || days > 365) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "error", "Invalid days parameter",
                        "message", "Days must be between 1 and 365"
                    ));
                }
                
                trends = analyticsService.getAnalyticsTrends(days);
                logger.info("Generated trends for last {} days", days);
            }
            
            return ResponseEntity.ok(trends);
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request parameters: {}", e.getMessage());
            
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid request parameters",
                "message", e.getMessage()
            ));
            
        } catch (Exception e) {
            logger.error("Error generating analytics trends: {}", e.getMessage(), e);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Failed to generate analytics trends",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Get analytics trends for last N days (convenience endpoint)
     */
    @GetMapping("/trends/last/{days}")
    public ResponseEntity<?> getAnalyticsTrendsLastDays(@PathVariable int days) {
        logger.info("Received analytics trends request for last {} days", days);
        
        if (days < 1 || days > 365) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid days parameter",
                "message", "Days must be between 1 and 365"
            ));
        }
        
        try {
            AnalyticsTrendsResponse trends = analyticsService.getAnalyticsTrends(days);
            logger.info("Generated trends for last {} days successfully", days);
            
            return ResponseEntity.ok(trends);
            
        } catch (Exception e) {
            logger.error("Error generating analytics trends for {} days: {}", days, e.getMessage(), e);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Failed to generate analytics trends",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Get analytics health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> analyticsHealthCheck() {
        try {
            // Quick health check by getting summary
            AnalyticsSummaryResponse summary = analyticsService.getAnalyticsSummary();
            
            return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Analytics Service",
                "totalPredictions", summary.getTotalPredictions(),
                "timestamp", System.currentTimeMillis()
            ));
            
        } catch (Exception e) {
            logger.error("Analytics health check failed: {}", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "status", "DOWN",
                "service", "Analytics Service",
                "error", e.getMessage(),
                "timestamp", System.currentTimeMillis()
            ));
        }
    }
}
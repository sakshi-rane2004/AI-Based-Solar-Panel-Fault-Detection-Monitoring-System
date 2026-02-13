package com.solarpanel.faultdetection.controller;

import com.solarpanel.faultdetection.dto.PredictionResponse;
import com.solarpanel.faultdetection.dto.SensorDataRequest;
import com.solarpanel.faultdetection.service.PredictionService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/solar-panel")
@CrossOrigin(origins = "*")
public class PredictionController {
    
    private static final Logger logger = LoggerFactory.getLogger(PredictionController.class);
    
    @Autowired
    private PredictionService predictionService;
    
    /**
     * Analyze solar panel sensor data
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeSensorData(@Valid @RequestBody SensorDataRequest sensorData,
                                             BindingResult bindingResult) {
        logger.info("Received analyze request: {}", sensorData);
        
        // Check for validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            
            logger.warn("Validation errors in analyze request: {}", errors);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Validation failed",
                "details", errors
            ));
        }
        
        try {
            PredictionResponse response = predictionService.analyzeSensorData(sensorData);
            logger.info("Analysis completed successfully for request: {}", sensorData);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error during analysis: {}", e.getMessage(), e);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Analysis failed",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Get all prediction history
     */
    @GetMapping("/history")
    public ResponseEntity<?> getPredictionHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String faultType,
            @RequestParam(required = false) String severity) {
        
        logger.info("Received history request - page: {}, size: {}, faultType: {}, severity: {}", 
                   page, size, faultType, severity);
        
        try {
            List<PredictionResponse> predictions;
            
            // Filter by fault type if specified
            if (faultType != null && !faultType.trim().isEmpty()) {
                predictions = predictionService.getPredictionsByFaultType(faultType.trim());
            }
            // Filter by severity if specified
            else if (severity != null && !severity.trim().isEmpty()) {
                predictions = predictionService.getPredictionsBySeverity(severity.trim());
            }
            // Get paginated results if no filters
            else if (page >= 0 && size > 0) {
                Page<PredictionResponse> paginatedResults = predictionService.getPaginatedPredictions(page, size);
                
                Map<String, Object> response = new HashMap<>();
                response.put("content", paginatedResults.getContent());
                response.put("totalElements", paginatedResults.getTotalElements());
                response.put("totalPages", paginatedResults.getTotalPages());
                response.put("currentPage", page);
                response.put("size", size);
                response.put("hasNext", paginatedResults.hasNext());
                response.put("hasPrevious", paginatedResults.hasPrevious());
                
                return ResponseEntity.ok(response);
            }
            // Get all results
            else {
                predictions = predictionService.getAllPredictions();
            }
            
            logger.info("Retrieved {} prediction records", predictions.size());
            return ResponseEntity.ok(predictions);
            
        } catch (Exception e) {
            logger.error("Error retrieving prediction history: {}", e.getMessage(), e);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Failed to retrieve history",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Get recent predictions (last 24 hours)
     */
    @GetMapping("/history/recent")
    public ResponseEntity<?> getRecentPredictions() {
        logger.info("Received recent predictions request");
        
        try {
            List<PredictionResponse> predictions = predictionService.getRecentPredictions();
            logger.info("Retrieved {} recent prediction records", predictions.size());
            
            return ResponseEntity.ok(predictions);
            
        } catch (Exception e) {
            logger.error("Error retrieving recent predictions: {}", e.getMessage(), e);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Failed to retrieve recent predictions",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Get prediction by ID
     */
    @GetMapping("/history/{id}")
    public ResponseEntity<?> getPredictionById(@PathVariable Long id) {
        logger.info("Received request for prediction ID: {}", id);
        
        try {
            Optional<PredictionResponse> prediction = predictionService.getPredictionById(id);
            
            if (prediction.isPresent()) {
                logger.info("Found prediction with ID: {}", id);
                return ResponseEntity.ok(prediction.get());
            } else {
                logger.warn("Prediction not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving prediction by ID {}: {}", id, e.getMessage(), e);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Failed to retrieve prediction",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Get fault type statistics
     */
    @GetMapping("/statistics/fault-types")
    public ResponseEntity<?> getFaultTypeStatistics() {
        logger.info("Received fault type statistics request");
        
        try {
            List<Object[]> statistics = predictionService.getFaultTypeStatistics();
            
            // Convert to more readable format
            Map<String, Long> faultTypeStats = new HashMap<>();
            for (Object[] stat : statistics) {
                faultTypeStats.put((String) stat[0], (Long) stat[1]);
            }
            
            logger.info("Retrieved fault type statistics: {}", faultTypeStats);
            return ResponseEntity.ok(faultTypeStats);
            
        } catch (Exception e) {
            logger.error("Error retrieving fault type statistics: {}", e.getMessage(), e);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Failed to retrieve statistics",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Solar Panel Fault Detection");
        health.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(health);
    }
}
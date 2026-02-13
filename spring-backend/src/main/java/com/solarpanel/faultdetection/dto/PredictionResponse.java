package com.solarpanel.faultdetection.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class PredictionResponse {
    
    private Long id;
    private String predictedFault;
    private String confidence;
    private Double confidenceScore;
    private String severity;
    private String description;
    private String maintenanceRecommendation;
    private Map<String, Object> inputValues;
    private Map<String, Double> allProbabilities;
    private LocalDateTime timestamp;
    
    // Default constructor
    public PredictionResponse() {}
    
    // Constructor with essential fields
    public PredictionResponse(String predictedFault, String confidence, Double confidenceScore, 
                            String severity, String description, String maintenanceRecommendation) {
        this.predictedFault = predictedFault;
        this.confidence = confidence;
        this.confidenceScore = confidenceScore;
        this.severity = severity;
        this.description = description;
        this.maintenanceRecommendation = maintenanceRecommendation;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getPredictedFault() {
        return predictedFault;
    }
    
    public void setPredictedFault(String predictedFault) {
        this.predictedFault = predictedFault;
    }
    
    public String getConfidence() {
        return confidence;
    }
    
    public void setConfidence(String confidence) {
        this.confidence = confidence;
    }
    
    public Double getConfidenceScore() {
        return confidenceScore;
    }
    
    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
    
    public String getSeverity() {
        return severity;
    }
    
    public void setSeverity(String severity) {
        this.severity = severity;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getMaintenanceRecommendation() {
        return maintenanceRecommendation;
    }
    
    public void setMaintenanceRecommendation(String maintenanceRecommendation) {
        this.maintenanceRecommendation = maintenanceRecommendation;
    }
    
    public Map<String, Object> getInputValues() {
        return inputValues;
    }
    
    public void setInputValues(Map<String, Object> inputValues) {
        this.inputValues = inputValues;
    }
    
    public Map<String, Double> getAllProbabilities() {
        return allProbabilities;
    }
    
    public void setAllProbabilities(Map<String, Double> allProbabilities) {
        this.allProbabilities = allProbabilities;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    @Override
    public String toString() {
        return "PredictionResponse{" +
                "id=" + id +
                ", predictedFault='" + predictedFault + '\'' +
                ", confidence='" + confidence + '\'' +
                ", confidenceScore=" + confidenceScore +
                ", severity='" + severity + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
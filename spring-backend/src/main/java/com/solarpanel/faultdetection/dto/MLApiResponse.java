package com.solarpanel.faultdetection.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class MLApiResponse {
    
    @JsonProperty("predicted_fault")
    private String predictedFault;
    
    @JsonProperty("confidence")
    private String confidence;
    
    @JsonProperty("confidence_score")
    private Double confidenceScore;
    
    @JsonProperty("severity")
    private String severity;
    
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("maintenance_recommendation")
    private String maintenanceRecommendation;
    
    @JsonProperty("input_values")
    private Map<String, Object> inputValues;
    
    @JsonProperty("all_probabilities")
    private Map<String, Double> allProbabilities;
    
    // Default constructor
    public MLApiResponse() {}
    
    // Getters and Setters
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
    
    @Override
    public String toString() {
        return "MLApiResponse{" +
                "predictedFault='" + predictedFault + '\'' +
                ", confidence='" + confidence + '\'' +
                ", confidenceScore=" + confidenceScore +
                ", severity='" + severity + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
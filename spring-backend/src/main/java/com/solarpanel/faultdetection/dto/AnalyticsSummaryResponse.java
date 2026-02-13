package com.solarpanel.faultdetection.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class AnalyticsSummaryResponse {
    
    private Long totalPredictions;
    private Map<String, Long> faultTypeCounts;
    private Map<String, Long> severityCounts;
    private Map<String, Double> faultTypePercentages;
    private Map<String, Double> severityPercentages;
    private LocalDateTime lastUpdated;
    private String mostCommonFault;
    private String mostCommonSeverity;
    private Long criticalFaults;
    private Long normalOperations;
    
    // Default constructor
    public AnalyticsSummaryResponse() {
        this.lastUpdated = LocalDateTime.now();
    }
    
    // Constructor with essential fields
    public AnalyticsSummaryResponse(Long totalPredictions, Map<String, Long> faultTypeCounts, 
                                  Map<String, Long> severityCounts) {
        this.totalPredictions = totalPredictions;
        this.faultTypeCounts = faultTypeCounts;
        this.severityCounts = severityCounts;
        this.lastUpdated = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getTotalPredictions() {
        return totalPredictions;
    }
    
    public void setTotalPredictions(Long totalPredictions) {
        this.totalPredictions = totalPredictions;
    }
    
    public Map<String, Long> getFaultTypeCounts() {
        return faultTypeCounts;
    }
    
    public void setFaultTypeCounts(Map<String, Long> faultTypeCounts) {
        this.faultTypeCounts = faultTypeCounts;
    }
    
    public Map<String, Long> getSeverityCounts() {
        return severityCounts;
    }
    
    public void setSeverityCounts(Map<String, Long> severityCounts) {
        this.severityCounts = severityCounts;
    }
    
    public Map<String, Double> getFaultTypePercentages() {
        return faultTypePercentages;
    }
    
    public void setFaultTypePercentages(Map<String, Double> faultTypePercentages) {
        this.faultTypePercentages = faultTypePercentages;
    }
    
    public Map<String, Double> getSeverityPercentages() {
        return severityPercentages;
    }
    
    public void setSeverityPercentages(Map<String, Double> severityPercentages) {
        this.severityPercentages = severityPercentages;
    }
    
    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
    
    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
    public String getMostCommonFault() {
        return mostCommonFault;
    }
    
    public void setMostCommonFault(String mostCommonFault) {
        this.mostCommonFault = mostCommonFault;
    }
    
    public String getMostCommonSeverity() {
        return mostCommonSeverity;
    }
    
    public void setMostCommonSeverity(String mostCommonSeverity) {
        this.mostCommonSeverity = mostCommonSeverity;
    }
    
    public Long getCriticalFaults() {
        return criticalFaults;
    }
    
    public void setCriticalFaults(Long criticalFaults) {
        this.criticalFaults = criticalFaults;
    }
    
    public Long getNormalOperations() {
        return normalOperations;
    }
    
    public void setNormalOperations(Long normalOperations) {
        this.normalOperations = normalOperations;
    }
    
    @Override
    public String toString() {
        return "AnalyticsSummaryResponse{" +
                "totalPredictions=" + totalPredictions +
                ", mostCommonFault='" + mostCommonFault + '\'' +
                ", mostCommonSeverity='" + mostCommonSeverity + '\'' +
                ", criticalFaults=" + criticalFaults +
                ", normalOperations=" + normalOperations +
                ", lastUpdated=" + lastUpdated +
                '}';
    }
}
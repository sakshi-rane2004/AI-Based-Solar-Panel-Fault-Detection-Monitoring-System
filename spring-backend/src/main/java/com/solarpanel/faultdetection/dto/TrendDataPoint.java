package com.solarpanel.faultdetection.dto;

import java.time.LocalDate;
import java.util.Map;

public class TrendDataPoint {
    
    private LocalDate date;
    private Long totalCount;
    private Map<String, Long> faultTypeCounts;
    private Map<String, Long> severityCounts;
    
    // Default constructor
    public TrendDataPoint() {}
    
    // Constructor with essential fields
    public TrendDataPoint(LocalDate date, Long totalCount) {
        this.date = date;
        this.totalCount = totalCount;
    }
    
    // Constructor with all fields
    public TrendDataPoint(LocalDate date, Long totalCount, 
                         Map<String, Long> faultTypeCounts, 
                         Map<String, Long> severityCounts) {
        this.date = date;
        this.totalCount = totalCount;
        this.faultTypeCounts = faultTypeCounts;
        this.severityCounts = severityCounts;
    }
    
    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public Long getTotalCount() {
        return totalCount;
    }
    
    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
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
    
    @Override
    public String toString() {
        return "TrendDataPoint{" +
                "date=" + date +
                ", totalCount=" + totalCount +
                ", faultTypeCounts=" + faultTypeCounts +
                ", severityCounts=" + severityCounts +
                '}';
    }
}
package com.solarpanel.faultdetection.dto;

import java.time.LocalDate;
import java.util.List;

public class AnalyticsTrendsResponse {
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays;
    private List<TrendDataPoint> dailyTrends;
    private Long totalPredictionsInPeriod;
    private String mostActiveFaultType;
    private String trendDirection; // "INCREASING", "DECREASING", "STABLE"
    
    // Default constructor
    public AnalyticsTrendsResponse() {}
    
    // Constructor with essential fields
    public AnalyticsTrendsResponse(LocalDate startDate, LocalDate endDate, 
                                 List<TrendDataPoint> dailyTrends) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.dailyTrends = dailyTrends;
        this.totalDays = dailyTrends != null ? dailyTrends.size() : 0;
    }
    
    // Getters and Setters
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public Integer getTotalDays() {
        return totalDays;
    }
    
    public void setTotalDays(Integer totalDays) {
        this.totalDays = totalDays;
    }
    
    public List<TrendDataPoint> getDailyTrends() {
        return dailyTrends;
    }
    
    public void setDailyTrends(List<TrendDataPoint> dailyTrends) {
        this.dailyTrends = dailyTrends;
        this.totalDays = dailyTrends != null ? dailyTrends.size() : 0;
    }
    
    public Long getTotalPredictionsInPeriod() {
        return totalPredictionsInPeriod;
    }
    
    public void setTotalPredictionsInPeriod(Long totalPredictionsInPeriod) {
        this.totalPredictionsInPeriod = totalPredictionsInPeriod;
    }
    
    public String getMostActiveFaultType() {
        return mostActiveFaultType;
    }
    
    public void setMostActiveFaultType(String mostActiveFaultType) {
        this.mostActiveFaultType = mostActiveFaultType;
    }
    
    public String getTrendDirection() {
        return trendDirection;
    }
    
    public void setTrendDirection(String trendDirection) {
        this.trendDirection = trendDirection;
    }
    
    @Override
    public String toString() {
        return "AnalyticsTrendsResponse{" +
                "startDate=" + startDate +
                ", endDate=" + endDate +
                ", totalDays=" + totalDays +
                ", totalPredictionsInPeriod=" + totalPredictionsInPeriod +
                ", mostActiveFaultType='" + mostActiveFaultType + '\'' +
                ", trendDirection='" + trendDirection + '\'' +
                '}';
    }
}
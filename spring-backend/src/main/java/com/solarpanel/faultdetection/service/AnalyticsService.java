package com.solarpanel.faultdetection.service;

import com.solarpanel.faultdetection.dto.AnalyticsSummaryResponse;
import com.solarpanel.faultdetection.dto.AnalyticsTrendsResponse;
import com.solarpanel.faultdetection.dto.TrendDataPoint;
import com.solarpanel.faultdetection.entity.PredictionResult;
import com.solarpanel.faultdetection.repository.PredictionResultRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);
    
    @Autowired
    private PredictionResultRepository predictionRepository;
    
    /**
     * Get comprehensive analytics summary
     */
    public AnalyticsSummaryResponse getAnalyticsSummary() {
        logger.info("Generating analytics summary");
        
        try {
            // Get total predictions count
            long totalPredictions = predictionRepository.count();
            
            // Get fault type counts
            Map<String, Long> faultTypeCounts = getFaultTypeCounts();
            
            // Get severity counts
            Map<String, Long> severityCounts = getSeverityCounts();
            
            // Calculate percentages
            Map<String, Double> faultTypePercentages = calculatePercentages(faultTypeCounts, totalPredictions);
            Map<String, Double> severityPercentages = calculatePercentages(severityCounts, totalPredictions);
            
            // Create response
            AnalyticsSummaryResponse response = new AnalyticsSummaryResponse(
                totalPredictions, faultTypeCounts, severityCounts
            );
            
            response.setFaultTypePercentages(faultTypePercentages);
            response.setSeverityPercentages(severityPercentages);
            
            // Set derived metrics
            response.setMostCommonFault(getMostCommonValue(faultTypeCounts));
            response.setMostCommonSeverity(getMostCommonValue(severityCounts));
            response.setCriticalFaults(severityCounts.getOrDefault("Critical", 0L));
            response.setNormalOperations(faultTypeCounts.getOrDefault("NORMAL", 0L));
            
            logger.info("Analytics summary generated: {} total predictions, most common fault: {}", 
                       totalPredictions, response.getMostCommonFault());
            
            return response;
            
        } catch (Exception e) {
            logger.error("Error generating analytics summary: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate analytics summary: " + e.getMessage());
        }
    }
    
    /**
     * Get trends data for specified date range
     */
    public AnalyticsTrendsResponse getAnalyticsTrends(LocalDate startDate, LocalDate endDate) {
        logger.info("Generating analytics trends from {} to {}", startDate, endDate);
        
        try {
            // Validate date range
            if (startDate.isAfter(endDate)) {
                throw new IllegalArgumentException("Start date cannot be after end date");
            }
            
            // Get predictions in date range
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
            
            List<PredictionResult> predictions = predictionRepository
                .findByCreatedAtBetweenOrderByCreatedAtDesc(startDateTime, endDateTime);
            
            // Group predictions by date
            Map<LocalDate, List<PredictionResult>> predictionsByDate = predictions.stream()
                .collect(Collectors.groupingBy(p -> p.getCreatedAt().toLocalDate()));
            
            // Create trend data points
            List<TrendDataPoint> dailyTrends = new ArrayList<>();
            
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                List<PredictionResult> dayPredictions = predictionsByDate.getOrDefault(currentDate, Collections.emptyList());
                
                TrendDataPoint dataPoint = createTrendDataPoint(currentDate, dayPredictions);
                dailyTrends.add(dataPoint);
                
                currentDate = currentDate.plusDays(1);
            }
            
            // Create response
            AnalyticsTrendsResponse response = new AnalyticsTrendsResponse(startDate, endDate, dailyTrends);
            
            // Calculate derived metrics
            long totalPredictionsInPeriod = predictions.size();
            response.setTotalPredictionsInPeriod(totalPredictionsInPeriod);
            response.setMostActiveFaultType(getMostActiveFaultType(predictions));
            response.setTrendDirection(calculateTrendDirection(dailyTrends));
            
            logger.info("Analytics trends generated: {} days, {} total predictions", 
                       dailyTrends.size(), totalPredictionsInPeriod);
            
            return response;
            
        } catch (Exception e) {
            logger.error("Error generating analytics trends: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate analytics trends: " + e.getMessage());
        }
    }
    
    /**
     * Get trends for last N days
     */
    public AnalyticsTrendsResponse getAnalyticsTrends(int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);
        
        return getAnalyticsTrends(startDate, endDate);
    }
    
    /**
     * Get fault type counts from database
     */
    private Map<String, Long> getFaultTypeCounts() {
        List<Object[]> results = predictionRepository.countByFaultType();
        
        Map<String, Long> counts = new HashMap<>();
        for (Object[] result : results) {
            String faultType = (String) result[0];
            Long count = (Long) result[1];
            counts.put(faultType, count);
        }
        
        return counts;
    }
    
    /**
     * Get severity counts from database
     */
    private Map<String, Long> getSeverityCounts() {
        List<Object[]> results = predictionRepository.countBySeverity();
        
        Map<String, Long> counts = new HashMap<>();
        for (Object[] result : results) {
            String severity = (String) result[0];
            Long count = (Long) result[1];
            counts.put(severity, count);
        }
        
        return counts;
    }
    
    /**
     * Calculate percentages from counts
     */
    private Map<String, Double> calculatePercentages(Map<String, Long> counts, long total) {
        if (total == 0) {
            return new HashMap<>();
        }
        
        Map<String, Double> percentages = new HashMap<>();
        for (Map.Entry<String, Long> entry : counts.entrySet()) {
            double percentage = (entry.getValue().doubleValue() / total) * 100.0;
            percentages.put(entry.getKey(), Math.round(percentage * 100.0) / 100.0); // Round to 2 decimal places
        }
        
        return percentages;
    }
    
    /**
     * Get most common value from counts map
     */
    private String getMostCommonValue(Map<String, Long> counts) {
        return counts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("Unknown");
    }
    
    /**
     * Create trend data point for a specific date
     */
    private TrendDataPoint createTrendDataPoint(LocalDate date, List<PredictionResult> predictions) {
        long totalCount = predictions.size();
        
        // Count by fault type
        Map<String, Long> faultTypeCounts = predictions.stream()
            .collect(Collectors.groupingBy(
                PredictionResult::getPredictedFault,
                Collectors.counting()
            ));
        
        // Count by severity
        Map<String, Long> severityCounts = predictions.stream()
            .collect(Collectors.groupingBy(
                PredictionResult::getSeverity,
                Collectors.counting()
            ));
        
        return new TrendDataPoint(date, totalCount, faultTypeCounts, severityCounts);
    }
    
    /**
     * Get most active fault type from predictions list
     */
    private String getMostActiveFaultType(List<PredictionResult> predictions) {
        Map<String, Long> faultCounts = predictions.stream()
            .collect(Collectors.groupingBy(
                PredictionResult::getPredictedFault,
                Collectors.counting()
            ));
        
        return getMostCommonValue(faultCounts);
    }
    
    /**
     * Calculate trend direction based on daily trends
     */
    private String calculateTrendDirection(List<TrendDataPoint> dailyTrends) {
        if (dailyTrends.size() < 3) {
            return "INSUFFICIENT_DATA";
        }
        
        // Calculate trend using first and last few days
        int sampleSize = Math.min(3, dailyTrends.size() / 3);
        
        double startAverage = dailyTrends.subList(0, sampleSize).stream()
            .mapToLong(TrendDataPoint::getTotalCount)
            .average()
            .orElse(0.0);
        
        double endAverage = dailyTrends.subList(dailyTrends.size() - sampleSize, dailyTrends.size()).stream()
            .mapToLong(TrendDataPoint::getTotalCount)
            .average()
            .orElse(0.0);
        
        double changePercentage = startAverage > 0 ? ((endAverage - startAverage) / startAverage) * 100 : 0;
        
        if (changePercentage > 10) {
            return "INCREASING";
        } else if (changePercentage < -10) {
            return "DECREASING";
        } else {
            return "STABLE";
        }
    }
}
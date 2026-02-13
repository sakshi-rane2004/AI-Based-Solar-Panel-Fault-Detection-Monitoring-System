package com.solarpanel.faultdetection.controller;

import com.solarpanel.faultdetection.dto.AnalyticsSummaryResponse;
import com.solarpanel.faultdetection.dto.AnalyticsTrendsResponse;
import com.solarpanel.faultdetection.dto.TrendDataPoint;
import com.solarpanel.faultdetection.service.AnalyticsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnalyticsController.class)
public class AnalyticsControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private AnalyticsService analyticsService;
    
    @Test
    public void testGetAnalyticsSummary_Success() throws Exception {
        // Prepare mock data
        Map<String, Long> faultTypeCounts = new HashMap<>();
        faultTypeCounts.put("NORMAL", 100L);
        faultTypeCounts.put("PARTIAL_SHADING", 20L);
        
        Map<String, Long> severityCounts = new HashMap<>();
        severityCounts.put("None", 100L);
        severityCounts.put("Medium", 20L);
        
        AnalyticsSummaryResponse mockSummary = new AnalyticsSummaryResponse(120L, faultTypeCounts, severityCounts);
        mockSummary.setMostCommonFault("NORMAL");
        mockSummary.setMostCommonSeverity("None");
        mockSummary.setCriticalFaults(0L);
        mockSummary.setNormalOperations(100L);
        
        when(analyticsService.getAnalyticsSummary()).thenReturn(mockSummary);
        
        // Perform request and verify response
        mockMvc.perform(get("/api/v1/analytics/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPredictions").value(120))
                .andExpect(jsonPath("$.mostCommonFault").value("NORMAL"))
                .andExpect(jsonPath("$.mostCommonSeverity").value("None"))
                .andExpect(jsonPath("$.criticalFaults").value(0))
                .andExpect(jsonPath("$.normalOperations").value(100));
    }
    
    @Test
    public void testGetAnalyticsTrends_Success() throws Exception {
        // Prepare mock data
        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        
        TrendDataPoint dataPoint1 = new TrendDataPoint(startDate, 10L);
        TrendDataPoint dataPoint2 = new TrendDataPoint(endDate, 15L);
        
        AnalyticsTrendsResponse mockTrends = new AnalyticsTrendsResponse(
            startDate, endDate, Arrays.asList(dataPoint1, dataPoint2)
        );
        mockTrends.setTotalPredictionsInPeriod(25L);
        mockTrends.setMostActiveFaultType("NORMAL");
        mockTrends.setTrendDirection("INCREASING");
        
        when(analyticsService.getAnalyticsTrends(anyInt())).thenReturn(mockTrends);
        
        // Perform request and verify response
        mockMvc.perform(get("/api/v1/analytics/trends?days=7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPredictionsInPeriod").value(25))
                .andExpect(jsonPath("$.mostActiveFaultType").value("NORMAL"))
                .andExpect(jsonPath("$.trendDirection").value("INCREASING"))
                .andExpect(jsonPath("$.dailyTrends").isArray())
                .andExpect(jsonPath("$.dailyTrends.length()").value(2));
    }
    
    @Test
    public void testGetAnalyticsTrendsLastDays_Success() throws Exception {
        // Prepare mock data
        AnalyticsTrendsResponse mockTrends = new AnalyticsTrendsResponse();
        mockTrends.setTotalPredictionsInPeriod(50L);
        
        when(analyticsService.getAnalyticsTrends(30)).thenReturn(mockTrends);
        
        // Perform request and verify response
        mockMvc.perform(get("/api/v1/analytics/trends/last/30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPredictionsInPeriod").value(50));
    }
    
    @Test
    public void testGetAnalyticsTrendsLastDays_InvalidDays() throws Exception {
        // Test with invalid days parameter
        mockMvc.perform(get("/api/v1/analytics/trends/last/500"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid days parameter"));
    }
    
    @Test
    public void testAnalyticsHealthCheck() throws Exception {
        // Prepare mock data
        AnalyticsSummaryResponse mockSummary = new AnalyticsSummaryResponse();
        mockSummary.setTotalPredictions(100L);
        
        when(analyticsService.getAnalyticsSummary()).thenReturn(mockSummary);
        
        // Perform request and verify response
        mockMvc.perform(get("/api/v1/analytics/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("Analytics Service"))
                .andExpect(jsonPath("$.totalPredictions").value(100));
    }
}
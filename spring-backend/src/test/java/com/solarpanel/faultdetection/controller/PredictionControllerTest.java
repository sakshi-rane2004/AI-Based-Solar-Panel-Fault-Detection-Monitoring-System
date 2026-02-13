package com.solarpanel.faultdetection.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.solarpanel.faultdetection.dto.PredictionResponse;
import com.solarpanel.faultdetection.dto.SensorDataRequest;
import com.solarpanel.faultdetection.service.PredictionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PredictionController.class)
public class PredictionControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private PredictionService predictionService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    public void testAnalyzeSensorData_Success() throws Exception {
        // Prepare test data
        SensorDataRequest request = new SensorDataRequest(32.5, 8.2, 25.0, 850.0, 266.5);
        
        PredictionResponse mockResponse = new PredictionResponse(
            "NORMAL", "High", 0.95, "None", 
            "Panel is operating normally", "Continue regular monitoring"
        );
        mockResponse.setId(1L);
        mockResponse.setTimestamp(LocalDateTime.now());
        
        when(predictionService.analyzeSensorData(any(SensorDataRequest.class)))
            .thenReturn(mockResponse);
        
        // Perform request and verify response
        mockMvc.perform(post("/api/v1/solar-panel/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.predictedFault").value("NORMAL"))
                .andExpect(jsonPath("$.confidence").value("High"))
                .andExpect(jsonPath("$.confidenceScore").value(0.95))
                .andExpect(jsonPath("$.severity").value("None"));
    }
    
    @Test
    public void testAnalyzeSensorData_ValidationError() throws Exception {
        // Prepare invalid test data (negative voltage)
        SensorDataRequest request = new SensorDataRequest(-10.0, 8.2, 25.0, 850.0, 266.5);
        
        // Perform request and verify validation error
        mockMvc.perform(post("/api/v1/solar-panel/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"));
    }
    
    @Test
    public void testGetPredictionHistory_Success() throws Exception {
        // Prepare mock data
        List<PredictionResponse> mockHistory = Arrays.asList(
            createMockPredictionResponse(1L, "NORMAL"),
            createMockPredictionResponse(2L, "PARTIAL_SHADING")
        );
        
        when(predictionService.getAllPredictions()).thenReturn(mockHistory);
        
        // Perform request and verify response
        mockMvc.perform(get("/api/v1/solar-panel/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].predictedFault").value("NORMAL"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].predictedFault").value("PARTIAL_SHADING"));
    }
    
    @Test
    public void testHealthCheck() throws Exception {
        mockMvc.perform(get("/api/v1/solar-panel/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("Solar Panel Fault Detection"));
    }
    
    private PredictionResponse createMockPredictionResponse(Long id, String faultType) {
        PredictionResponse response = new PredictionResponse(
            faultType, "High", 0.9, "Medium", 
            "Test description", "Test recommendation"
        );
        response.setId(id);
        response.setTimestamp(LocalDateTime.now());
        return response;
    }
}
package com.solarpanel.faultdetection.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.solarpanel.faultdetection.dto.SensorDataRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
public class ApiIntegrationTest {
    
    @Autowired
    private WebApplicationContext webApplicationContext;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private MockMvc mockMvc;
    
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }
    
    @Test
    public void testHealthEndpoint() throws Exception {
        setup();
        
        mockMvc.perform(get("/solar-panel/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("Solar Panel Fault Detection"));
    }
    
    @Test
    public void testAnalyzeEndpointValidation() throws Exception {
        setup();
        
        // Test with invalid data (negative voltage)
        SensorDataRequest invalidRequest = new SensorDataRequest(-10.0, 8.2, 25.0, 850.0, 266.5);
        
        mockMvc.perform(post("/solar-panel/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"));
    }
    
    @Test
    public void testHistoryEndpoint() throws Exception {
        setup();
        
        mockMvc.perform(get("/solar-panel/history"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
package com.solarpanel.faultdetection.service;

import com.solarpanel.faultdetection.dto.SensorDataRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class SeverityAssessmentServiceTest {
    
    @InjectMocks
    private SeverityAssessmentService severityAssessmentService;
    
    private SensorDataRequest normalSensorData;
    private SensorDataRequest criticalSensorData;
    
    @BeforeEach
    void setUp() {
        normalSensorData = new SensorDataRequest(32.5, 8.2, 25.0, 850.0, 266.5);
        criticalSensorData = new SensorDataRequest(10.0, 0.5, 70.0, 100.0, 30.0);
    }
    
    @Test
    void testAssessSeverity_NormalFault() {
        String severity = severityAssessmentService.assessSeverity("NORMAL", normalSensorData, 0.95);
        assertEquals("None", severity);
    }
    
    @Test
    void testAssessSeverity_InverterFault() {
        String severity = severityAssessmentService.assessSeverity("INVERTER_FAULT", normalSensorData, 0.90);
        assertEquals("Critical", severity);
    }
    
    @Test
    void testAssessSeverity_LowConfidence() {
        String severity = severityAssessmentService.assessSeverity("PANEL_DEGRADATION", normalSensorData, 0.50);
        assertEquals("Medium", severity); // Reduced from High due to low confidence
    }
    
    @Test
    void testAssessSeverity_CriticalSensorData() {
        String severity = severityAssessmentService.assessSeverity("DUST_ACCUMULATION", criticalSensorData, 0.80);
        assertEquals("Critical", severity); // Escalated due to critical sensor conditions
    }
    
    @Test
    void testGetMaintenanceRecommendation_Normal() {
        String recommendation = severityAssessmentService.getMaintenanceRecommendation("NORMAL", "None");
        assertTrue(recommendation.contains("Continue regular monitoring"));
    }
    
    @Test
    void testGetMaintenanceRecommendation_Critical() {
        String recommendation = severityAssessmentService.getMaintenanceRecommendation("INVERTER_FAULT", "Critical");
        assertTrue(recommendation.contains("URGENT"));
        assertTrue(recommendation.contains("Shut down system"));
    }
    
    @Test
    void testIsCriticalSeverity() {
        assertTrue(severityAssessmentService.isCriticalSeverity("Critical"));
        assertFalse(severityAssessmentService.isCriticalSeverity("High"));
    }
    
    @Test
    void testIsNormalSeverity() {
        assertTrue(severityAssessmentService.isNormalSeverity("None"));
        assertFalse(severityAssessmentService.isNormalSeverity("Low"));
    }
}
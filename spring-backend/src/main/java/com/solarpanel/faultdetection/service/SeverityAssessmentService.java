package com.solarpanel.faultdetection.service;

import com.solarpanel.faultdetection.dto.SensorDataRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SeverityAssessmentService {
    
    private static final Logger logger = LoggerFactory.getLogger(SeverityAssessmentService.class);
    
    // Severity levels
    public enum SeverityLevel {
        NONE("None"),
        LOW("Low"),
        MEDIUM("Medium"),
        HIGH("High"),
        CRITICAL("Critical");
        
        private final String displayName;
        
        SeverityLevel(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Fault type severity mappings
    private static final Map<String, SeverityLevel> BASE_FAULT_SEVERITY = new HashMap<>();
    
    static {
        BASE_FAULT_SEVERITY.put("NORMAL", SeverityLevel.NONE);
        BASE_FAULT_SEVERITY.put("DUST_ACCUMULATION", SeverityLevel.LOW);
        BASE_FAULT_SEVERITY.put("PARTIAL_SHADING", SeverityLevel.MEDIUM);
        BASE_FAULT_SEVERITY.put("PANEL_DEGRADATION", SeverityLevel.HIGH);
        BASE_FAULT_SEVERITY.put("INVERTER_FAULT", SeverityLevel.CRITICAL);
    }
    
    /**
     * Assess severity based on fault type, sensor data, and confidence score
     */
    public String assessSeverity(String faultType, SensorDataRequest sensorData, Double confidenceScore) {
        logger.debug("Assessing severity for fault type: {}, confidence: {}", faultType, confidenceScore);
        
        // Get base severity for fault type
        SeverityLevel baseSeverity = BASE_FAULT_SEVERITY.getOrDefault(faultType, SeverityLevel.MEDIUM);
        
        // Adjust severity based on confidence score
        SeverityLevel adjustedSeverity = adjustSeverityByConfidence(baseSeverity, confidenceScore);
        
        // Further adjust based on sensor thresholds
        SeverityLevel finalSeverity = adjustSeverityBySensorData(adjustedSeverity, faultType, sensorData);
        
        String result = finalSeverity.getDisplayName();
        logger.info("Final severity assessment: {} for fault type: {}", result, faultType);
        
        return result;
    }
    
    /**
     * Get maintenance recommendation based on fault type and severity
     */
    public String getMaintenanceRecommendation(String faultType, String severity) {
        logger.debug("Getting maintenance recommendation for fault: {}, severity: {}", faultType, severity);
        
        String recommendation = getBaseMaintenanceRecommendation(faultType);
        
        // Enhance recommendation based on severity
        recommendation = enhanceRecommendationBySeverity(recommendation, severity, faultType);
        
        logger.debug("Generated maintenance recommendation: {}", recommendation);
        return recommendation;
    }
    
    /**
     * Adjust severity based on confidence score
     */
    private SeverityLevel adjustSeverityByConfidence(SeverityLevel baseSeverity, Double confidenceScore) {
        if (confidenceScore == null) {
            return baseSeverity;
        }
        
        // Lower confidence reduces severity assessment reliability
        if (confidenceScore < 0.6) {
            // For low confidence, reduce severity by one level (but not below LOW for actual faults)
            if (baseSeverity == SeverityLevel.CRITICAL) return SeverityLevel.HIGH;
            if (baseSeverity == SeverityLevel.HIGH) return SeverityLevel.MEDIUM;
            if (baseSeverity == SeverityLevel.MEDIUM) return SeverityLevel.LOW;
            return baseSeverity; // Keep NONE and LOW as is
        }
        
        return baseSeverity; // High confidence keeps original severity
    }
    
    /**
     * Adjust severity based on sensor data thresholds
     */
    private SeverityLevel adjustSeverityBySensorData(SeverityLevel baseSeverity, String faultType, 
                                                   SensorDataRequest sensorData) {
        
        // Critical sensor thresholds that escalate severity
        boolean criticalVoltage = sensorData.getVoltage() < 15.0 || sensorData.getVoltage() > 45.0;
        boolean criticalCurrent = sensorData.getCurrent() < 1.0 || sensorData.getCurrent() > 15.0;
        boolean criticalTemperature = sensorData.getTemperature() > 60.0 || sensorData.getTemperature() < -10.0;
        boolean criticalPower = sensorData.getPower() < 50.0;
        
        // Count critical conditions
        int criticalConditions = 0;
        if (criticalVoltage) criticalConditions++;
        if (criticalCurrent) criticalConditions++;
        if (criticalTemperature) criticalConditions++;
        if (criticalPower) criticalConditions++;
        
        // Escalate severity based on critical conditions
        if (criticalConditions >= 3) {
            return SeverityLevel.CRITICAL;
        } else if (criticalConditions >= 2) {
            // Escalate by one level
            if (baseSeverity == SeverityLevel.HIGH) return SeverityLevel.CRITICAL;
            if (baseSeverity == SeverityLevel.MEDIUM) return SeverityLevel.HIGH;
            if (baseSeverity == SeverityLevel.LOW) return SeverityLevel.MEDIUM;
        } else if (criticalConditions == 1) {
            // Minor escalation for single critical condition
            if (baseSeverity == SeverityLevel.MEDIUM) return SeverityLevel.HIGH;
            if (baseSeverity == SeverityLevel.LOW) return SeverityLevel.MEDIUM;
        }
        
        // Specific fault type adjustments
        if ("INVERTER_FAULT".equals(faultType) && criticalVoltage) {
            return SeverityLevel.CRITICAL; // Voltage issues with inverter faults are always critical
        }
        
        if ("PANEL_DEGRADATION".equals(faultType) && criticalPower) {
            return SeverityLevel.CRITICAL; // Severe power loss indicates critical degradation
        }
        
        return baseSeverity;
    }
    
    /**
     * Get base maintenance recommendation for fault type
     */
    private String getBaseMaintenanceRecommendation(String faultType) {
        switch (faultType) {
            case "NORMAL":
                return "Continue regular monitoring. No immediate action required.";
            
            case "DUST_ACCUMULATION":
                return "Clean panel surface with appropriate cleaning equipment. Schedule regular cleaning maintenance.";
            
            case "PARTIAL_SHADING":
                return "Check for obstructions (trees, buildings, debris) and remove if possible. Consider panel repositioning if permanent shading exists.";
            
            case "PANEL_DEGRADATION":
                return "Schedule professional inspection for panel degradation assessment. Consider panel replacement if degradation is severe.";
            
            case "INVERTER_FAULT":
                return "Contact qualified technician immediately for inverter inspection and repair. System may need to be shut down for safety.";
            
            default:
                return "Consult with solar panel technician for detailed system assessment.";
        }
    }
    
    /**
     * Enhance recommendation based on severity level
     */
    private String enhanceRecommendationBySeverity(String baseRecommendation, String severity, String faultType) {
        switch (severity.toUpperCase()) {
            case "CRITICAL":
                if ("INVERTER_FAULT".equals(faultType)) {
                    return "URGENT: " + baseRecommendation + " Shut down system immediately to prevent damage or safety hazards.";
                } else {
                    return "URGENT: " + baseRecommendation + " Immediate professional attention required to prevent system damage.";
                }
            
            case "HIGH":
                return "HIGH PRIORITY: " + baseRecommendation + " Address within 24-48 hours to prevent further deterioration.";
            
            case "MEDIUM":
                return "MODERATE PRIORITY: " + baseRecommendation + " Schedule maintenance within 1-2 weeks.";
            
            case "LOW":
                return "LOW PRIORITY: " + baseRecommendation + " Can be addressed during next scheduled maintenance.";
            
            case "NONE":
            default:
                return baseRecommendation;
        }
    }
    
    /**
     * Get all available severity levels
     */
    public String[] getAllSeverityLevels() {
        return new String[]{
            SeverityLevel.NONE.getDisplayName(),
            SeverityLevel.LOW.getDisplayName(),
            SeverityLevel.MEDIUM.getDisplayName(),
            SeverityLevel.HIGH.getDisplayName(),
            SeverityLevel.CRITICAL.getDisplayName()
        };
    }
    
    /**
     * Check if severity level is critical
     */
    public boolean isCriticalSeverity(String severity) {
        return SeverityLevel.CRITICAL.getDisplayName().equalsIgnoreCase(severity);
    }
    
    /**
     * Check if severity level indicates normal operation
     */
    public boolean isNormalSeverity(String severity) {
        return SeverityLevel.NONE.getDisplayName().equalsIgnoreCase(severity);
    }
}
package com.solarpanel.faultdetection.service;

import com.solarpanel.faultdetection.dto.PredictionResponse;
import com.solarpanel.faultdetection.dto.SensorDataDTO;
import com.solarpanel.faultdetection.dto.SensorDataRequest;
import com.solarpanel.faultdetection.entity.Alert;
import com.solarpanel.faultdetection.entity.PredictionResult;
import com.solarpanel.faultdetection.entity.SensorData;
import com.solarpanel.faultdetection.repository.AlertRepository;
import com.solarpanel.faultdetection.repository.SensorDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SensorDataService {
    
    private final SensorDataRepository sensorDataRepository;
    private final AlertRepository alertRepository;
    private final PredictionService predictionService;
    
    @Transactional
    public PredictionResponse processSensorData(SensorDataDTO sensorDataDTO) {
        log.info("Processing sensor data for panel: {}", sensorDataDTO.getPanelId());
        
        // 1. Save sensor data
        SensorData sensorData = new SensorData();
        sensorData.setPanelId(sensorDataDTO.getPanelId());
        sensorData.setVoltage(sensorDataDTO.getVoltage());
        sensorData.setCurrent(sensorDataDTO.getCurrent());
        sensorData.setTemperature(sensorDataDTO.getTemperature());
        sensorData.setIrradiance(sensorDataDTO.getIrradiance());
        sensorData.setPower(sensorDataDTO.getPower());
        sensorData.setTimestamp(sensorDataDTO.getTimestamp() != null ? 
            sensorDataDTO.getTimestamp() : LocalDateTime.now());
        
        sensorDataRepository.save(sensorData);
        log.info("Sensor data saved with ID: {}", sensorData.getId());
        
        // 2. Create prediction request
        SensorDataRequest predictionRequest = new SensorDataRequest();
        predictionRequest.setVoltage(sensorDataDTO.getVoltage());
        predictionRequest.setCurrent(sensorDataDTO.getCurrent());
        predictionRequest.setTemperature(sensorDataDTO.getTemperature());
        predictionRequest.setIrradiance(sensorDataDTO.getIrradiance());
        predictionRequest.setPower(sensorDataDTO.getPower());
        
        // 3. Get ML prediction
        PredictionResponse prediction = predictionService.analyzeSensorData(predictionRequest);
        log.info("ML prediction completed: {} - {}", prediction.getPredictedFault(), prediction.getSeverity());
        
        // 4. Generate alert if fault detected
        if (!"NORMAL".equals(prediction.getPredictedFault())) {
            generateAlert(sensorDataDTO.getPanelId(), prediction);
        }
        
        return prediction;
    }
    
    private void generateAlert(String panelId, PredictionResponse prediction) {
        log.info("Generating alert for panel {} - Fault: {}", panelId, prediction.getPredictedFault());
        
        Alert alert = new Alert();
        alert.setPanelId(panelId);
        alert.setFaultType(prediction.getPredictedFault());
        alert.setSeverity(prediction.getSeverity());
        alert.setMessage(generateAlertMessage(prediction.getPredictedFault(), prediction.getSeverity()));
        alert.setConfidence(prediction.getConfidence());
        alert.setConfidenceScore(prediction.getConfidenceScore());
        alert.setCreatedAt(LocalDateTime.now());
        alert.setAcknowledged(false);
        
        alertRepository.save(alert);
        log.info("Alert created with ID: {}", alert.getId());
    }
    
    private String generateAlertMessage(String faultType, String severity) {
        String severityText = severity.equals("CRITICAL") ? "Critical" : 
                             severity.equals("HIGH") ? "High" : 
                             severity.equals("MEDIUM") ? "Medium" : "Low";
        
        switch (faultType) {
            case "INVERTER_FAULT":
                return severityText + " severity inverter fault detected. Immediate inspection recommended.";
            case "PARTIAL_SHADING":
                return severityText + " severity partial shading detected. Check for obstructions.";
            case "PANEL_DEGRADATION":
                return severityText + " severity panel degradation detected. Performance monitoring required.";
            case "DUST_ACCUMULATION":
                return severityText + " severity dust accumulation detected. Cleaning recommended.";
            default:
                return severityText + " severity fault detected in solar panel.";
        }
    }
}

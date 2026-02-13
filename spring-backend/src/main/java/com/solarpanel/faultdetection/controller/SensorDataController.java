package com.solarpanel.faultdetection.controller;

import com.solarpanel.faultdetection.dto.PredictionResponse;
import com.solarpanel.faultdetection.dto.SensorDataDTO;
import com.solarpanel.faultdetection.service.SensorDataService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sensor-data")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class SensorDataController {
    
    private final SensorDataService sensorDataService;
    
    @PostMapping
    public ResponseEntity<PredictionResponse> receiveSensorData(@Valid @RequestBody SensorDataDTO sensorData) {
        log.info("Received sensor data from panel: {}", sensorData.getPanelId());
        
        try {
            PredictionResponse response = sensorDataService.processSensorData(sensorData);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error processing sensor data", e);
            throw new RuntimeException("Failed to process sensor data: " + e.getMessage());
        }
    }
}

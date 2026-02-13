package com.solarpanel.faultdetection.service;

import com.solarpanel.faultdetection.dto.AlertResponse;
import com.solarpanel.faultdetection.entity.Alert;
import com.solarpanel.faultdetection.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {
    
    private final AlertRepository alertRepository;
    
    @Transactional(readOnly = true)
    public List<AlertResponse> getAllAlerts() {
        log.info("Fetching all alerts");
        return alertRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<AlertResponse> getAlertsByStatus(Alert.AlertStatus status) {
        log.info("Fetching alerts by status: {}", status);
        return alertRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AlertResponse updateAlertStatus(Long alertId, Alert.AlertStatus status, Long userId) {
        log.info("Updating alert {} status to {} by user {}", alertId, status, userId);
        
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found with ID: " + alertId));
        
        alert.setStatus(status);
        if (status == Alert.AlertStatus.RESOLVED) {
            alert.setResolvedAt(LocalDateTime.now());
        }
        
        Alert updatedAlert = alertRepository.save(alert);
        log.info("Alert status updated successfully");
        
        return mapToResponse(updatedAlert);
    }
    
    @Transactional
    public AlertResponse assignTechnician(Long alertId, Long technicianId) {
        log.info("Assigning technician {} to alert {}", technicianId, alertId);
        
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found with ID: " + alertId));
        
        alert.setAssignedTechnicianId(technicianId);
        if (alert.getStatus() == Alert.AlertStatus.OPEN) {
            alert.setStatus(Alert.AlertStatus.IN_PROGRESS);
        }
        
        Alert updatedAlert = alertRepository.save(alert);
        log.info("Technician assigned successfully");
        
        return mapToResponse(updatedAlert);
    }
    
    @Transactional
    public AlertResponse addTechnicianNotes(Long alertId, String notes) {
        log.info("Adding notes to alert {}", alertId);
        
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found with ID: " + alertId));
        
        alert.setTechnicianNotes(notes);
        
        Alert updatedAlert = alertRepository.save(alert);
        log.info("Notes added successfully");
        
        return mapToResponse(updatedAlert);
    }
    
    @Transactional(readOnly = true)
    public List<AlertResponse> getUnacknowledgedAlerts() {
        log.info("Fetching unacknowledged alerts");
        return alertRepository.findByAcknowledged(false).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<AlertResponse> getAlertsByPanel(String panelId) {
        log.info("Fetching alerts for panel: {}", panelId);
        return alertRepository.findByPanelId(panelId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<AlertResponse> getAlertsBySeverity(String severity) {
        log.info("Fetching alerts by severity: {}", severity);
        return alertRepository.findBySeverity(severity).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AlertResponse acknowledgeAlert(Long alertId, Long userId) {
        log.info("Acknowledging alert {} by user {}", alertId, userId);
        
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found with ID: " + alertId));
        
        alert.setAcknowledged(true);
        alert.setAcknowledgedAt(LocalDateTime.now());
        alert.setAcknowledgedBy(userId);
        
        Alert updatedAlert = alertRepository.save(alert);
        log.info("Alert acknowledged successfully");
        
        return mapToResponse(updatedAlert);
    }
    
    @Transactional(readOnly = true)
    public long getUnacknowledgedCount() {
        return alertRepository.countByAcknowledged(false);
    }
    
    @Transactional(readOnly = true)
    public long getCriticalCount() {
        return alertRepository.countBySeverity("CRITICAL");
    }
    
    private AlertResponse mapToResponse(Alert alert) {
        AlertResponse response = new AlertResponse();
        response.setId(alert.getId());
        response.setPanelId(alert.getPanelId());
        response.setFaultType(alert.getFaultType());
        response.setSeverity(alert.getSeverity());
        response.setMessage(alert.getMessage());
        response.setConfidence(alert.getConfidence());
        response.setConfidenceScore(alert.getConfidenceScore());
        response.setStatus(alert.getStatus().name());
        response.setCreatedAt(alert.getCreatedAt());
        response.setResolvedAt(alert.getResolvedAt());
        response.setAcknowledged(alert.getAcknowledged());
        response.setAcknowledgedAt(alert.getAcknowledgedAt());
        response.setAcknowledgedBy(alert.getAcknowledgedBy());
        response.setAssignedTechnicianId(alert.getAssignedTechnicianId());
        response.setTechnicianNotes(alert.getTechnicianNotes());
        return response;
    }
}

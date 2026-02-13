package com.solarpanel.faultdetection.service;

import com.solarpanel.faultdetection.dto.DashboardStatsResponse;
import com.solarpanel.faultdetection.entity.Alert;
import com.solarpanel.faultdetection.entity.SolarPanel;
import com.solarpanel.faultdetection.repository.AlertRepository;
import com.solarpanel.faultdetection.repository.SolarPanelRepository;
import com.solarpanel.faultdetection.repository.SolarPlantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {
    
    private final SolarPlantRepository plantRepository;
    private final SolarPanelRepository panelRepository;
    private final AlertRepository alertRepository;
    
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        log.info("Fetching dashboard statistics");
        
        DashboardStatsResponse stats = new DashboardStatsResponse();
        
        // Plant and Panel statistics
        stats.setTotalPlants(plantRepository.count());
        stats.setTotalPanels(panelRepository.count());
        stats.setActivePanels(panelRepository.countByStatus(SolarPanel.PanelStatus.ACTIVE));
        stats.setMaintenancePanels(panelRepository.countByStatus(SolarPanel.PanelStatus.MAINTENANCE));
        stats.setOfflinePanels(panelRepository.countByStatus(SolarPanel.PanelStatus.OFFLINE));
        
        // Alert statistics
        List<Alert> allAlerts = alertRepository.findAll();
        stats.setTotalAlerts((long) allAlerts.size());
        stats.setOpenAlerts(alertRepository.countByStatus(Alert.AlertStatus.OPEN));
        stats.setCriticalAlerts(alertRepository.countBySeverity("CRITICAL"));
        stats.setHighAlerts(alertRepository.countBySeverity("HIGH"));
        stats.setMediumAlerts(alertRepository.countBySeverity("MEDIUM"));
        stats.setLowAlerts(alertRepository.countBySeverity("LOW"));
        
        // Fault distribution
        Map<String, Long> faultDistribution = allAlerts.stream()
                .collect(Collectors.groupingBy(Alert::getFaultType, Collectors.counting()));
        stats.setFaultDistribution(faultDistribution);
        
        // Alerts by status
        Map<String, Long> alertsByStatus = new HashMap<>();
        alertsByStatus.put("OPEN", alertRepository.countByStatus(Alert.AlertStatus.OPEN));
        alertsByStatus.put("IN_PROGRESS", alertRepository.countByStatus(Alert.AlertStatus.IN_PROGRESS));
        alertsByStatus.put("RESOLVED", alertRepository.countByStatus(Alert.AlertStatus.RESOLVED));
        stats.setAlertsByStatus(alertsByStatus);
        
        log.info("Dashboard statistics fetched successfully");
        return stats;
    }
}

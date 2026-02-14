package com.solarpanel.faultdetection.service;

import com.solarpanel.faultdetection.dto.SolarPanelRequest;
import com.solarpanel.faultdetection.dto.SolarPanelResponse;
import com.solarpanel.faultdetection.entity.SolarPanel;
import com.solarpanel.faultdetection.entity.SolarPlant;
import com.solarpanel.faultdetection.repository.SolarPanelRepository;
import com.solarpanel.faultdetection.repository.SolarPlantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SolarPanelService {
    
    private final SolarPanelRepository panelRepository;
    private final SolarPlantRepository plantRepository;
    
    @Transactional
    public SolarPanelResponse createPanel(SolarPanelRequest request) {
        log.info("Creating new solar panel: {}", request.getPanelId());
        
        if (panelRepository.existsByPanelId(request.getPanelId())) {
            throw new RuntimeException("Panel with ID '" + request.getPanelId() + "' already exists");
        }
        
        SolarPlant plant = plantRepository.findById(request.getPlantId())
                .orElseThrow(() -> new RuntimeException("Plant not found with ID: " + request.getPlantId()));
        
        SolarPanel panel = new SolarPanel();
        panel.setPanelId(request.getPanelId());
        panel.setPlant(plant);
        panel.setInstallationDate(request.getInstallationDate());
        panel.setCapacity(request.getCapacity());
        panel.setStatus(request.getStatus() != null ? request.getStatus() : SolarPanel.PanelStatus.ACTIVE);
        panel.setAssignedTechnicianId(request.getAssignedTechnicianId());
        
        SolarPanel savedPanel = panelRepository.save(panel);
        log.info("Solar panel created successfully with ID: {}", savedPanel.getId());
        
        return mapToResponse(savedPanel);
    }
    
    @Transactional(readOnly = true)
    public List<SolarPanelResponse> getAllPanels() {
        log.info("Fetching all solar panels");
        return panelRepository.findAll().stream()
                .sorted((a, b) -> a.getId().compareTo(b.getId())) // Sort by ID (creation order)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<SolarPanelResponse> getPanelsByPlant(Long plantId) {
        log.info("Fetching panels for plant ID: {}", plantId);
        return panelRepository.findByPlantId(plantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public SolarPanelResponse getPanelById(Long id) {
        log.info("Fetching solar panel with ID: {}", id);
        SolarPanel panel = panelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Panel not found with ID: " + id));
        return mapToResponse(panel);
    }
    
    @Transactional
    public SolarPanelResponse updatePanel(Long id, SolarPanelRequest request) {
        log.info("Updating solar panel with ID: {}", id);
        
        SolarPanel panel = panelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Panel not found with ID: " + id));
        
        if (!panel.getPanelId().equals(request.getPanelId()) && panelRepository.existsByPanelId(request.getPanelId())) {
            throw new RuntimeException("Panel with ID '" + request.getPanelId() + "' already exists");
        }
        
        SolarPlant plant = plantRepository.findById(request.getPlantId())
                .orElseThrow(() -> new RuntimeException("Plant not found with ID: " + request.getPlantId()));
        
        panel.setPanelId(request.getPanelId());
        panel.setPlant(plant);
        panel.setInstallationDate(request.getInstallationDate());
        panel.setCapacity(request.getCapacity());
        panel.setStatus(request.getStatus() != null ? request.getStatus() : panel.getStatus());
        panel.setAssignedTechnicianId(request.getAssignedTechnicianId());
        
        SolarPanel updatedPanel = panelRepository.save(panel);
        log.info("Solar panel updated successfully");
        
        return mapToResponse(updatedPanel);
    }
    
    @Transactional
    public void deletePanel(Long id) {
        log.info("Deleting solar panel with ID: {}", id);
        
        if (!panelRepository.existsById(id)) {
            throw new RuntimeException("Panel not found with ID: " + id);
        }
        
        panelRepository.deleteById(id);
        log.info("Solar panel deleted successfully");
    }
    
    private SolarPanelResponse mapToResponse(SolarPanel panel) {
        SolarPanelResponse response = new SolarPanelResponse();
        response.setId(panel.getId());
        response.setPanelId(panel.getPanelId());
        response.setPlantId(panel.getPlant().getId());
        response.setPlantName(panel.getPlant().getName());
        response.setInstallationDate(panel.getInstallationDate());
        response.setCapacity(panel.getCapacity());
        response.setStatus(panel.getStatus());
        response.setAssignedTechnicianId(panel.getAssignedTechnicianId());
        return response;
    }
}

package com.solarpanel.faultdetection.service;

import com.solarpanel.faultdetection.dto.SolarPlantRequest;
import com.solarpanel.faultdetection.dto.SolarPlantResponse;
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
public class SolarPlantService {
    
    private final SolarPlantRepository plantRepository;
    private final SolarPanelRepository panelRepository;
    
    @Transactional
    public SolarPlantResponse createPlant(SolarPlantRequest request) {
        log.info("Creating new solar plant: {}", request.getName());
        
        if (plantRepository.existsByName(request.getName())) {
            throw new RuntimeException("Plant with name '" + request.getName() + "' already exists");
        }
        
        SolarPlant plant = new SolarPlant();
        plant.setName(request.getName());
        plant.setLocation(request.getLocation());
        plant.setCapacityKW(request.getCapacityKW());
        
        SolarPlant savedPlant = plantRepository.save(plant);
        log.info("Solar plant created successfully with ID: {}", savedPlant.getId());
        
        return mapToResponse(savedPlant);
    }
    
    @Transactional(readOnly = true)
    public List<SolarPlantResponse> getAllPlants() {
        log.info("Fetching all solar plants");
        return plantRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public SolarPlantResponse getPlantById(Long id) {
        log.info("Fetching solar plant with ID: {}", id);
        SolarPlant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found with ID: " + id));
        return mapToResponse(plant);
    }
    
    @Transactional
    public SolarPlantResponse updatePlant(Long id, SolarPlantRequest request) {
        log.info("Updating solar plant with ID: {}", id);
        
        SolarPlant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found with ID: " + id));
        
        if (!plant.getName().equals(request.getName()) && plantRepository.existsByName(request.getName())) {
            throw new RuntimeException("Plant with name '" + request.getName() + "' already exists");
        }
        
        plant.setName(request.getName());
        plant.setLocation(request.getLocation());
        plant.setCapacityKW(request.getCapacityKW());
        
        SolarPlant updatedPlant = plantRepository.save(plant);
        log.info("Solar plant updated successfully");
        
        return mapToResponse(updatedPlant);
    }
    
    @Transactional
    public void deletePlant(Long id) {
        log.info("Deleting solar plant with ID: {}", id);
        
        if (!plantRepository.existsById(id)) {
            throw new RuntimeException("Plant not found with ID: " + id);
        }
        
        plantRepository.deleteById(id);
        log.info("Solar plant deleted successfully");
    }
    
    private SolarPlantResponse mapToResponse(SolarPlant plant) {
        SolarPlantResponse response = new SolarPlantResponse();
        response.setId(plant.getId());
        response.setName(plant.getName());
        response.setLocation(plant.getLocation());
        response.setCapacityKW(plant.getCapacityKW());
        response.setCreatedAt(plant.getCreatedAt());
        response.setPanelCount(panelRepository.countByPlantId(plant.getId()));
        return response;
    }
}

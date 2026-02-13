package com.solarpanel.faultdetection.repository;

import com.solarpanel.faultdetection.entity.SolarPanel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolarPanelRepository extends JpaRepository<SolarPanel, Long> {
    Optional<SolarPanel> findByPanelId(String panelId);
    List<SolarPanel> findByPlantId(Long plantId);
    boolean existsByPanelId(String panelId);
    long countByPlantId(Long plantId);
    long countByStatus(SolarPanel.PanelStatus status);
}

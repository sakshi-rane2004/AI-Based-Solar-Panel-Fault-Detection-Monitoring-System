package com.solarpanel.faultdetection.repository;

import com.solarpanel.faultdetection.entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    List<SensorData> findByPanelId(String panelId);
    List<SensorData> findByPanelIdAndTimestampBetween(String panelId, LocalDateTime start, LocalDateTime end);
    List<SensorData> findTop10ByPanelIdOrderByTimestampDesc(String panelId);
}

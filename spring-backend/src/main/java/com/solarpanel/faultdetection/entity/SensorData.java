package com.solarpanel.faultdetection.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String panelId;
    
    @Column(nullable = false)
    private Double voltage;
    
    @Column(nullable = false)
    private Double current;
    
    @Column(nullable = false)
    private Double temperature;
    
    @Column(nullable = false)
    private Double irradiance;
    
    @Column(nullable = false)
    private Double power;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}

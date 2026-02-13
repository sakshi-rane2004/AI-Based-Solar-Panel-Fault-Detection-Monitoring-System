package com.solarpanel.faultdetection.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "solar_panels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolarPanel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String panelId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id", nullable = false)
    private SolarPlant plant;
    
    @Column(nullable = false)
    private LocalDate installationDate;
    
    @Column(nullable = false)
    private Double capacity;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PanelStatus status = PanelStatus.ACTIVE;
    
    @Column
    private Long assignedTechnicianId;
    
    public enum PanelStatus {
        ACTIVE,
        MAINTENANCE,
        OFFLINE
    }
}

package com.solarpanel.faultdetection.dto;

import com.solarpanel.faultdetection.entity.SolarPanel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolarPanelRequest {
    
    @NotBlank(message = "Panel ID is required")
    private String panelId;
    
    @NotNull(message = "Plant ID is required")
    private Long plantId;
    
    @NotNull(message = "Installation date is required")
    private LocalDate installationDate;
    
    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Double capacity;
    
    private SolarPanel.PanelStatus status;
    
    private Long assignedTechnicianId;
}

package com.solarpanel.faultdetection.dto;

import com.solarpanel.faultdetection.entity.SolarPanel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolarPanelResponse {
    private Long id;
    private String panelId;
    private Long plantId;
    private String plantName;
    private LocalDate installationDate;
    private Double capacity;
    private SolarPanel.PanelStatus status;
    private Long assignedTechnicianId;
}

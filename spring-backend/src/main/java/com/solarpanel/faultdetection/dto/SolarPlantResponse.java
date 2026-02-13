package com.solarpanel.faultdetection.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolarPlantResponse {
    private Long id;
    private String name;
    private String location;
    private Double capacityKW;
    private LocalDateTime createdAt;
    private Long panelCount;
}

package com.solarpanel.faultdetection.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorDataDTO {
    
    @NotBlank(message = "Panel ID is required")
    private String panelId;
    
    @NotNull(message = "Voltage is required")
    private Double voltage;
    
    @NotNull(message = "Current is required")
    private Double current;
    
    @NotNull(message = "Temperature is required")
    private Double temperature;
    
    @NotNull(message = "Irradiance is required")
    private Double irradiance;
    
    @NotNull(message = "Power is required")
    private Double power;
    
    private LocalDateTime timestamp;
}

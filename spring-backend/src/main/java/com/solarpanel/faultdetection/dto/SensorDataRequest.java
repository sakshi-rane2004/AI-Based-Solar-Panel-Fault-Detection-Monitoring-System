package com.solarpanel.faultdetection.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class SensorDataRequest {
    
    @NotNull(message = "Voltage is required")
    @DecimalMin(value = "0.0", message = "Voltage must be greater than or equal to 0")
    @DecimalMax(value = "100.0", message = "Voltage must be less than or equal to 100")
    private Double voltage;
    
    @NotNull(message = "Current is required")
    @DecimalMin(value = "0.0", message = "Current must be greater than or equal to 0")
    @DecimalMax(value = "50.0", message = "Current must be less than or equal to 50")
    private Double current;
    
    @NotNull(message = "Temperature is required")
    @DecimalMin(value = "-50.0", message = "Temperature must be greater than or equal to -50")
    @DecimalMax(value = "100.0", message = "Temperature must be less than or equal to 100")
    private Double temperature;
    
    @NotNull(message = "Irradiance is required")
    @DecimalMin(value = "0.0", message = "Irradiance must be greater than or equal to 0")
    @DecimalMax(value = "2000.0", message = "Irradiance must be less than or equal to 2000")
    private Double irradiance;
    
    @NotNull(message = "Power is required")
    @DecimalMin(value = "0.0", message = "Power must be greater than or equal to 0")
    @DecimalMax(value = "5000.0", message = "Power must be less than or equal to 5000")
    private Double power;
    
    // Default constructor
    public SensorDataRequest() {}
    
    // Constructor with all fields
    public SensorDataRequest(Double voltage, Double current, Double temperature, 
                           Double irradiance, Double power) {
        this.voltage = voltage;
        this.current = current;
        this.temperature = temperature;
        this.irradiance = irradiance;
        this.power = power;
    }
    
    // Getters and Setters
    public Double getVoltage() {
        return voltage;
    }
    
    public void setVoltage(Double voltage) {
        this.voltage = voltage;
    }
    
    public Double getCurrent() {
        return current;
    }
    
    public void setCurrent(Double current) {
        this.current = current;
    }
    
    public Double getTemperature() {
        return temperature;
    }
    
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
    
    public Double getIrradiance() {
        return irradiance;
    }
    
    public void setIrradiance(Double irradiance) {
        this.irradiance = irradiance;
    }
    
    public Double getPower() {
        return power;
    }
    
    public void setPower(Double power) {
        this.power = power;
    }
    
    @Override
    public String toString() {
        return "SensorDataRequest{" +
                "voltage=" + voltage +
                ", current=" + current +
                ", temperature=" + temperature +
                ", irradiance=" + irradiance +
                ", power=" + power +
                '}';
    }
}
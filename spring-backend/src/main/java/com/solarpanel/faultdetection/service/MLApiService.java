package com.solarpanel.faultdetection.service;

import com.solarpanel.faultdetection.dto.MLApiResponse;
import com.solarpanel.faultdetection.dto.SensorDataRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class MLApiService {
    
    private static final Logger logger = LoggerFactory.getLogger(MLApiService.class);
    
    private final WebClient webClient;
    
    @Value("${ml.api.base-url}")
    private String mlApiBaseUrl;
    
    @Value("${ml.api.predict-endpoint}")
    private String predictEndpoint;
    
    @Value("${ml.api.timeout}")
    private int timeout;
    
    public MLApiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
    
    /**
     * Call the Python ML API to get fault prediction
     */
    public MLApiResponse predictFault(SensorDataRequest sensorData) {
        logger.info("Calling ML API for prediction with data: {}", sensorData);
        
        try {
            // Prepare request payload
            Map<String, Object> requestPayload = createRequestPayload(sensorData);
            
            // Make API call
            MLApiResponse response = webClient
                    .post()
                    .uri(mlApiBaseUrl + predictEndpoint)
                    .bodyValue(requestPayload)
                    .retrieve()
                    .bodyToMono(MLApiResponse.class)
                    .timeout(Duration.ofMillis(timeout))
                    .block();
            
            logger.info("ML API response received: {}", response);
            return response;
            
        } catch (WebClientResponseException e) {
            logger.error("ML API returned error status {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("ML API call failed with status: " + e.getStatusCode() + 
                                     ", message: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            logger.error("Error calling ML API: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to call ML API: " + e.getMessage());
        }
    }
    
    /**
     * Check if ML API is available
     */
    public boolean isMLApiAvailable() {
        try {
            logger.info("Checking ML API availability at: {}", mlApiBaseUrl);
            
            String response = webClient
                    .get()
                    .uri(mlApiBaseUrl + "/")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofMillis(5000))
                    .block();
            
            logger.info("ML API health check successful");
            return true;
            
        } catch (Exception e) {
            logger.warn("ML API is not available: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Get ML API information
     */
    public Mono<String> getMLApiInfo() {
        return webClient
                .get()
                .uri(mlApiBaseUrl + "/info")
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofMillis(timeout))
                .doOnSuccess(response -> logger.info("ML API info retrieved successfully"))
                .doOnError(error -> logger.error("Failed to get ML API info: {}", error.getMessage()));
    }
    
    /**
     * Create request payload for ML API
     */
    private Map<String, Object> createRequestPayload(SensorDataRequest sensorData) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("voltage", sensorData.getVoltage());
        payload.put("current", sensorData.getCurrent());
        payload.put("temperature", sensorData.getTemperature());
        payload.put("irradiance", sensorData.getIrradiance());
        payload.put("power", sensorData.getPower());
        
        logger.debug("Created ML API request payload: {}", payload);
        return payload;
    }
}
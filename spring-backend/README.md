# Solar Panel Fault Detection - Spring Boot Backend

A Spring Boot backend application that integrates with a Python ML API for AI-based solar panel fault detection. The system accepts sensor data, calls the ML API for predictions, and stores results in a MySQL database.

## Features

- **REST API Integration**: Calls external Python ML API for fault predictions
- **Enhanced Severity Assessment**: Advanced severity logic based on fault type and sensor thresholds
- **Intelligent Maintenance Recommendations**: Context-aware maintenance suggestions
- **Database Storage**: Stores prediction results in MySQL using JPA/Hibernate
- **Layered Architecture**: Entity, Repository, Service, Controller layers
- **Analytics & Reporting**: Comprehensive analytics with summary and trend analysis
- **Input Validation**: Comprehensive validation for sensor data
- **Error Handling**: Global exception handling with meaningful error responses
- **Pagination Support**: Paginated history retrieval
- **Statistics**: Fault type statistics and analytics

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │───▶│  Spring Boot     │───▶│   Python ML     │
│                 │    │   Backend        │    │      API        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  MySQL Database │
                       └─────────────────┘
```

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **Spring WebFlux** (for ML API calls)
- **MySQL 8.0**
- **Maven**
- **JUnit 5** (for testing)

## Project Structure

```
spring-backend/
├── src/main/java/com/solarpanel/faultdetection/
│   ├── SolarPanelFaultDetectionApplication.java
│   ├── config/
│   │   └── WebClientConfig.java
│   ├── controller/
│   │   ├── PredictionController.java
│   │   └── AnalyticsController.java
│   ├── dto/
│   │   ├── SensorDataRequest.java
│   │   ├── PredictionResponse.java
│   │   ├── MLApiResponse.java
│   │   ├── AnalyticsSummaryResponse.java
│   │   ├── AnalyticsTrendsResponse.java
│   │   └── TrendDataPoint.java
│   ├── entity/
│   │   └── PredictionResult.java
│   ├── exception/
│   │   └── GlobalExceptionHandler.java
│   ├── repository/
│   │   └── PredictionResultRepository.java
│   └── service/
│       ├── MLApiService.java
│       ├── PredictionService.java
│       ├── SeverityAssessmentService.java
│       └── AnalyticsService.java
├── src/main/resources/
│   └── application.properties
├── src/test/java/
│   └── com/solarpanel/faultdetection/
│       └── controller/
│           └── PredictionControllerTest.java
├── pom.xml
└── README.md
```

## Database Schema

### prediction_results table
```sql
CREATE TABLE prediction_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    voltage DOUBLE NOT NULL,
    current DOUBLE NOT NULL,
    temperature DOUBLE NOT NULL,
    irradiance DOUBLE NOT NULL,
    power DOUBLE NOT NULL,
    predicted_fault VARCHAR(50) NOT NULL,
    confidence VARCHAR(20) NOT NULL,
    confidence_score DOUBLE NOT NULL,
    severity VARCHAR(30) NOT NULL,
    maintenance_recommendation TEXT,
    description TEXT,
    created_at DATETIME NOT NULL
);
```

## API Endpoints

### Base URL: `http://localhost:8080/api/v1/solar-panel`

#### 1. Analyze Sensor Data
```http
POST /analyze
Content-Type: application/json

{
    "voltage": 32.5,
    "current": 8.2,
    "temperature": 25.0,
    "irradiance": 850.0,
    "power": 266.5
}
```

**Response:**
```json
{
    "id": 1,
    "predictedFault": "NORMAL",
    "confidence": "High",
    "confidenceScore": 0.95,
    "severity": "None",
    "description": "Panel is operating normally with no detected faults.",
    "maintenanceRecommendation": "Continue regular monitoring. No immediate action required.",
    "inputValues": {
        "voltage": 32.5,
        "current": 8.2,
        "temperature": 25.0,
        "irradiance": 850.0,
        "power": 266.5
    },
    "allProbabilities": {
        "NORMAL": 0.95,
        "PARTIAL_SHADING": 0.02,
        "PANEL_DEGRADATION": 0.01,
        "INVERTER_FAULT": 0.01,
        "DUST_ACCUMULATION": 0.01
    },
    "timestamp": "2024-01-15T10:30:00"
}
```

#### 2. Get Prediction History
```http
GET /history
GET /history?page=0&size=20
GET /history?faultType=NORMAL
GET /history?severity=High
```

#### 3. Get Recent Predictions (Last 24 hours)
```http
GET /history/recent
```

#### 4. Get Prediction by ID
```http
GET /history/{id}
```

#### 5. Get Fault Type Statistics
```http
GET /statistics/fault-types
```

**Response:**
```json
{
    "NORMAL": 150,
    "PARTIAL_SHADING": 45,
    "PANEL_DEGRADATION": 20,
    "INVERTER_FAULT": 15,
    "DUST_ACCUMULATION": 10
}
```

#### 6. Get Fault Type Statistics
```http
GET /statistics/fault-types
```

**Response:**
```json
{
    "NORMAL": 150,
    "PARTIAL_SHADING": 45,
    "PANEL_DEGRADATION": 20,
    "INVERTER_FAULT": 15,
    "DUST_ACCUMULATION": 10
}
```

#### 7. Get Analytics Summary
```http
GET /analytics/summary
```

**Response:**
```json
{
    "totalPredictions": 240,
    "faultTypeCounts": {
        "NORMAL": 150,
        "PARTIAL_SHADING": 45,
        "PANEL_DEGRADATION": 20,
        "INVERTER_FAULT": 15,
        "DUST_ACCUMULATION": 10
    },
    "severityCounts": {
        "None": 150,
        "Medium": 45,
        "High": 20,
        "Critical": 15,
        "Low": 10
    },
    "faultTypePercentages": {
        "NORMAL": 62.5,
        "PARTIAL_SHADING": 18.75,
        "PANEL_DEGRADATION": 8.33,
        "INVERTER_FAULT": 6.25,
        "DUST_ACCUMULATION": 4.17
    },
    "severityPercentages": {
        "None": 62.5,
        "Medium": 18.75,
        "High": 8.33,
        "Critical": 6.25,
        "Low": 4.17
    },
    "mostCommonFault": "NORMAL",
    "mostCommonSeverity": "None",
    "criticalFaults": 15,
    "normalOperations": 150,
    "lastUpdated": "2024-01-15T10:30:00"
}
```

#### 8. Get Analytics Trends
```http
GET /analytics/trends?days=30
GET /analytics/trends?startDate=2024-01-01&endDate=2024-01-31
GET /analytics/trends/last/7
```

**Response:**
```json
{
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "totalDays": 31,
    "totalPredictionsInPeriod": 240,
    "mostActiveFaultType": "NORMAL",
    "trendDirection": "STABLE",
    "dailyTrends": [
        {
            "date": "2024-01-01",
            "totalCount": 8,
            "faultTypeCounts": {
                "NORMAL": 5,
                "PARTIAL_SHADING": 2,
                "INVERTER_FAULT": 1
            },
            "severityCounts": {
                "None": 5,
                "Medium": 2,
                "Critical": 1
            }
        }
    ]
}
```

#### 9. Health Check
```http
GET /health
GET /analytics/health
```

## Setup Instructions

### Prerequisites

1. **Java 17** or higher
2. **Maven 3.6+**
3. **MySQL 8.0**
4. **Python ML API** running on `http://localhost:5000`

### Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE solar_panel_db;
CREATE USER 'solaruser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON solar_panel_db.* TO 'solaruser'@'localhost';
FLUSH PRIVILEGES;
```

2. Update `application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/solar_panel_db
spring.datasource.username=solaruser
spring.datasource.password=your_password
```

### Running the Application

1. **Clone and navigate to the project:**
```bash
cd spring-backend
```

2. **Install dependencies:**
```bash
mvn clean install
```

3. **Start the Python ML API first:**
```bash
# In the parent directory
python run_api.py
```

4. **Run the Spring Boot application:**
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Testing the API

1. **Using curl:**
```bash
# Analyze sensor data
curl -X POST http://localhost:8080/api/v1/solar-panel/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "voltage": 32.5,
    "current": 8.2,
    "temperature": 25.0,
    "irradiance": 850.0,
    "power": 266.5
  }'

# Get history
curl http://localhost:8080/api/v1/solar-panel/history

# Health check
curl http://localhost:8080/api/v1/solar-panel/health
```

2. **Run unit tests:**
```bash
mvn test
```

## Configuration

### Application Properties

Key configuration options in `application.properties`:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api/v1

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/solar_panel_db
spring.datasource.username=root
spring.datasource.password=password

# ML API Configuration
ml.api.base-url=http://localhost:5000
ml.api.predict-endpoint=/predict
ml.api.timeout=30000

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## Error Handling

The application includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or validation errors
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: ML API errors or database issues

Example error response:
```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 400,
    "error": "Validation Failed",
    "message": "Invalid input data",
    "fieldErrors": {
        "voltage": "Voltage must be greater than or equal to 0"
    },
    "path": "uri=/api/v1/solar-panel/analyze"
}
```

## Integration with Python ML API

The Spring Boot application integrates with the Python ML API using:

1. **WebClient**: For non-blocking HTTP calls
2. **Timeout Configuration**: 30-second timeout for ML API calls
3. **Error Handling**: Graceful handling of ML API failures
4. **Health Checks**: Monitoring ML API availability

## Development

### Adding New Features

1. **New Entity**: Add to `entity/` package
2. **New Repository**: Extend `JpaRepository` in `repository/` package
3. **New Service**: Add business logic in `service/` package
4. **New Controller**: Add REST endpoints in `controller/` package
5. **New DTO**: Add data transfer objects in `dto/` package

### Testing

- Unit tests for controllers using `@WebMvcTest`
- Integration tests for services using `@SpringBootTest`
- Repository tests using `@DataJpaTest`

## Deployment

### Production Configuration

1. **Database**: Use production MySQL instance
2. **ML API**: Deploy Python ML API to production
3. **Environment Variables**: Use environment-specific configurations
4. **Logging**: Configure appropriate logging levels
5. **Security**: Add authentication and authorization

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/fault-detection-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

Build and run:
```bash
mvn clean package
docker build -t solar-panel-backend .
docker run -p 8080:8080 solar-panel-backend
```

## Monitoring

The application includes:

- **Health Check Endpoint**: `/api/v1/solar-panel/health`
- **Actuator Endpoints**: Health and info endpoints
- **Logging**: Comprehensive logging with configurable levels
- **Statistics**: Fault type statistics for monitoring trends

## Enhanced Severity Assessment

The system includes intelligent severity assessment that goes beyond the ML API response:

### Severity Levels
- **None**: Normal operation, no issues detected
- **Low**: Minor issues that can be addressed during routine maintenance
- **Medium**: Moderate issues requiring attention within 1-2 weeks
- **High**: Significant issues requiring attention within 24-48 hours
- **Critical**: Urgent issues requiring immediate action

### Assessment Logic
1. **Base Severity**: Determined by fault type
   - NORMAL → None
   - DUST_ACCUMULATION → Low
   - PARTIAL_SHADING → Medium
   - PANEL_DEGRADATION → High
   - INVERTER_FAULT → Critical

2. **Confidence Adjustment**: Low confidence predictions reduce severity
3. **Sensor Threshold Analysis**: Critical sensor values escalate severity
   - Voltage < 15V or > 45V
   - Current < 1A or > 15A
   - Temperature > 60°C or < -10°C
   - Power < 50W

### Maintenance Recommendations
Enhanced recommendations based on severity level:
- **Critical**: "URGENT: Shut down system immediately..."
- **High**: "HIGH PRIORITY: Address within 24-48 hours..."
- **Medium**: "MODERATE PRIORITY: Schedule within 1-2 weeks..."
- **Low**: "LOW PRIORITY: Address during next maintenance..."

## Analytics & Reporting

### Summary Analytics
- Total predictions count
- Fault type distribution with percentages
- Severity level distribution
- Most common fault types and severities
- Critical fault count and normal operations

### Trend Analysis
- Date-wise fault occurrence patterns
- Configurable date ranges (last N days or specific dates)
- Trend direction analysis (INCREASING/DECREASING/STABLE)
- Most active fault types over time
- Daily breakdown by fault type and severity

## License

This project is open source and available under the MIT License.
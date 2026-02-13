-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create prediction_results table if not exists
CREATE TABLE IF NOT EXISTS prediction_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    predicted_fault VARCHAR(50) NOT NULL,
    confidence VARCHAR(20),
    severity VARCHAR(20),
    maintenance_recommendation TEXT,
    voltage DOUBLE,
    current DOUBLE,
    temperature DOUBLE,
    irradiance DOUBLE,
    power DOUBLE,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
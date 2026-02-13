package com.solarpanel.faultdetection.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class DatabaseInitService {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitService.class);
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostConstruct
    public void initializeDatabase() {
        try {
            logger.info("Initializing database tables...");
            
            // Create users table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(20) NOT NULL,
                    first_name VARCHAR(50),
                    last_name VARCHAR(50),
                    enabled BOOLEAN NOT NULL DEFAULT TRUE,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    last_login TIMESTAMP
                )
            """);
            
            // Create prediction_results table
            jdbcTemplate.execute("""
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
                )
            """);
            
            logger.info("Database tables created successfully");
            
            // Create default users
            createDefaultUsers();
            
        } catch (Exception e) {
            logger.error("Error initializing database: {}", e.getMessage(), e);
        }
    }
    
    private void createDefaultUsers() {
        try {
            // Check if users already exist
            Integer userCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
            
            if (userCount == 0) {
                logger.info("Creating default users...");
                
                // Create admin user
                String adminPassword = passwordEncoder.encode("Admin123!");
                jdbcTemplate.update("""
                    INSERT INTO users (username, email, password, role, first_name, last_name, enabled, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                """, "admin", "admin@solarpanel.com", adminPassword, "ADMIN", "System", "Administrator", true);
                
                // Create technician user
                String techPassword = passwordEncoder.encode("Tech123!");
                jdbcTemplate.update("""
                    INSERT INTO users (username, email, password, role, first_name, last_name, enabled, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                """, "technician", "technician@solarpanel.com", techPassword, "TECHNICIAN", "System", "Technician", true);
                
                // Create viewer user
                String viewerPassword = passwordEncoder.encode("Viewer123!");
                jdbcTemplate.update("""
                    INSERT INTO users (username, email, password, role, first_name, last_name, enabled, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                """, "viewer", "viewer@solarpanel.com", viewerPassword, "VIEWER", "System", "Viewer", true);
                
                logger.info("Default users created successfully");
                logger.info("Login credentials:");
                logger.info("Admin: admin / Admin123!");
                logger.info("Technician: technician / Tech123!");
                logger.info("Viewer: viewer / Viewer123!");
            } else {
                logger.info("Users already exist, skipping default user creation");
            }
            
        } catch (Exception e) {
            logger.error("Error creating default users: {}", e.getMessage(), e);
        }
    }
}
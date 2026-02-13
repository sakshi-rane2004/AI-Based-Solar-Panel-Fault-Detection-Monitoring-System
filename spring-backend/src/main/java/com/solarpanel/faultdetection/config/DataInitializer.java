package com.solarpanel.faultdetection.config;

import com.solarpanel.faultdetection.entity.User;
import com.solarpanel.faultdetection.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeDefaultUsers();
    }
    
    private void initializeDefaultUsers() {
        logger.info("Initializing default users...");
        
        try {
            // Create default admin user
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@solarpanel.com");
                admin.setPassword(passwordEncoder.encode("Admin123!@#"));
                admin.setRole(User.Role.ADMIN);
                admin.setFirstName("System");
                admin.setLastName("Administrator");
                admin.setEnabled(true);
                
                userRepository.save(admin);
                logger.info("Created default admin user: admin");
            }
        } catch (Exception e) {
            logger.warn("Could not check/create admin user: {}", e.getMessage());
        }
        
        try {
            // Create default technician user
            if (!userRepository.existsByUsername("technician")) {
                User technician = new User();
                technician.setUsername("technician");
                technician.setEmail("technician@solarpanel.com");
                technician.setPassword(passwordEncoder.encode("Technician123!@#"));
                technician.setRole(User.Role.TECHNICIAN);
                technician.setFirstName("System");
                technician.setLastName("Technician");
                technician.setEnabled(true);
                
                userRepository.save(technician);
                logger.info("Created default technician user: technician");
            }
        } catch (Exception e) {
            logger.warn("Could not check/create technician user: {}", e.getMessage());
        }
        
        try {
            // Create default viewer user
            if (!userRepository.existsByUsername("viewer")) {
                User viewer = new User();
                viewer.setUsername("viewer");
                viewer.setEmail("viewer@solarpanel.com");
                viewer.setPassword(passwordEncoder.encode("Viewer123!@#"));
                viewer.setRole(User.Role.VIEWER);
                viewer.setFirstName("System");
                viewer.setLastName("Viewer");
                viewer.setEnabled(true);
                
                userRepository.save(viewer);
                logger.info("Created default viewer user: viewer");
            }
        } catch (Exception e) {
            logger.warn("Could not check/create viewer user: {}", e.getMessage());
        }
        
        try {
            // Create demo users with simpler passwords for testing
            if (!userRepository.existsByUsername("demo_admin")) {
                User demoAdmin = new User();
                demoAdmin.setUsername("demo_admin");
                demoAdmin.setEmail("demo.admin@solarpanel.com");
                demoAdmin.setPassword(passwordEncoder.encode("DemoAdmin123"));
                demoAdmin.setRole(User.Role.ADMIN);
                demoAdmin.setFirstName("Demo");
                demoAdmin.setLastName("Admin");
                demoAdmin.setEnabled(true);
                
                userRepository.save(demoAdmin);
                logger.info("Created demo admin user: demo_admin");
            }
        } catch (Exception e) {
            logger.warn("Could not check/create demo_admin user: {}", e.getMessage());
        }
        
        try {
            if (!userRepository.existsByUsername("demo_technician")) {
                User demoTechnician = new User();
                demoTechnician.setUsername("demo_technician");
                demoTechnician.setEmail("demo.technician@solarpanel.com");
                demoTechnician.setPassword(passwordEncoder.encode("DemoTech123"));
                demoTechnician.setRole(User.Role.TECHNICIAN);
                demoTechnician.setFirstName("Demo");
                demoTechnician.setLastName("Technician");
                demoTechnician.setEnabled(true);
                
                userRepository.save(demoTechnician);
                logger.info("Created demo technician user: demo_technician");
            }
        } catch (Exception e) {
            logger.warn("Could not check/create demo_technician user: {}", e.getMessage());
        }
        
        try {
            if (!userRepository.existsByUsername("demo_viewer")) {
                User demoViewer = new User();
                demoViewer.setUsername("demo_viewer");
                demoViewer.setEmail("demo.viewer@solarpanel.com");
                demoViewer.setPassword(passwordEncoder.encode("DemoViewer123"));
                demoViewer.setRole(User.Role.VIEWER);
                demoViewer.setFirstName("Demo");
                demoViewer.setLastName("Viewer");
                demoViewer.setEnabled(true);
                
                userRepository.save(demoViewer);
                logger.info("Created demo viewer user: demo_viewer");
            }
        } catch (Exception e) {
            logger.warn("Could not check/create demo_viewer user: {}", e.getMessage());
        }
        
        logger.info("Default users initialization completed");
        
        try {
            // Log user statistics
            long totalUsers = userRepository.count();
            long adminCount = userRepository.findByRole(User.Role.ADMIN).size();
            long technicianCount = userRepository.findByRole(User.Role.TECHNICIAN).size();
            long viewerCount = userRepository.findByRole(User.Role.VIEWER).size();
            
            logger.info("User statistics - Total: {}, Admins: {}, Technicians: {}, Viewers: {}", 
                       totalUsers, adminCount, technicianCount, viewerCount);
        } catch (Exception e) {
            logger.warn("Could not get user statistics: {}", e.getMessage());
        }
    }
}
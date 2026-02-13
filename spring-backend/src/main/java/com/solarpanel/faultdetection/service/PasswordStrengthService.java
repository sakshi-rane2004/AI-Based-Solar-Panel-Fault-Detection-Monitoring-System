package com.solarpanel.faultdetection.service;

import com.solarpanel.faultdetection.dto.PasswordStrengthResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class PasswordStrengthService {
    
    // Common weak passwords
    private static final List<String> COMMON_PASSWORDS = Arrays.asList(
        "password", "123456", "password123", "admin", "qwerty", "letmein",
        "welcome", "monkey", "1234567890", "abc123", "111111", "123123",
        "password1", "1234", "12345", "dragon", "master", "login"
    );
    
    // Password patterns
    private static final Pattern LOWERCASE = Pattern.compile("[a-z]");
    private static final Pattern UPPERCASE = Pattern.compile("[A-Z]");
    private static final Pattern DIGITS = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL_CHARS = Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]");
    private static final Pattern SEQUENTIAL = Pattern.compile("(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)");
    private static final Pattern REPEATED = Pattern.compile("(.)\\1{2,}");
    
    /**
     * Analyze password strength
     */
    public PasswordStrengthResponse analyzePassword(String password) {
        if (password == null || password.isEmpty()) {
            return new PasswordStrengthResponse(
                PasswordStrengthResponse.StrengthLevel.VERY_WEAK,
                0,
                List.of("Password is required"),
                List.of("Password cannot be empty"),
                false
            );
        }
        
        int score = 0;
        List<String> suggestions = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        // Length check
        if (password.length() < 8) {
            warnings.add("Password is too short");
            suggestions.add("Use at least 8 characters");
        } else if (password.length() >= 8) {
            score += 10;
        }
        
        if (password.length() >= 12) {
            score += 10;
        }
        
        if (password.length() >= 16) {
            score += 10;
        }
        
        // Character variety checks
        boolean hasLower = LOWERCASE.matcher(password).find();
        boolean hasUpper = UPPERCASE.matcher(password).find();
        boolean hasDigits = DIGITS.matcher(password).find();
        boolean hasSpecial = SPECIAL_CHARS.matcher(password).find();
        
        if (hasLower) score += 10;
        else suggestions.add("Add lowercase letters");
        
        if (hasUpper) score += 10;
        else suggestions.add("Add uppercase letters");
        
        if (hasDigits) score += 10;
        else suggestions.add("Add numbers");
        
        if (hasSpecial) score += 15;
        else suggestions.add("Add special characters (!@#$%^&*)");
        
        // Bonus for character variety
        int varietyCount = (hasLower ? 1 : 0) + (hasUpper ? 1 : 0) + (hasDigits ? 1 : 0) + (hasSpecial ? 1 : 0);
        if (varietyCount >= 3) score += 10;
        if (varietyCount == 4) score += 10;
        
        // Check for common passwords
        if (COMMON_PASSWORDS.contains(password.toLowerCase())) {
            score = Math.max(0, score - 30);
            warnings.add("This is a commonly used password");
            suggestions.add("Avoid common passwords");
        }
        
        // Check for sequential characters
        if (SEQUENTIAL.matcher(password.toLowerCase()).find()) {
            score = Math.max(0, score - 15);
            warnings.add("Contains sequential characters");
            suggestions.add("Avoid sequential patterns like 'abc' or '123'");
        }
        
        // Check for repeated characters
        if (REPEATED.matcher(password).find()) {
            score = Math.max(0, score - 10);
            warnings.add("Contains repeated characters");
            suggestions.add("Avoid repeating the same character multiple times");
        }
        
        // Check for dictionary words (simple check)
        if (containsCommonWords(password)) {
            score = Math.max(0, score - 10);
            warnings.add("Contains common dictionary words");
            suggestions.add("Mix letters, numbers, and symbols instead of using whole words");
        }
        
        // Determine strength level
        PasswordStrengthResponse.StrengthLevel strength;
        boolean isAcceptable;
        
        if (score >= 90) {
            strength = PasswordStrengthResponse.StrengthLevel.VERY_STRONG;
            isAcceptable = true;
        } else if (score >= 75) {
            strength = PasswordStrengthResponse.StrengthLevel.STRONG;
            isAcceptable = true;
        } else if (score >= 60) {
            strength = PasswordStrengthResponse.StrengthLevel.GOOD;
            isAcceptable = true;
        } else if (score >= 40) {
            strength = PasswordStrengthResponse.StrengthLevel.FAIR;
            isAcceptable = password.length() >= 8; // Minimum length requirement
        } else if (score >= 20) {
            strength = PasswordStrengthResponse.StrengthLevel.WEAK;
            isAcceptable = false;
        } else {
            strength = PasswordStrengthResponse.StrengthLevel.VERY_WEAK;
            isAcceptable = false;
        }
        
        // Ensure minimum requirements for acceptance
        if (password.length() < 8) {
            isAcceptable = false;
        }
        
        return new PasswordStrengthResponse(strength, score, suggestions, warnings, isAcceptable);
    }
    
    /**
     * Check if password contains common words
     */
    private boolean containsCommonWords(String password) {
        String lowerPassword = password.toLowerCase();
        
        // Common words that might be used in passwords
        String[] commonWords = {
            "password", "admin", "user", "login", "welcome", "hello",
            "solar", "panel", "system", "energy", "power", "fault",
            "detection", "monitor", "control", "dashboard"
        };
        
        for (String word : commonWords) {
            if (lowerPassword.contains(word)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Validate if password meets minimum requirements
     */
    public boolean isPasswordAcceptable(String password) {
        PasswordStrengthResponse analysis = analyzePassword(password);
        return analysis.isAcceptable();
    }
    
    /**
     * Get password requirements
     */
    public List<String> getPasswordRequirements() {
        return Arrays.asList(
            "At least 8 characters long",
            "Contains lowercase letters (a-z)",
            "Contains uppercase letters (A-Z)",
            "Contains numbers (0-9)",
            "Contains special characters (!@#$%^&*)",
            "Avoid common passwords and patterns",
            "Avoid sequential or repeated characters"
        );
    }
}
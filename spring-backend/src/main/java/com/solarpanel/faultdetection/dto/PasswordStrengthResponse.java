package com.solarpanel.faultdetection.dto;

import java.util.List;

public class PasswordStrengthResponse {
    
    public enum StrengthLevel {
        VERY_WEAK, WEAK, FAIR, GOOD, STRONG, VERY_STRONG
    }
    
    private StrengthLevel strength;
    private int score; // 0-100
    private List<String> suggestions;
    private List<String> warnings;
    private boolean isAcceptable;
    
    // Default constructor
    public PasswordStrengthResponse() {}
    
    // Constructor
    public PasswordStrengthResponse(StrengthLevel strength, int score, 
                                  List<String> suggestions, List<String> warnings, 
                                  boolean isAcceptable) {
        this.strength = strength;
        this.score = score;
        this.suggestions = suggestions;
        this.warnings = warnings;
        this.isAcceptable = isAcceptable;
    }
    
    // Getters and Setters
    public StrengthLevel getStrength() {
        return strength;
    }
    
    public void setStrength(StrengthLevel strength) {
        this.strength = strength;
    }
    
    public int getScore() {
        return score;
    }
    
    public void setScore(int score) {
        this.score = score;
    }
    
    public List<String> getSuggestions() {
        return suggestions;
    }
    
    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
    
    public List<String> getWarnings() {
        return warnings;
    }
    
    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }
    
    public boolean isAcceptable() {
        return isAcceptable;
    }
    
    public void setAcceptable(boolean acceptable) {
        isAcceptable = acceptable;
    }
    
    @Override
    public String toString() {
        return "PasswordStrengthResponse{" +
                "strength=" + strength +
                ", score=" + score +
                ", isAcceptable=" + isAcceptable +
                ", warnings=" + warnings +
                ", suggestions=" + suggestions +
                '}';
    }
}
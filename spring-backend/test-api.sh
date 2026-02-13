#!/bin/bash

# Test script for Solar Panel Fault Detection Spring Boot API

BASE_URL="http://localhost:8080/api/v1/solar-panel"

echo "=== Solar Panel Fault Detection API Test ==="
echo "Base URL: $BASE_URL"
echo

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.' || echo "Health check failed"
echo
echo

# Test 2: Analyze Normal Panel
echo "2. Testing Analysis - Normal Panel..."
curl -s -X POST "$BASE_URL/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "voltage": 32.5,
    "current": 8.2,
    "temperature": 25.0,
    "irradiance": 850.0,
    "power": 266.5
  }' | jq '.' || echo "Analysis failed"
echo
echo

# Test 3: Analyze Shaded Panel
echo "3. Testing Analysis - Shaded Panel..."
curl -s -X POST "$BASE_URL/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "voltage": 27.5,
    "current": 4.2,
    "temperature": 23.0,
    "irradiance": 550.0,
    "power": 115.5
  }' | jq '.' || echo "Analysis failed"
echo
echo

# Test 4: Get History
echo "4. Testing History Retrieval..."
curl -s "$BASE_URL/history?size=5" | jq '.' || echo "History retrieval failed"
echo
echo

# Test 5: Get Analytics Summary
echo "5. Testing Analytics Summary..."
curl -s "$BASE_URL/analytics/summary" | jq '.' || echo "Analytics summary failed"
echo
echo

# Test 6: Get Analytics Trends
echo "6. Testing Analytics Trends..."
curl -s "$BASE_URL/analytics/trends?days=7" | jq '.' || echo "Analytics trends failed"
echo
echo

# Test 7: Get Statistics
echo "7. Testing Fault Type Statistics..."
curl -s "$BASE_URL/statistics/fault-types" | jq '.' || echo "Statistics failed"
echo
echo

# Test 8: Validation Error Test
echo "8. Testing Validation (Invalid Data)..."
curl -s -X POST "$BASE_URL/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "voltage": -10.0,
    "current": 8.2,
    "temperature": 25.0,
    "irradiance": 850.0,
    "power": 266.5
  }' | jq '.' || echo "Validation test failed"
echo

echo "=== Test Complete ==="
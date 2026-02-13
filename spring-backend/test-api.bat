@echo off
REM Test script for Solar Panel Fault Detection Spring Boot API (Windows)

set BASE_URL=http://localhost:8080/api/v1/solar-panel

echo === Solar Panel Fault Detection API Test ===
echo Base URL: %BASE_URL%
echo.

REM Test 1: Health Check
echo 1. Testing Health Check...
curl -s "%BASE_URL%/health"
echo.
echo.

REM Test 2: Analyze Normal Panel
echo 2. Testing Analysis - Normal Panel...
curl -s -X POST "%BASE_URL%/analyze" ^
  -H "Content-Type: application/json" ^
  -d "{\"voltage\": 32.5, \"current\": 8.2, \"temperature\": 25.0, \"irradiance\": 850.0, \"power\": 266.5}"
echo.
echo.

REM Test 3: Analyze Shaded Panel
echo 3. Testing Analysis - Shaded Panel...
curl -s -X POST "%BASE_URL%/analyze" ^
  -H "Content-Type: application/json" ^
  -d "{\"voltage\": 27.5, \"current\": 4.2, \"temperature\": 23.0, \"irradiance\": 550.0, \"power\": 115.5}"
echo.
echo.

REM Test 4: Get History
echo 4. Testing History Retrieval...
curl -s "%BASE_URL%/history?size=5"
echo.
echo.

REM Test 5: Get Analytics Summary
echo 5. Testing Analytics Summary...
curl -s "%BASE_URL%/analytics/summary"
echo.
echo.

REM Test 6: Get Analytics Trends
echo 6. Testing Analytics Trends...
curl -s "%BASE_URL%/analytics/trends?days=7"
echo.
echo.

REM Test 7: Get Statistics
echo 7. Testing Fault Type Statistics...
curl -s "%BASE_URL%/statistics/fault-types"
echo.
echo.

REM Test 8: Validation Error Test
echo 8. Testing Validation (Invalid Data)...
curl -s -X POST "%BASE_URL%/analyze" ^
  -H "Content-Type: application/json" ^
  -d "{\"voltage\": -10.0, \"current\": 8.2, \"temperature\": 25.0, \"irradiance\": 850.0, \"power\": 266.5}"
echo.

echo === Test Complete ===
pause
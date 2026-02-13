@echo off
echo Testing Registration Security Fix
echo.

echo Starting Spring Boot application...
start /B mvn spring-boot:run > nul 2>&1

echo Waiting for application to start...
timeout /t 15 /nobreak > nul

echo.
echo Testing OPERATOR registration (should work):
curl -X POST http://localhost:8080/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testoperator\",\"email\":\"operator@test.com\",\"password\":\"SecurePass123!\",\"role\":\"OPERATOR\",\"firstName\":\"Test\",\"lastName\":\"Operator\"}"

echo.
echo.
echo Testing ADMIN registration (should fail):
curl -X POST http://localhost:8080/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testadmin\",\"email\":\"admin@test.com\",\"password\":\"SecurePass123!\",\"role\":\"ADMIN\",\"firstName\":\"Test\",\"lastName\":\"Admin\"}"

echo.
echo.
echo Test completed. Check the responses above.
echo Press any key to stop the application...
pause > nul

echo Stopping application...
taskkill /F /IM java.exe > nul 2>&1
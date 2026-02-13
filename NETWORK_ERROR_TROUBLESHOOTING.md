# Network Error Troubleshooting Guide

## Error: "Analysis failed: Network error. Please check your connection and try again."

This error indicates that the frontend cannot connect to the backend services. Here's how to diagnose and fix it:

## 1. Check Backend Services Status

### Spring Boot Backend (Port 8081)
```bash
# Navigate to spring-backend directory
cd spring-backend

# Start the Spring Boot application
mvn spring-boot:run
```

**Expected output:**
- Server should start on port 8081
- You should see: "Started SolarPanelFaultDetectionApplication"
- No connection errors to MySQL

### Python ML API (Port 5000)
```bash
# Navigate to root directory
cd ..

# Start the Python API
python run_api.py
```

**Expected output:**
- Flask server should start on port 5000
- You should see: "Running on http://127.0.0.1:5000"

## 2. Check Database Connection

### MySQL Database
Make sure MySQL is running and accessible:

```bash
# Check if MySQL is running (Windows)
net start mysql

# Or check MySQL service status
sc query mysql
```

**Database requirements:**
- MySQL running on localhost:3306
- Username: root
- Password: password
- Database: solar_panel_db (will be created automatically)

## 3. Verify Service Connectivity

### Test Backend Health
Open browser and navigate to:
```
http://localhost:8081/api/v1/solar-panel/health
```

### Test Python API Health
Open browser and navigate to:
```
http://localhost:5000/health
```

### Test Frontend Connection
```bash
# Navigate to react-frontend directory
cd react-frontend

# Start the React application
npm start
```

## 4. Common Issues and Solutions

### Issue 1: Port Already in Use
**Error:** "Port 8081 is already in use"

**Solution:**
```bash
# Find process using port 8081
netstat -ano | findstr :8081

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in application.properties
server.port=8082
```

### Issue 2: MySQL Connection Failed
**Error:** "Could not create connection to database server"

**Solutions:**
1. **Install MySQL:** Download from https://dev.mysql.com/downloads/mysql/
2. **Start MySQL service:**
   ```bash
   net start mysql
   ```
3. **Create user and database:**
   ```sql
   CREATE DATABASE solar_panel_db;
   CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON solar_panel_db.* TO 'root'@'localhost';
   ```

### Issue 3: Python Dependencies Missing
**Error:** "ModuleNotFoundError" or "ImportError"

**Solution:**
```bash
# Install required packages
pip install flask flask-cors pandas scikit-learn numpy joblib
```

### Issue 4: CORS Issues
**Error:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:** The backend is already configured for CORS, but ensure:
1. Backend is running on port 8081
2. Frontend is running on port 3000
3. No proxy or firewall blocking requests

## 5. Step-by-Step Startup Sequence

### 1. Start MySQL Database
```bash
net start mysql
```

### 2. Start Python ML API
```bash
# In root directory
python run_api.py
```
Wait for: "Running on http://127.0.0.1:5000"

### 3. Start Spring Boot Backend
```bash
# In spring-backend directory
mvn spring-boot:run
```
Wait for: "Started SolarPanelFaultDetectionApplication"

### 4. Start React Frontend
```bash
# In react-frontend directory
npm start
```
Wait for: "webpack compiled successfully"

## 6. Verify Everything is Working

### Test Analysis Function
1. Navigate to the "Analyze" page in the web application
2. Enter some sensor data
3. Click "Analyze"
4. Should get results without network errors

### Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for any error messages
4. Network tab shows failed requests

## 7. Alternative Solutions

### If Python API is not needed immediately:
You can modify the backend to work without the Python API by:

1. **Disable ML API calls temporarily:**
   ```java
   // In MLApiService.java, return mock data instead of calling Python API
   ```

2. **Use mock predictions:**
   The system can generate mock fault predictions for testing

### If MySQL is not available:
You can use H2 in-memory database temporarily:

1. **Add to application.properties:**
   ```properties
   spring.datasource.url=jdbc:h2:mem:testdb
   spring.datasource.driver-class-name=org.h2.Driver
   spring.h2.console.enabled=true
   ```

## 8. Logs to Check

### Spring Boot Logs
Look for these in the console output:
- Database connection status
- Port binding success
- ML API connection attempts
- Any exception stack traces

### Browser Network Tab
Check for:
- Failed HTTP requests (red entries)
- 404, 500, or network timeout errors
- Request/response details

## 9. Quick Fix Commands

```bash
# Kill all Java processes (if needed)
taskkill /F /IM java.exe

# Kill all Node processes (if needed)  
taskkill /F /IM node.exe

# Restart all services
cd spring-backend && mvn spring-boot:run &
cd .. && python run_api.py &
cd react-frontend && npm start
```

## Contact Points for Help

If the issue persists:
1. Check the exact error message in browser console
2. Verify all three services (MySQL, Python API, Spring Boot) are running
3. Test each service individually using the health check URLs
4. Check firewall/antivirus settings that might block local connections

The most common cause is that one of the backend services (Spring Boot on 8081 or Python API on 5000) is not running.
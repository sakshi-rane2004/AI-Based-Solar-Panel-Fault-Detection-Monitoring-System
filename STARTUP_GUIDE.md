# Solar Panel Fault Detection System - Startup Guide

## Complete Guide to Start the System in VS Code

This guide provides step-by-step instructions to start all components of the Solar Panel Fault Detection System.

---

## Prerequisites

Before starting, ensure you have installed:
- **Java 17+** (for Spring Boot backend)
- **Maven** (for building Spring Boot)
- **Node.js 16+** and **npm** (for React frontend)
- **Python 3.8+** (for ML API)
- **PostgreSQL** (database)

---

## Quick Start (3 Terminals)

Open VS Code and open **3 separate terminals** (Terminal → New Terminal). Run these commands:

### Terminal 1: Spring Boot Backend
```bash
cd spring-backend
mvn spring-boot:run
```
**Wait for**: "Started SolarPanelFaultDetectionApplication" message
**Runs on**: http://localhost:8081

---

### Terminal 2: React Frontend
```bash
cd react-frontend
npm start
```
**Wait for**: "Compiled successfully!" message
**Opens automatically**: http://localhost:3000

---

### Terminal 3: Python ML API
```bash
python api/app.py
```
**Wait for**: "Model and preprocessors loaded successfully!" message
**Runs on**: http://localhost:5000

---

## Detailed Step-by-Step Instructions

### Step 1: Start Spring Boot Backend

1. Open a new terminal in VS Code
2. Navigate to backend directory:
   ```bash
   cd spring-backend
   ```

3. **(First time only)** Install dependencies:
   ```bash
   mvn clean install
   ```

4. Start the backend:
   ```bash
   mvn spring-boot:run
   ```

5. **Verify it's running**:
   - Look for: `Started SolarPanelFaultDetectionApplication in X seconds`
   - Backend runs on: **http://localhost:8081**
   - Test: Open http://localhost:8081/api/test in browser

**Common Issues:**
- Port 8081 already in use: Stop other Java processes or change port in `application.properties`
- Database connection error: Ensure PostgreSQL is running
- Build errors: Run `mvn clean install -U` to update dependencies

---

### Step 2: Start React Frontend

1. Open a **second terminal** in VS Code
2. Navigate to frontend directory:
   ```bash
   cd react-frontend
   ```

3. **(First time only)** Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. **Verify it's running**:
   - Look for: `Compiled successfully!`
   - Frontend runs on: **http://localhost:3000**
   - Browser should open automatically
   - You should see the login page

**Common Issues:**
- Port 3000 already in use: Kill the process or use a different port
- Module not found errors: Delete `node_modules` and run `npm install` again
- Compilation errors: Check for syntax errors in React files

---

### Step 3: Start Python ML API

1. Open a **third terminal** in VS Code
2. Navigate to project root (if not already there):
   ```bash
   cd ..
   ```

3. **(First time only)** Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. **(First time only)** Train the ML model:
   ```bash
   python train_improved_model.py
   ```
   This creates the v2 model files in the `models/` directory.

5. Start the ML API:
   ```bash
   python api/app.py
   ```

6. **Verify it's running**:
   - Look for: `✓ Model and preprocessors loaded successfully!`
   - Look for: `Running on http://127.0.0.1:5000`
   - ML API runs on: **http://localhost:5000**
   - Test: Open http://localhost:5000 in browser

**Common Issues:**
- Module not found: Install missing packages with `pip install <package-name>`
- Model files not found: Run `python train_improved_model.py` first
- Port 5000 already in use: Change port in `api/app.py`

---

## Optional: IoT Sensor Simulator

To simulate real-time sensor data (optional):

1. Open a **fourth terminal**
2. Run the sensor simulator:
   ```bash
   python sensor_simulator.py
   ```

This will send sensor data every 10 seconds to create alerts automatically.

---

## Verification Checklist

After starting all services, verify:

- [ ] **Backend**: http://localhost:8081/api/test shows "API is working"
- [ ] **Frontend**: http://localhost:3000 shows login page
- [ ] **ML API**: http://localhost:5000 shows health check JSON
- [ ] **Database**: Check backend logs for successful database connection
- [ ] **Login**: Can select a role and login successfully

---

## System URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React application (login page) |
| Backend API | http://localhost:8081 | Spring Boot REST API |
| ML API | http://localhost:5000 | Python Flask ML prediction API |
| Backend Test | http://localhost:8081/api/test | API health check |
| ML API Info | http://localhost:5000/info | ML model information |

---

## Default Login Credentials

The system uses **demo mode** - no password required!

On the login page, select one of these roles:

1. **👑 Administrator**
   - Full system access
   - Can manage users, settings, analytics

2. **🔧 Technician**
   - Manage panels and alerts
   - Run diagnostics

3. **👁️ Viewer**
   - Read-only access
   - View dashboard and reports

---

## Stopping the System

To stop all services:

1. **Spring Boot Backend**: Press `Ctrl+C` in Terminal 1
2. **React Frontend**: Press `Ctrl+C` in Terminal 2
3. **Python ML API**: Press `Ctrl+C` in Terminal 3
4. **Sensor Simulator** (if running): Press `Ctrl+C` in Terminal 4

---

## Alternative: Using VS Code Tasks

You can create a `.vscode/tasks.json` file to start all services with one command:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "mvn spring-boot:run",
      "options": {
        "cwd": "${workspaceFolder}/spring-backend"
      },
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Start Frontend",
      "type": "shell",
      "command": "npm start",
      "options": {
        "cwd": "${workspaceFolder}/react-frontend"
      },
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Start ML API",
      "type": "shell",
      "command": "python api/app.py",
      "options": {
        "cwd": "${workspaceFolder}"
      },
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Start All Services",
      "dependsOn": [
        "Start Backend",
        "Start Frontend",
        "Start ML API"
      ],
      "problemMatcher": []
    }
  ]
}
```

Then run: `Terminal → Run Task → Start All Services`

---

## Troubleshooting

### Backend won't start
```bash
# Check Java version
java -version

# Clean and rebuild
cd spring-backend
mvn clean install -U

# Check if port 8081 is in use
netstat -ano | findstr :8081  # Windows
lsof -i :8081                  # Mac/Linux
```

### Frontend won't start
```bash
# Clear cache and reinstall
cd react-frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### ML API won't start
```bash
# Check Python version
python --version

# Reinstall dependencies
pip install -r requirements.txt --upgrade

# Retrain model if needed
python train_improved_model.py
```

### Database connection issues
- Ensure PostgreSQL is running
- Check credentials in `spring-backend/src/main/resources/application.properties`
- Create database if it doesn't exist:
  ```sql
  CREATE DATABASE solar_panel_db;
  ```

---

## Development Tips

### Hot Reload
- **Frontend**: Changes auto-reload (React Fast Refresh)
- **Backend**: Restart required (or use Spring DevTools)
- **ML API**: Restart required

### Viewing Logs
- **Backend**: Check terminal output or `spring-backend/logs/`
- **Frontend**: Check browser console (F12)
- **ML API**: Check terminal output

### Database Access
- Use pgAdmin or any PostgreSQL client
- Connection: localhost:5432
- Database: solar_panel_db

---

## Production Deployment

For production deployment:

1. **Build Frontend**:
   ```bash
   cd react-frontend
   npm run build
   ```

2. **Package Backend**:
   ```bash
   cd spring-backend
   mvn clean package
   java -jar target/solar-panel-fault-detection-0.0.1-SNAPSHOT.jar
   ```

3. **Run ML API with Gunicorn**:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 api.app:app
   ```

---

## Summary

**Minimum commands to start everything:**

```bash
# Terminal 1
cd spring-backend && mvn spring-boot:run

# Terminal 2
cd react-frontend && npm start

# Terminal 3
python api/app.py
```

**Then open**: http://localhost:3000

That's it! The system is now running and ready to use. 🚀

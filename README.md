# ☀️ Solar Panel Fault Detection System

An AI-powered, full-stack application for real-time solar panel fault detection and monitoring using Machine Learning, Spring Boot, and React.

![System Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

### 🤖 Machine Learning
- **Random Forest Classifier** for fault detection
- **Real-time predictions** with confidence scores
- **Multiple fault types** detection:
  - Panel Degradation
  - Dust Accumulation
  - Partial Shading
  - Inverter Fault
  - Normal Operation

### 🏭 Plant & Panel Management
- **CRUD operations** for solar plants and panels
- **Status tracking** (Active, Maintenance, Offline)
- **Technician assignment** for maintenance
- **Real-time monitoring** of panel performance

### 🚨 Alert Management System
- **Automatic alert generation** from sensor data
- **Maintenance workflow** (Open → In Progress → Resolved)
- **Severity levels** (Critical, High, Medium, Low)
- **Technician notes** and assignment
- **Filter and sort** capabilities

### 📊 Live Dashboard
- **Real-time statistics** with auto-refresh
- **Plant and panel metrics**
- **Alert distribution** visualization
- **System health monitoring**

### 🔐 Authentication & Authorization
- **JWT-based authentication**
- **Role-based access control** (Admin, Technician, Viewer)
- **Secure password handling**
- **User management**

### 📡 IoT Integration
- **Sensor data processing** pipeline
- **Automatic ML prediction** on data receipt
- **Alert generation** for detected faults
- **Sensor simulator** for testing

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 3000)
│   (User Interface)│
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│ Spring Boot API │ (Port 8081)
│  (Business Logic)│
└────┬────────┬───┘
     │        │
     │        └──────────┐
     │                   │ HTTP
     ▼                   ▼
┌─────────┐      ┌──────────────┐
│   H2    │      │  ML API      │ (Port 5000)
│Database │      │ (Python/Flask)│
└─────────┘      └──────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Java 17+**
- **Node.js 14+**
- **Python 3.8+**
- **Maven 3.6+**
- **npm 6+**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/solar-panel-fault-detection.git
cd solar-panel-fault-detection
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Install React dependencies**
```bash
cd react-frontend
npm install
cd ..
```

4. **Build Spring Boot backend**
```bash
cd spring-backend
mvn clean install -DskipTests
cd ..
```

### Running the Application

#### Option 1: Start All Services Manually

**Terminal 1 - ML API:**
```bash
python api/app.py
```

**Terminal 2 - Spring Boot Backend:**
```bash
cd spring-backend
mvn spring-boot:run
```

**Terminal 3 - React Frontend:**
```bash
cd react-frontend
npm start
```

#### Option 2: Use the Sensor Simulator (Optional)
```bash
python sensor_simulator.py
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8081/api/v1
- **ML API:** http://localhost:5000

### Default Login Credentials

- **Admin:** `admin` / `Admin123!`
- **Technician:** `technician` / `Tech123!`
- **Viewer:** `viewer` / `Viewer123!`

## 📁 Project Structure

```
solar-panel-fault-detection/
├── api/                          # Python ML API
│   ├── app.py                   # Flask application
│   └── test_api.py              # API tests
├── spring-backend/              # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/            # Java source code
│   │   │   └── resources/       # Configuration files
│   │   └── test/                # Unit tests
│   └── pom.xml                  # Maven configuration
├── react-frontend/              # React frontend
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── contexts/            # React contexts
│   │   ├── pages/               # Page components
│   │   └── services/            # API services
│   └── package.json             # npm configuration
├── src/                         # Python ML modules
│   ├── model.py                 # ML model training
│   ├── predictor.py             # Prediction logic
│   └── preprocessor.py          # Data preprocessing
├── data/                        # Training data
├── models/                      # Trained ML models
├── plots/                       # Visualization outputs
└── sensor_simulator.py          # IoT sensor simulator
```
```

### Frontend Configuration
Edit `react-frontend/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  timeout: 30000
});
```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/profile` - Get user profile

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

### Plants
- `GET /api/v1/plants` - Get all plants
- `POST /api/v1/plants` - Create plant
- `PUT /api/v1/plants/{id}` - Update plant
- `DELETE /api/v1/plants/{id}` - Delete plant

### Panels
- `GET /api/v1/panels` - Get all panels
- `POST /api/v1/panels` - Create panel
- `GET /api/v1/panels/plant/{plantId}` - Get panels by plant
- `PUT /api/v1/panels/{id}` - Update panel
- `DELETE /api/v1/panels/{id}` - Delete panel

### Alerts
- `GET /api/v1/alerts` - Get all alerts
- `GET /api/v1/alerts/status/{status}` - Get alerts by status
- `POST /api/v1/alerts/{id}/acknowledge` - Acknowledge alert
- `PUT /api/v1/alerts/{id}/status` - Update alert status
- `PUT /api/v1/alerts/{id}/assign` - Assign technician
- `PUT /api/v1/alerts/{id}/notes` - Add technician notes

### Sensor Data
- `POST /api/v1/sensor-data` - Submit sensor data

### ML Predictions
- `POST /predict` - Get fault prediction (ML API)

## 🧪 Testing

### Run Backend Tests
```bash
cd spring-backend
mvn test
```

### Run ML API Tests
```bash
python api/test_api.py
```

### Test with Sensor Simulator
```bash
python sensor_simulator.py
```

## 🎯 Usage Guide

### 1. Create a Solar Plant
1. Navigate to "Plants" in the sidebar
2. Click "Add Plant"
3. Fill in plant details (name, location, capacity)
4. Click "Save"

### 2. Add Solar Panels
1. Navigate to "Manage Panels" in the sidebar
2. Click "Add Panel"
3. Select a plant from the dropdown
4. Fill in panel details (panel ID, capacity, status)
5. Click "Save"

### 3. Simulate Sensor Data
1. Run the sensor simulator: `python sensor_simulator.py`
2. The simulator sends data every 10 seconds
3. Watch alerts being generated automatically
4. View real-time updates on the dashboard

### 4. Manage Alerts
1. Navigate to "Alerts" in the sidebar
2. View all generated alerts
3. Filter by severity or status
4. Acknowledge alerts
5. Update alert status (Open → In Progress → Resolved)
6. Add technician notes

## 🔍 Features in Detail

### Machine Learning Model
- **Algorithm:** Random Forest Classifier
- **Features:** Voltage, Current, Temperature, Irradiance, Power
- **Output:** Fault type, Severity, Confidence score
- **Accuracy:** ~95% on test data

### Real-time Data Flow
1. Sensor sends data → POST /sensor-data
2. Backend receives data → Calls ML API
3. ML API returns prediction → Backend saves result
4. If fault detected → Alert generated automatically
5. Frontend displays → Real-time updates

## 📝 Documentation

- [System Startup Guide](SYSTEM_STARTUP_SUMMARY.md)
- [Enhanced Alerts & Dashboard](ENHANCED_ALERTS_DASHBOARD_SUMMARY.md)
- [Sensor Data Flow](SENSOR_DATA_FLOW_IMPLEMENTATION.md)
- [Dynamic System Implementation](DYNAMIC_SYSTEM_IMPLEMENTATION.md)
- [Sidebar Navigation Fix](SIDEBAR_NAVIGATION_FIX.md)

## 🙏 Acknowledgments

- Random Forest algorithm for fault detection
- Spring Boot for robust backend
- React for modern UI
- Flask for lightweight ML API



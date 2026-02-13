# Solar Panel Fault Detection System

A comprehensive machine learning system for detecting faults in solar panels using tabular sensor data and Random Forest classification. The system includes a Python ML backend, Spring Boot API server, and React frontend dashboard with secure authentication.

## System Architecture

- **Python ML Backend**: Random Forest classifier with Flask API
- **Spring Boot Backend**: Secure REST API with JWT authentication and role-based access
- **React Frontend**: Interactive dashboard for analysis and monitoring
- **MySQL Database**: Stores user data, predictions, and analytics

## Features

### Machine Learning
- **Synthetic Dataset Generation**: Creates realistic solar panel sensor data with various fault types
- **Data Preprocessing**: Comprehensive data cleaning, scaling, and encoding pipeline
- **Random Forest Classification**: Robust machine learning model for fault detection
- **Model Evaluation**: Detailed performance metrics and visualizations
- **Prediction Interface**: Easy-to-use prediction functions for real-time fault detection

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: ADMIN and OPERATOR roles with different permissions
- **Password Security**: Strong password requirements with real-time strength validation
- **Secure Registration**: Public registration restricted to OPERATOR role only
- **Admin User Management**: ADMINs can create other ADMIN users through secure endpoint

### Web Interface
- **Interactive Dashboard**: Real-time fault detection and monitoring
- **Analytics**: Comprehensive charts and statistics
- **History Tracking**: View past predictions and trends
- **Responsive Design**: Works on desktop and mobile devices

## Fault Types Detected

1. **NORMAL** - Panel operating normally
2. **PARTIAL_SHADING** - Reduced power due to shading
3. **PANEL_DEGRADATION** - Overall performance degradation
4. **INVERTER_FAULT** - Inverter malfunction causing voltage issues
5. **DUST_ACCUMULATION** - Efficiency reduction due to dust buildup

## Sensor Features

- **Voltage** (V) - Panel output voltage
- **Current** (A) - Panel output current  
- **Temperature** (°C) - Panel surface temperature
- **Irradiance** (W/m²) - Solar irradiance level
- **Power** (W) - Panel power output

## Project Structure

```
solar-panel-fault-detection/
├── src/                      # Python ML Core
│   ├── __init__.py
│   ├── data_generator.py      # Synthetic dataset generation
│   ├── preprocessor.py        # Data preprocessing pipeline
│   ├── model.py              # Random Forest model implementation
│   └── predictor.py          # Prediction interface
├── api/                      # Python Flask API
│   ├── __init__.py
│   ├── app.py                # Flask REST API
│   └── test_api.py           # API test suite
├── spring-backend/           # Spring Boot Backend
│   ├── src/main/java/        # Java source code
│   ├── src/test/java/        # Java tests
│   ├── pom.xml              # Maven dependencies
│   └── README.md            # Backend documentation
├── react-frontend/           # React Frontend
│   ├── src/                 # React source code
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   └── README.md            # Frontend documentation
├── data/                     # Generated datasets
├── models/                   # Trained models and preprocessors
├── plots/                    # Generated visualizations
├── main.py                   # Main ML training script
├── run_api.py               # API launcher script
├── example_usage.py         # Usage examples
├── requirements.txt         # Python dependencies
├── SECURITY_FIX_SUMMARY.md  # Security documentation
└── README.md               # This file
```

## Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure authentication with configurable expiration
- **Role-Based Access**: 
  - `ADMIN`: Full access to analytics, user management, and system administration
  - `OPERATOR`: Access to analysis tools and prediction history
- **Secure Registration**: Public registration restricted to OPERATOR role only
- **Password Security**: Real-time password strength validation with security requirements

### API Security
- **Protected Endpoints**: Role-based endpoint protection
- **Input Validation**: Comprehensive request validation and sanitization
- **Error Handling**: Secure error responses without information leakage

### Registration Security
⚠️ **Important**: Public registration only allows OPERATOR role creation. To create ADMIN users:
1. Use existing ADMIN account to access `/auth/admin/create-user` endpoint
2. Contact system administrator for ADMIN access
3. See `SECURITY_FIX_SUMMARY.md` for detailed security implementation

## Installation

1. Install required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Quick Start

Run the complete pipeline:
```bash
python main.py
```

This will:
1. Generate synthetic dataset (10,000 samples)
2. Preprocess the data
3. Train Random Forest model
4. Evaluate model performance
5. Test prediction functionality
6. Save trained model and preprocessors

### Making Predictions

```python
from src.predictor import predict_fault

# Predict fault for sensor readings
result = predict_fault(
    voltage=32.5,
    current=8.2, 
    temperature=25.0,
    irradiance=850.0,
    power=266.5
)

print(f"Predicted fault: {result['predicted_fault_type']}")
print(f"Confidence: {result['confidence']}")
print(f"Description: {result['fault_description']}")
print(f"Recommendation: {result['maintenance_recommendation']}")
```

### Using the Predictor Class

```python
from src.predictor import SolarFaultPredictor

# Initialize predictor with trained model
predictor = SolarFaultPredictor(
    model_path='models/solar_fault_model.pkl',
    preprocessor_path='models/preprocessors'
)

# Analyze a sample
analysis = predictor.analyze_sample(
    voltage=28.0, current=4.5, temperature=24.0, 
    irradiance=600.0, power=126.0
)

print(analysis)
```

### Custom Dataset Generation

```python
from src.data_generator import SolarDataGenerator

generator = SolarDataGenerator(random_state=42)
df = generator.generate_dataset(n_samples=5000)
df.to_csv('custom_dataset.csv', index=False)
```

### Custom Model Training

```python
from src.preprocessor import SolarDataPreprocessor
from src.model import SolarFaultDetectionModel

# Preprocess data
preprocessor = SolarDataPreprocessor()
X_train, X_test, y_train, y_test = preprocessor.preprocess_pipeline('data/solar_panel_data.csv')

# Train model with custom parameters
model = SolarFaultDetectionModel(
    n_estimators=200,
    max_depth=15,
    random_state=42
)
model.train(X_train, y_train)

# Evaluate
class_names = preprocessor.label_encoder.classes_
results = model.evaluate(X_test, y_test, class_names)
```

## Model Performance

The Random Forest model typically achieves:
- **Accuracy**: ~95-98% on test data
- **Precision/Recall**: High performance across all fault types
- **Feature Importance**: Power and voltage are typically most important features

## Output Files

After running `main.py`, the following files are generated:

- `data/solar_panel_data.csv` - Synthetic dataset
- `models/solar_fault_model.pkl` - Trained Random Forest model
- `models/preprocessors_scaler.pkl` - Feature scaler
- `models/preprocessors_label_encoder.pkl` - Label encoder
- `plots/confusion_matrix.png` - Confusion matrix visualization
- `plots/feature_importance.png` - Feature importance plot

## API Reference

### SolarFaultPredictor

Main class for making predictions:

- `predict_single()` - Predict fault for single sample
- `predict_batch()` - Predict faults for multiple samples  
- `analyze_sample()` - Complete analysis with recommendations
- `get_fault_description()` - Get fault type description
- `get_maintenance_recommendation()` - Get maintenance advice

### SolarDataGenerator

Generate synthetic datasets:

- `generate_dataset()` - Create synthetic dataset
- `generate_and_save_dataset()` - Generate and save to CSV

### SolarDataPreprocessor

Data preprocessing pipeline:

- `preprocess_pipeline()` - Complete preprocessing
- `preprocess_single_sample()` - Preprocess single sample
- `save_preprocessors()` - Save fitted preprocessors
- `load_preprocessors()` - Load saved preprocessors

### SolarFaultDetectionModel

Random Forest model wrapper:

- `train()` - Train the model
- `predict()` - Make predictions
- `evaluate()` - Evaluate performance
- `save_model()` - Save trained model
- `load_model()` - Load saved model

## REST API

The project includes a Flask REST API for real-time fault detection.

### Starting the API Server

```bash
# Method 1: Using the convenience script
python run_api.py

# Method 2: Direct Flask app
python api/app.py
```

The API will be available at `http://localhost:5000`

### API Endpoints

#### Health Check
```
GET /
```
Returns API status and available endpoints.

#### API Information
```
GET /info
```
Returns detailed API and model information.

#### Fault Prediction
```
POST /predict
Content-Type: application/json

{
    "voltage": 32.5,
    "current": 8.2,
    "temperature": 25.0,
    "irradiance": 850.0,
    "power": 266.5
}
```

**Response:**
```json
{
    "predicted_fault": "NORMAL",
    "confidence": "High",
    "confidence_score": 0.95,
    "severity": "None",
    "description": "Panel is operating normally with no detected faults.",
    "maintenance_recommendation": "Continue regular monitoring. No immediate action required.",
    "all_probabilities": {
        "NORMAL": 0.95,
        "PARTIAL_SHADING": 0.02,
        "PANEL_DEGRADATION": 0.01,
        "INVERTER_FAULT": 0.01,
        "DUST_ACCUMULATION": 0.01
    },
    "input_values": {
        "voltage": 32.5,
        "current": 8.2,
        "temperature": 25.0,
        "irradiance": 850.0,
        "power": 266.5
    }
}
```

### Testing the API

```bash
# Run comprehensive API tests
python api/test_api.py
```

### API Usage Examples

**Using curl:**
```bash
# Health check
curl http://localhost:5000/

# Get API info
curl http://localhost:5000/info

# Make prediction
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "voltage": 32.5,
    "current": 8.2,
    "temperature": 25.0,
    "irradiance": 850.0,
    "power": 266.5
  }'
```

**Using Python requests:**
```python
import requests

# Make prediction
response = requests.post('http://localhost:5000/predict', json={
    'voltage': 32.5,
    'current': 8.2,
    'temperature': 25.0,
    'irradiance': 850.0,
    'power': 266.5
})

result = response.json()
print(f"Predicted fault: {result['predicted_fault']}")
```

### Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or missing fields
- **404 Not Found**: Endpoint doesn't exist
- **405 Method Not Allowed**: Wrong HTTP method
- **500 Internal Server Error**: Server-side errors

Example error response:
```json
{
    "error": "Invalid input data",
    "message": "Missing required fields: voltage, current"
}
```

## Requirements

- Python 3.7+
- pandas 2.0.3
- numpy 1.24.3
- scikit-learn 1.3.0
- joblib 1.3.2
- matplotlib 3.7.2
- seaborn 0.12.2
- flask 2.3.3
- flask-cors 4.0.0

## License

This project is open source and available under the MIT License.
"""
Flask REST API for Solar Panel Fault Detection.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import traceback
from typing import Dict, Any

# Add the parent directory to the path to import src modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.predictor import SolarFaultPredictor

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global predictor instance
predictor = None

def initialize_predictor():
    """Initialize the predictor with trained model and preprocessors."""
    global predictor
    
    try:
        model_path = os.path.join('models', 'solar_fault_model.pkl')
        preprocessor_path = os.path.join('models', 'preprocessors')
        
        # Check if model files exist
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        scaler_path = f"{preprocessor_path}_scaler.pkl"
        encoder_path = f"{preprocessor_path}_label_encoder.pkl"
        
        if not os.path.exists(scaler_path):
            raise FileNotFoundError(f"Scaler file not found: {scaler_path}")
        
        if not os.path.exists(encoder_path):
            raise FileNotFoundError(f"Label encoder file not found: {encoder_path}")
        
        predictor = SolarFaultPredictor(model_path, preprocessor_path)
        print("✓ Model and preprocessors loaded successfully!")
        return True
        
    except Exception as e:
        print(f"✗ Error initializing predictor: {e}")
        print("Make sure to run 'python main.py' first to train the model!")
        return False

def validate_input_data(data: Dict[str, Any]) -> tuple[bool, str]:
    """
    Validate input data for prediction.
    
    Args:
        data: Input data dictionary
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    required_fields = ['voltage', 'current', 'temperature', 'irradiance', 'power']
    
    # Check if all required fields are present
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    # Check if all values are numeric
    for field in required_fields:
        value = data[field]
        if not isinstance(value, (int, float)):
            try:
                float(value)
            except (ValueError, TypeError):
                return False, f"Field '{field}' must be a numeric value, got: {value}"
    
    # Validate reasonable ranges for sensor values
    validations = {
        'voltage': (0, 100, 'Voltage must be between 0 and 100 volts'),
        'current': (0, 50, 'Current must be between 0 and 50 amperes'),
        'temperature': (-50, 100, 'Temperature must be between -50 and 100 degrees Celsius'),
        'irradiance': (0, 2000, 'Irradiance must be between 0 and 2000 W/m²'),
        'power': (0, 5000, 'Power must be between 0 and 5000 watts')
    }
    
    for field, (min_val, max_val, error_msg) in validations.items():
        value = float(data[field])
        if not (min_val <= value <= max_val):
            return False, error_msg
    
    return True, ""

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'message': 'Solar Panel Fault Detection API is running',
        'model_loaded': predictor is not None,
        'endpoints': {
            'predict': '/predict (POST)',
            'health': '/ (GET)',
            'info': '/info (GET)'
        }
    })

@app.route('/info', methods=['GET'])
def get_info():
    """Get API and model information."""
    if predictor is None:
        return jsonify({
            'error': 'Model not loaded',
            'message': 'Run main.py first to train the model'
        }), 500
    
    return jsonify({
        'api_version': '1.0.0',
        'model_info': {
            'type': 'Random Forest Classifier',
            'features': ['voltage', 'current', 'temperature', 'irradiance', 'power'],
            'fault_types': [
                'NORMAL',
                'PARTIAL_SHADING', 
                'PANEL_DEGRADATION',
                'INVERTER_FAULT',
                'DUST_ACCUMULATION'
            ]
        },
        'input_format': {
            'voltage': 'Panel voltage in volts (0-100)',
            'current': 'Panel current in amperes (0-50)',
            'temperature': 'Panel temperature in Celsius (-50 to 100)',
            'irradiance': 'Solar irradiance in W/m² (0-2000)',
            'power': 'Panel power output in watts (0-5000)'
        },
        'example_request': {
            'voltage': 32.5,
            'current': 8.2,
            'temperature': 25.0,
            'irradiance': 850.0,
            'power': 266.5
        }
    })

@app.route('/predict', methods=['POST'])
def predict_fault():
    """
    Predict solar panel fault based on sensor readings.
    
    Expected JSON input:
    {
        "voltage": float,
        "current": float,
        "temperature": float,
        "irradiance": float,
        "power": float
    }
    
    Returns JSON response with prediction results.
    """
    try:
        # Check if model is loaded
        if predictor is None:
            return jsonify({
                'error': 'Model not loaded',
                'message': 'Model initialization failed. Check server logs.'
            }), 500
        
        # Check if request contains JSON data
        if not request.is_json:
            return jsonify({
                'error': 'Invalid request format',
                'message': 'Request must contain JSON data'
            }), 400
        
        data = request.get_json()
        
        # Validate input data
        is_valid, error_message = validate_input_data(data)
        if not is_valid:
            return jsonify({
                'error': 'Invalid input data',
                'message': error_message
            }), 400
        
        # Extract sensor values
        voltage = float(data['voltage'])
        current = float(data['current'])
        temperature = float(data['temperature'])
        irradiance = float(data['irradiance'])
        power = float(data['power'])
        
        # Make prediction
        result = predictor.analyze_sample(voltage, current, temperature, irradiance, power)
        
        # Check if prediction was successful
        if 'error' in result:
            return jsonify({
                'error': 'Prediction failed',
                'message': result['error']
            }), 500
        
        # Format response
        response = {
            'predicted_fault': result['predicted_fault_type'],
            'confidence': result['confidence'],
            'confidence_score': result['confidence_score'],
            'severity': result['severity'],
            'description': result['fault_description'],
            'maintenance_recommendation': result['maintenance_recommendation'],
            'all_probabilities': result['all_probabilities'],
            'input_values': result['input_values']
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        # Log the full error for debugging
        error_trace = traceback.format_exc()
        print(f"Error in predict_fault: {error_trace}")
        
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred during prediction'
        }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        'error': 'Endpoint not found',
        'message': 'The requested endpoint does not exist',
        'available_endpoints': ['/', '/info', '/predict']
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors."""
    return jsonify({
        'error': 'Method not allowed',
        'message': 'The HTTP method is not allowed for this endpoint'
    }), 405

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    print("Starting Solar Panel Fault Detection API...")
    print("=" * 50)
    
    # Initialize the predictor
    if initialize_predictor():
        print("Starting Flask server...")
        print("API will be available at: http://localhost:5000")
        print("Endpoints:")
        print("  GET  /       - Health check")
        print("  GET  /info   - API information")
        print("  POST /predict - Fault prediction")
        print("=" * 50)
        
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("Failed to initialize predictor. Exiting...")
        sys.exit(1)
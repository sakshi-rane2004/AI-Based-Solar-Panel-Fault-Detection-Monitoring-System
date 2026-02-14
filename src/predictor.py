"""
Prediction module for solar panel fault detection.
"""
import numpy as np
import joblib
from typing import Dict, Tuple, List
from .preprocessor import SolarDataPreprocessor
from .model import SolarFaultDetectionModel

class SolarFaultPredictor:
    """Complete prediction pipeline for solar panel fault detection."""
    
    def __init__(self, model_path: str = None, preprocessor_path: str = None):
        """
        Initialize predictor with optional pre-trained model and preprocessor.
        
        Args:
            model_path: Path to saved model file
            preprocessor_path: Path prefix for saved preprocessor files
        """
        self.model = SolarFaultDetectionModel()
        self.preprocessor = SolarDataPreprocessor()
        self.fault_classes = ['NORMAL', 'PARTIAL_SHADING', 'PANEL_DEGRADATION', 
                             'INVERTER_FAULT', 'DUST_ACCUMULATION']
        
        if model_path and preprocessor_path:
            self.load_trained_components(model_path, preprocessor_path)
    
    def load_trained_components(self, model_path: str, preprocessor_path: str) -> None:
        """
        Load pre-trained model and preprocessor.
        
        Args:
            model_path: Path to saved model file
            preprocessor_path: Path prefix for saved preprocessor files
        """
        try:
            self.model.load_model(model_path)
            
            # Check if this is v2 model (with different file naming)
            if '_v2' in preprocessor_path or '_v2' in model_path:
                # V2 model uses different naming: preprocessors_scaler_v2.pkl
                scaler_path = preprocessor_path.replace('_v2', '') + '_scaler_v2.pkl'
                encoder_path = preprocessor_path.replace('_v2', '') + '_label_encoder_v2.pkl'
                self.preprocessor.scaler = joblib.load(scaler_path)
                self.preprocessor.label_encoder = joblib.load(encoder_path)
                print(f"Loaded v2 preprocessors from {scaler_path} and {encoder_path}")
            else:
                # V1 model uses standard naming
                self.preprocessor.load_preprocessors(preprocessor_path)
            
            print("Trained components loaded successfully!")
        except Exception as e:
            print(f"Error loading trained components: {e}")
            raise
    
    def predict_single(self, voltage: float, current: float, temperature: float, 
                      irradiance: float, power: float) -> Dict[str, any]:
        """
        Predict fault type for a single set of sensor readings.
        
        Args:
            voltage: Panel voltage (V)
            current: Panel current (A)
            temperature: Panel temperature (°C)
            irradiance: Solar irradiance (W/m²)
            power: Panel power output (W)
            
        Returns:
            Dictionary containing prediction results
        """
        # Prepare input sample
        sample = {
            'voltage': voltage,
            'current': current,
            'temperature': temperature,
            'irradiance': irradiance,
            'power': power
        }
        
        try:
            # Preprocess the sample
            X_sample = self.preprocessor.preprocess_single_sample(sample)
            
            # Make prediction
            prediction = self.model.predict(X_sample)[0]
            probabilities = self.model.predict_proba(X_sample)[0]
            
            # Decode prediction
            fault_type = self.preprocessor.label_encoder.inverse_transform([prediction])[0]
            
            # Create probability dictionary
            prob_dict = {}
            for i, class_name in enumerate(self.preprocessor.label_encoder.classes_):
                prob_dict[class_name] = round(probabilities[i], 4)
            
            # Determine confidence level
            max_prob = max(probabilities)
            if max_prob >= 0.8:
                confidence = "High"
            elif max_prob >= 0.6:
                confidence = "Medium"
            else:
                confidence = "Low"
            
            result = {
                'predicted_fault_type': fault_type,
                'confidence': confidence,
                'confidence_score': round(max_prob, 4),
                'all_probabilities': prob_dict,
                'input_values': sample
            }
            
            return result
            
        except Exception as e:
            return {
                'error': f"Prediction failed: {str(e)}",
                'input_values': sample
            }
    
    def predict_batch(self, samples: List[Dict[str, float]]) -> List[Dict[str, any]]:
        """
        Predict fault types for multiple samples.
        
        Args:
            samples: List of dictionaries containing sensor readings
            
        Returns:
            List of prediction results
        """
        results = []
        
        for sample in samples:
            result = self.predict_single(
                voltage=sample['voltage'],
                current=sample['current'],
                temperature=sample['temperature'],
                irradiance=sample['irradiance'],
                power=sample['power']
            )
            results.append(result)
        
        return results
    
    def get_fault_description(self, fault_type: str) -> str:
        """
        Get description of the fault type.
        
        Args:
            fault_type: The predicted fault type
            
        Returns:
            Description of the fault
        """
        descriptions = {
            'NORMAL': 'Panel is operating normally with no detected faults.',
            'PARTIAL_SHADING': 'Panel is experiencing partial shading, reducing power output.',
            'PANEL_DEGRADATION': 'Panel shows signs of degradation with reduced overall performance.',
            'INVERTER_FAULT': 'Inverter malfunction detected, causing voltage irregularities.',
            'DUST_ACCUMULATION': 'Dust accumulation on panel surface is reducing efficiency.'
        }
        
        return descriptions.get(fault_type, 'Unknown fault type.')
    
    def get_maintenance_recommendation(self, fault_type: str) -> str:
        """
        Get maintenance recommendation based on fault type.
        
        Args:
            fault_type: The predicted fault type
            
        Returns:
            Maintenance recommendation
        """
        recommendations = {
            'NORMAL': 'Continue regular monitoring. No immediate action required.',
            'PARTIAL_SHADING': 'Check for obstructions (trees, buildings, debris) and remove if possible.',
            'PANEL_DEGRADATION': 'Schedule professional inspection. Panel may need replacement.',
            'INVERTER_FAULT': 'Contact technician immediately for inverter inspection and repair.',
            'DUST_ACCUMULATION': 'Clean panel surface with appropriate cleaning equipment.'
        }
        
        return recommendations.get(fault_type, 'Consult with solar panel technician.')
    
    def analyze_sample(self, voltage: float, current: float, temperature: float, 
                      irradiance: float, power: float) -> Dict[str, any]:
        """
        Complete analysis of a single sample including prediction and recommendations.
        
        Args:
            voltage: Panel voltage (V)
            current: Panel current (A)
            temperature: Panel temperature (°C)
            irradiance: Solar irradiance (W/m²)
            power: Panel power output (W)
            
        Returns:
            Complete analysis results
        """
        # Get prediction
        prediction_result = self.predict_single(voltage, current, temperature, irradiance, power)
        
        if 'error' in prediction_result:
            return prediction_result
        
        fault_type = prediction_result['predicted_fault_type']
        
        # Add additional analysis
        analysis = prediction_result.copy()
        analysis.update({
            'fault_description': self.get_fault_description(fault_type),
            'maintenance_recommendation': self.get_maintenance_recommendation(fault_type),
            'severity': self._assess_severity(fault_type, prediction_result['confidence_score'])
        })
        
        return analysis
    
    def _assess_severity(self, fault_type: str, confidence_score: float) -> str:
        """
        Assess severity of the detected fault.
        
        Args:
            fault_type: The predicted fault type
            confidence_score: Confidence score of the prediction
            
        Returns:
            Severity level
        """
        if fault_type == 'NORMAL':
            return 'None'
        
        severity_map = {
            'DUST_ACCUMULATION': 'Low',
            'PARTIAL_SHADING': 'Medium',
            'PANEL_DEGRADATION': 'High',
            'INVERTER_FAULT': 'Critical'
        }
        
        base_severity = severity_map.get(fault_type, 'Medium')
        
        # Adjust based on confidence
        if confidence_score < 0.6:
            return f"{base_severity} (Uncertain)"
        
        return base_severity

# Convenience function for quick predictions
def predict_fault(voltage: float, current: float, temperature: float, 
                 irradiance: float, power: float, 
                 model_path: str = 'models/solar_fault_model.pkl',
                 preprocessor_path: str = 'models/preprocessors') -> Dict[str, any]:
    """
    Quick prediction function that loads model and makes prediction.
    
    Args:
        voltage: Panel voltage (V)
        current: Panel current (A)
        temperature: Panel temperature (°C)
        irradiance: Solar irradiance (W/m²)
        power: Panel power output (W)
        model_path: Path to saved model
        preprocessor_path: Path prefix for preprocessors
        
    Returns:
        Prediction results
    """
    predictor = SolarFaultPredictor(model_path, preprocessor_path)
    return predictor.analyze_sample(voltage, current, temperature, irradiance, power)
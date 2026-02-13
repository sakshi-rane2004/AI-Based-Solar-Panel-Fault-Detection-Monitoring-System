"""
Main script for solar panel fault detection project.
"""
import os
import sys
from src.data_generator import generate_and_save_dataset
from src.preprocessor import SolarDataPreprocessor
from src.model import SolarFaultDetectionModel
from src.predictor import SolarFaultPredictor

def create_directories():
    """Create necessary directories for the project."""
    directories = ['data', 'models', 'plots']
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")

def main():
    """Main execution pipeline."""
    print("=== Solar Panel Fault Detection System ===\n")
    
    # Create directories
    create_directories()
    
    # Step 1: Generate synthetic dataset
    print("Step 1: Generating synthetic dataset...")
    generate_and_save_dataset('data/solar_panel_data.csv', n_samples=10000)
    print()
    
    # Step 2: Preprocess data
    print("Step 2: Preprocessing data...")
    preprocessor = SolarDataPreprocessor()
    X_train, X_test, y_train, y_test = preprocessor.preprocess_pipeline('data/solar_panel_data.csv')
    
    # Save preprocessors
    preprocessor.save_preprocessors('models/preprocessors')
    print()
    
    # Step 3: Train model
    print("Step 3: Training Random Forest model...")
    model = SolarFaultDetectionModel(n_estimators=100, random_state=42)
    model.train(X_train, y_train)
    
    # Save model
    model.save_model('models/solar_fault_model.pkl')
    print()
    
    # Step 4: Evaluate model
    print("Step 4: Evaluating model...")
    class_names = preprocessor.label_encoder.classes_
    results = model.evaluate(X_test, y_test, class_names)
    
    # Plot confusion matrix and feature importance
    try:
        model.plot_confusion_matrix(results['confusion_matrix'], class_names, 
                                  'plots/confusion_matrix.png')
        model.plot_feature_importance('plots/feature_importance.png')
    except Exception as e:
        print(f"Note: Could not generate plots (matplotlib display issue): {e}")
    
    print()
    
    # Step 5: Test prediction functionality
    print("Step 5: Testing prediction functionality...")
    
    # Initialize predictor
    predictor = SolarFaultPredictor('models/solar_fault_model.pkl', 'models/preprocessors')
    
    # Test samples
    test_samples = [
        {
            'name': 'Normal Operation',
            'voltage': 32.5,
            'current': 8.2,
            'temperature': 25.0,
            'irradiance': 850.0,
            'power': 266.5
        },
        {
            'name': 'Partial Shading',
            'voltage': 28.0,
            'current': 4.5,
            'temperature': 24.0,
            'irradiance': 600.0,
            'power': 126.0
        },
        {
            'name': 'Inverter Fault',
            'voltage': 22.0,
            'current': 6.8,
            'temperature': 40.0,
            'irradiance': 800.0,
            'power': 149.6
        }
    ]
    
    print("Testing predictions on sample data:")
    print("-" * 60)
    
    for sample in test_samples:
        print(f"\nTest Case: {sample['name']}")
        print(f"Input - Voltage: {sample['voltage']}V, Current: {sample['current']}A, "
              f"Temp: {sample['temperature']}°C, Irradiance: {sample['irradiance']}W/m², "
              f"Power: {sample['power']}W")
        
        result = predictor.analyze_sample(
            sample['voltage'], sample['current'], sample['temperature'],
            sample['irradiance'], sample['power']
        )
        
        if 'error' not in result:
            print(f"Predicted Fault: {result['predicted_fault_type']}")
            print(f"Confidence: {result['confidence']} ({result['confidence_score']:.3f})")
            print(f"Severity: {result['severity']}")
            print(f"Description: {result['fault_description']}")
            print(f"Recommendation: {result['maintenance_recommendation']}")
        else:
            print(f"Error: {result['error']}")
    
    print("\n" + "=" * 60)
    print("Solar Panel Fault Detection System Setup Complete!")
    print("=" * 60)
    
    # Print usage instructions
    print("\nUsage Instructions:")
    print("1. Use the trained model: models/solar_fault_model.pkl")
    print("2. Use the preprocessors: models/preprocessors_*.pkl")
    print("3. Import predictor: from src.predictor import predict_fault")
    print("4. Make predictions: predict_fault(voltage, current, temperature, irradiance, power)")
    
    return results

if __name__ == "__main__":
    try:
        results = main()
    except Exception as e:
        print(f"Error during execution: {e}")
        sys.exit(1)
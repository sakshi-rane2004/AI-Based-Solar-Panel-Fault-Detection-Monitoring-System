"""
Example usage of the Solar Panel Fault Detection System.
"""
from src.predictor import SolarFaultPredictor, predict_fault
from src.data_generator import SolarDataGenerator
import pandas as pd

def example_quick_prediction():
    """Example of quick prediction using the convenience function."""
    print("=== Quick Prediction Example ===")
    
    # Example sensor readings
    test_cases = [
        {
            'name': 'Normal Panel',
            'voltage': 32.1,
            'current': 8.5,
            'temperature': 26.2,
            'irradiance': 875.0,
            'power': 272.85
        },
        {
            'name': 'Shaded Panel', 
            'voltage': 27.8,
            'current': 4.2,
            'temperature': 23.5,
            'irradiance': 580.0,
            'power': 116.76
        },
        {
            'name': 'Degraded Panel',
            'voltage': 25.6,
            'current': 6.1,
            'temperature': 32.0,
            'irradiance': 820.0,
            'power': 156.16
        }
    ]
    
    for case in test_cases:
        print(f"\n--- {case['name']} ---")
        print(f"Inputs: V={case['voltage']}V, I={case['current']}A, "
              f"T={case['temperature']}°C, Irr={case['irradiance']}W/m², P={case['power']}W")
        
        try:
            result = predict_fault(
                voltage=case['voltage'],
                current=case['current'],
                temperature=case['temperature'],
                irradiance=case['irradiance'],
                power=case['power']
            )
            
            print(f"Prediction: {result['predicted_fault_type']}")
            print(f"Confidence: {result['confidence']} ({result['confidence_score']:.3f})")
            print(f"Severity: {result['severity']}")
            print(f"Recommendation: {result['maintenance_recommendation']}")
            
        except Exception as e:
            print(f"Error: {e}")
            print("Make sure to run main.py first to train the model!")

def example_batch_prediction():
    """Example of batch prediction using the predictor class."""
    print("\n=== Batch Prediction Example ===")
    
    try:
        # Initialize predictor
        predictor = SolarFaultPredictor(
            model_path='models/solar_fault_model.pkl',
            preprocessor_path='models/preprocessors'
        )
        
        # Generate some test samples
        generator = SolarDataGenerator(random_state=123)
        test_df = generator.generate_dataset(n_samples=5)
        
        print(f"Testing on {len(test_df)} samples:")
        print("-" * 50)
        
        for idx, row in test_df.iterrows():
            result = predictor.analyze_sample(
                voltage=row['voltage'],
                current=row['current'],
                temperature=row['temperature'],
                irradiance=row['irradiance'],
                power=row['power']
            )
            
            print(f"\nSample {idx + 1}:")
            print(f"  Actual: {row['fault_type']}")
            print(f"  Predicted: {result['predicted_fault_type']}")
            print(f"  Confidence: {result['confidence_score']:.3f}")
            print(f"  Match: {'✓' if row['fault_type'] == result['predicted_fault_type'] else '✗'}")
            
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure to run main.py first to train the model!")

def example_custom_dataset():
    """Example of generating and using a custom dataset."""
    print("\n=== Custom Dataset Example ===")
    
    # Generate smaller custom dataset
    generator = SolarDataGenerator(random_state=456)
    custom_df = generator.generate_dataset(n_samples=100)
    
    print(f"Generated custom dataset with {len(custom_df)} samples")
    print("\nFault type distribution:")
    print(custom_df['fault_type'].value_counts())
    
    print("\nSample data:")
    print(custom_df.head())
    
    # Save custom dataset
    custom_df.to_csv('data/custom_solar_data.csv', index=False)
    print("\nCustom dataset saved to 'data/custom_solar_data.csv'")

def example_model_info():
    """Example of getting model information."""
    print("\n=== Model Information Example ===")
    
    try:
        from src.model import SolarFaultDetectionModel
        
        # Load the trained model
        model = SolarFaultDetectionModel()
        model.load_model('models/solar_fault_model.pkl')
        
        # Get model information
        info = model.get_model_info()
        
        print("Model Information:")
        for key, value in info.items():
            print(f"  {key}: {value}")
            
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure to run main.py first to train the model!")

def main():
    """Run all examples."""
    print("Solar Panel Fault Detection - Usage Examples")
    print("=" * 50)
    
    # Run examples
    example_quick_prediction()
    example_batch_prediction()
    example_custom_dataset()
    example_model_info()
    
    print("\n" + "=" * 50)
    print("Examples completed!")
    print("\nTo get started:")
    print("1. Run 'python main.py' to train the model")
    print("2. Use the prediction functions in your own code")
    print("3. Check the README.md for detailed documentation")

if __name__ == "__main__":
    main()
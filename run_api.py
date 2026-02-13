"""
Convenience script to run the Solar Panel Fault Detection API.
"""
import os
import sys

def check_model_files():
    """Check if required model files exist."""
    required_files = [
        'models/solar_fault_model.pkl',
        'models/preprocessors_scaler.pkl',
        'models/preprocessors_label_encoder.pkl'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing required model files:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        print("\n🔧 Please run the following command first to train the model:")
        print("   python main.py")
        return False
    
    print("✅ All required model files found!")
    return True

def main():
    """Main function to run the API."""
    print("Solar Panel Fault Detection API Launcher")
    print("=" * 45)
    
    # Check if model files exist
    if not check_model_files():
        sys.exit(1)
    
    # Import and run the API
    try:
        from api.app import app, initialize_predictor
        
        print("🚀 Initializing predictor...")
        if initialize_predictor():
            print("🌐 Starting Flask server...")
            print("📡 API will be available at: http://localhost:5000")
            print("\n📋 Available endpoints:")
            print("   GET  /       - Health check")
            print("   GET  /info   - API information")
            print("   POST /predict - Fault prediction")
            print("\n🧪 To test the API, run: python api/test_api.py")
            print("=" * 45)
            
            app.run(debug=False, host='0.0.0.0', port=5000)
        else:
            print("❌ Failed to initialize predictor")
            sys.exit(1)
            
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure all dependencies are installed: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error starting API: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
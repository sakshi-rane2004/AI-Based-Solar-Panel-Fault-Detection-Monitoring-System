"""
Example script demonstrating how to use the Solar Panel Fault Detection API.
"""
import requests
import json

# API base URL
API_URL = "http://localhost:5000"

def test_api_connection():
    """Test if the API is running."""
    try:
        response = requests.get(f"{API_URL}/", timeout=5)
        if response.status_code == 200:
            print("✅ API is running and accessible")
            return True
        else:
            print(f"❌ API returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to API: {e}")
        print("Make sure the API server is running: python run_api.py")
        return False

def get_api_info():
    """Get API information."""
    try:
        response = requests.get(f"{API_URL}/info")
        if response.status_code == 200:
            info = response.json()
            print("\n📋 API Information:")
            print(f"   Version: {info['api_version']}")
            print(f"   Model Type: {info['model_info']['type']}")
            print(f"   Supported Fault Types: {', '.join(info['model_info']['fault_types'])}")
            return True
        else:
            print(f"❌ Failed to get API info: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Error getting API info: {e}")
        return False

def predict_fault(voltage, current, temperature, irradiance, power):
    """Make a fault prediction."""
    data = {
        'voltage': voltage,
        'current': current,
        'temperature': temperature,
        'irradiance': irradiance,
        'power': power
    }
    
    try:
        response = requests.post(
            f"{API_URL}/predict",
            json=data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            error_info = response.json()
            print(f"❌ Prediction failed: {error_info.get('message', 'Unknown error')}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error making prediction: {e}")
        return None

def main():
    """Main demonstration function."""
    print("Solar Panel Fault Detection API - Usage Example")
    print("=" * 50)
    
    # Test API connection
    if not test_api_connection():
        return
    
    # Get API information
    get_api_info()
    
    # Example predictions
    test_cases = [
        {
            'name': '🌞 Normal Panel Operation',
            'voltage': 33.2,
            'current': 8.5,
            'temperature': 26.0,
            'irradiance': 900.0,
            'power': 282.2
        },
        {
            'name': '🌤️ Partially Shaded Panel',
            'voltage': 27.5,
            'current': 4.2,
            'temperature': 23.0,
            'irradiance': 550.0,
            'power': 115.5
        },
        {
            'name': '⚡ Inverter Malfunction',
            'voltage': 20.1,
            'current': 7.3,
            'temperature': 42.0,
            'irradiance': 820.0,
            'power': 146.7
        },
        {
            'name': '🧹 Dusty Panel',
            'voltage': 30.8,
            'current': 6.9,
            'temperature': 29.0,
            'irradiance': 780.0,
            'power': 212.5
        }
    ]
    
    print(f"\n🔍 Testing {len(test_cases)} scenarios:")
    print("-" * 50)
    
    for i, case in enumerate(test_cases, 1):
        print(f"\n{i}. {case['name']}")
        print(f"   Input: V={case['voltage']}V, I={case['current']}A, "
              f"T={case['temperature']}°C, Irr={case['irradiance']}W/m², P={case['power']}W")
        
        result = predict_fault(
            case['voltage'], case['current'], case['temperature'],
            case['irradiance'], case['power']
        )
        
        if result:
            print(f"   🎯 Prediction: {result['predicted_fault']}")
            print(f"   📊 Confidence: {result['confidence']} ({result['confidence_score']:.3f})")
            print(f"   ⚠️  Severity: {result['severity']}")
            print(f"   💡 Recommendation: {result['maintenance_recommendation']}")
        else:
            print("   ❌ Prediction failed")
    
    print(f"\n{'='*50}")
    print("🎉 API demonstration completed!")
    print("\n📚 For more examples, check:")
    print("   - api/test_api.py (comprehensive test suite)")
    print("   - README.md (detailed documentation)")

if __name__ == "__main__":
    main()
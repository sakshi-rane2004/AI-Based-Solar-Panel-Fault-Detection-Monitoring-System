"""
Test script for the Solar Panel Fault Detection API.
"""
import requests
import json
from typing import Dict, Any

# API base URL
BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint."""
    print("Testing health check endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return False

def test_info_endpoint():
    """Test the info endpoint."""
    print("\nTesting info endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/info")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return False

def test_predict_endpoint():
    """Test the predict endpoint with various test cases."""
    print("\nTesting predict endpoint...")
    
    test_cases = [
        {
            'name': 'Normal Operation',
            'data': {
                'voltage': 32.5,
                'current': 8.2,
                'temperature': 25.0,
                'irradiance': 850.0,
                'power': 266.5
            }
        },
        {
            'name': 'Partial Shading',
            'data': {
                'voltage': 28.0,
                'current': 4.5,
                'temperature': 24.0,
                'irradiance': 600.0,
                'power': 126.0
            }
        },
        {
            'name': 'Inverter Fault',
            'data': {
                'voltage': 22.0,
                'current': 6.8,
                'temperature': 40.0,
                'irradiance': 800.0,
                'power': 149.6
            }
        }
    ]
    
    success_count = 0
    
    for test_case in test_cases:
        print(f"\n--- {test_case['name']} ---")
        try:
            response = requests.post(
                f"{BASE_URL}/predict",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Predicted Fault: {result['predicted_fault']}")
                print(f"Confidence: {result['confidence']} ({result['confidence_score']:.3f})")
                print(f"Severity: {result['severity']}")
                print(f"Description: {result['description']}")
                success_count += 1
            else:
                print(f"Error Response: {json.dumps(response.json(), indent=2)}")
                
        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")
    
    return success_count == len(test_cases)

def test_error_handling():
    """Test error handling with invalid inputs."""
    print("\nTesting error handling...")
    
    error_test_cases = [
        {
            'name': 'Missing fields',
            'data': {
                'voltage': 32.5,
                'current': 8.2
                # Missing temperature, irradiance, power
            }
        },
        {
            'name': 'Invalid data types',
            'data': {
                'voltage': 'invalid',
                'current': 8.2,
                'temperature': 25.0,
                'irradiance': 850.0,
                'power': 266.5
            }
        },
        {
            'name': 'Out of range values',
            'data': {
                'voltage': -50,  # Invalid negative voltage
                'current': 8.2,
                'temperature': 25.0,
                'irradiance': 850.0,
                'power': 266.5
            }
        }
    ]
    
    success_count = 0
    
    for test_case in error_test_cases:
        print(f"\n--- {test_case['name']} ---")
        try:
            response = requests.post(
                f"{BASE_URL}/predict",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 400:  # Expected error status
                result = response.json()
                print(f"Error Message: {result['message']}")
                success_count += 1
            else:
                print(f"Unexpected Response: {json.dumps(response.json(), indent=2)}")
                
        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")
    
    return success_count == len(error_test_cases)

def test_invalid_endpoints():
    """Test invalid endpoints."""
    print("\nTesting invalid endpoints...")
    
    try:
        # Test non-existent endpoint
        response = requests.get(f"{BASE_URL}/nonexistent")
        print(f"404 Test - Status Code: {response.status_code}")
        
        # Test wrong method
        response = requests.get(f"{BASE_URL}/predict")  # Should be POST
        print(f"405 Test - Status Code: {response.status_code}")
        
        return response.status_code in [404, 405]
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return False

def main():
    """Run all API tests."""
    print("Solar Panel Fault Detection API - Test Suite")
    print("=" * 50)
    
    # Check if server is running
    try:
        requests.get(f"{BASE_URL}/", timeout=5)
    except requests.exceptions.RequestException:
        print("❌ API server is not running!")
        print("Please start the server first: python api/app.py")
        return
    
    # Run tests
    tests = [
        ("Health Check", test_health_check),
        ("Info Endpoint", test_info_endpoint),
        ("Predict Endpoint", test_predict_endpoint),
        ("Error Handling", test_error_handling),
        ("Invalid Endpoints", test_invalid_endpoints)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        success = test_func()
        results.append((test_name, success))
        print(f"Result: {'✅ PASSED' if success else '❌ FAILED'}")
    
    # Summary
    print(f"\n{'='*50}")
    print("TEST SUMMARY")
    print(f"{'='*50}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed. Check the output above.")

if __name__ == "__main__":
    main()
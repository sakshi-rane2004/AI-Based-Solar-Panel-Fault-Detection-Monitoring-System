import React, { useState } from 'react';
import { authAPI } from '../services/api';

const AuthTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testRegistration = async () => {
    setLoading(true);
    setTestResult('Testing registration...');
    
    try {
      const userData = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'Test123!',
        role: 'VIEWER',
        firstName: 'Test',
        lastName: 'User'
      };
      
      console.log('Testing registration with:', userData);
      const response = await authAPI.register(userData);
      console.log('Registration test response:', response);
      setTestResult(`Registration successful! User: ${response.username}, Role: ${response.role}`);
    } catch (error) {
      console.error('Registration test error:', error);
      setTestResult(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setTestResult('Testing login...');
    
    try {
      const credentials = {
        username: 'admin',
        password: 'Admin123!'
      };
      
      console.log('Testing login with:', credentials);
      const response = await authAPI.login(credentials);
      console.log('Login test response:', response);
      setTestResult(`Login successful! User: ${response.username}, Role: ${response.role}`);
    } catch (error) {
      console.error('Login test error:', error);
      setTestResult(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Authentication Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testRegistration} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Registration
        </button>
        
        <button 
          onClick={testLogin} 
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Login
        </button>
      </div>
      
      {testResult && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: testResult.includes('failed') ? '#f8d7da' : '#d4edda',
          border: `1px solid ${testResult.includes('failed') ? '#f5c6cb' : '#c3e6cb'}`,
          borderRadius: '4px',
          color: testResult.includes('failed') ? '#721c24' : '#155724'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default AuthTest;
import React, { useState } from 'react';

const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'Admin123!'
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>API Test</h2>
      <button onClick={testLogin} disabled={loading}>
        {loading ? 'Testing...' : 'Test Login API'}
      </button>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        marginTop: '20px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {result}
      </pre>
    </div>
  );
};

export default ApiTest;
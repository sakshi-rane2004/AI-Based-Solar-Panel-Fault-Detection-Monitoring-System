import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'VIEWER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Check password strength when password changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) score += 20;
    else feedback.push('Use at least 8 characters');

    // Uppercase check
    if (/[A-Z]/.test(password)) score += 20;
    else feedback.push('Add uppercase letters');

    // Lowercase check
    if (/[a-z]/.test(password)) score += 20;
    else feedback.push('Add lowercase letters');

    // Number check
    if (/\d/.test(password)) score += 20;
    else feedback.push('Add numbers');

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    else feedback.push('Add special characters');

    let strength = 'Very Weak';
    let color = '#dc3545';

    if (score >= 80) {
      strength = 'Strong';
      color = '#28a745';
    } else if (score >= 60) {
      strength = 'Good';
      color = '#ffc107';
    } else if (score >= 40) {
      strength = 'Fair';
      color = '#fd7e14';
    } else if (score >= 20) {
      strength = 'Weak';
      color = '#dc3545';
    }

    setPasswordStrength({
      score,
      strength,
      color,
      feedback
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { confirmPassword, ...registrationData } = formData;
      console.log('Attempting registration with:', registrationData);
      const response = await register(registrationData);
      console.log('Registration successful:', response);
      navigate('/');
    } catch (err) {
      console.error('Registration error details:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Solar Panel Dashboard</h1>
          <h2>Create Account</h2>
          <p>Sign up to access the dashboard</p>
        </div>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                disabled={loading}
                autoComplete="given-name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                disabled={loading}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="VIEWER">Viewer</option>
            </select>
            <div className="form-help">
              <strong>Viewer:</strong> Read-only access to dashboard and basic features<br />
              <small>Note: Only Viewer accounts can be created through public registration. Contact an administrator for additional access levels.</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              required
              disabled={loading}
              autoComplete="new-password"
            />
            
            {passwordStrength && (
              <div className="password-strength">
                <div className="strength-header">
                  <span>Password Strength: </span>
                  <span style={{ color: passwordStrength.color, fontWeight: 'bold' }}>
                    {passwordStrength.strength}
                  </span>
                  <span className="strength-score">({passwordStrength.score}/100)</span>
                </div>
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{ 
                      width: `${passwordStrength.score}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="strength-feedback">
                    {passwordStrength.feedback.map((tip, index) => (
                      <div key={index} className="feedback-item">• {tip}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
              autoComplete="new-password"
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="password-mismatch">
                Passwords do not match
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
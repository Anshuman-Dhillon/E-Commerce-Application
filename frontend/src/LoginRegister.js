// src/LoginRegister.js
import React, { useState } from 'react';
import { fetchReportData } from './api';

function LoginRegister({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const data = await fetchReportData('/api/customers/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setMessage(`Login successful! Welcome, ${data.name}.`);
      onLoginSuccess(data);
    } catch (error) {
      setMessage(`Login failed: ${error.message || 'Invalid email or password.'}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!name.trim()) {
      setMessage('Please enter your name.');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchReportData('/api/customers/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      setMessage(`Registration successful! Welcome, ${data.name}. Logging you in...`);
      // Auto-login after successful registration
      setTimeout(() => {
        onLoginSuccess(data);
      }, 1000);
    } catch (error) {
      setMessage(`Registration failed: ${error.message || 'Please try again.'}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setMessage('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#282c34' }}>
        {isRegistering ? 'Create Account' : 'Customer Login'}
      </h2>
      <form style={formStyle} onSubmit={isRegistering ? handleRegister : handleLogin}>
        {isRegistering && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            required
            disabled={loading}
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
          disabled={loading}
        />
        <button 
          type="submit" 
          style={{ ...buttonStyle, backgroundColor: '#007bff' }}
          disabled={loading}
        >
          {loading ? 'Loading...' : isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
        </p>
        <button 
          onClick={toggleMode} 
          style={{ ...toggleButtonStyle }}
          disabled={loading}
        >
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </div>

      {message && (
        <p style={{ 
          marginTop: '15px', 
          color: message.includes('failed') ? 'red' : 'green',
          textAlign: 'center'
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

// Styles
const containerStyle = { 
  maxWidth: '400px', 
  margin: '50px auto', 
  padding: '20px', 
  border: '1px solid #ddd', 
  borderRadius: '8px', 
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};
const formStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '10px', 
  marginTop: '20px' 
};
const inputStyle = { 
  padding: '10px', 
  borderRadius: '4px', 
  border: '1px solid #ccc',
  fontSize: '14px'
};
const buttonStyle = { 
  padding: '10px', 
  borderRadius: '4px', 
  cursor: 'pointer', 
  color: 'white', 
  border: 'none', 
  fontWeight: 'bold',
  fontSize: '14px'
};
const toggleButtonStyle = {
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#007bff',
  border: '1px solid #007bff',
  backgroundColor: 'white',
  fontWeight: 'bold',
  fontSize: '14px'
};

export default LoginRegister;

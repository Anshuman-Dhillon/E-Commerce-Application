import React, { useState } from 'react';
import { fetchReportData } from './api';
import LoginBackground from './LoginBackground';

function LoginRegister({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('BUYER');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const data = await fetchReportData('http://localhost:8080/api/customers/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setMessage(`Login successful! Welcome, ${data.customer.name}.`);
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

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchReportData('http://localhost:8080/api/customers/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });

      setMessage(`Registration successful! Welcome, ${data.customer.name}. Logging you in...`);
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
    setRole('BUYER');
  };

  return (
    <>
      <LoginBackground />
      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={containerStyle}>
          <h2 style={{ textAlign: 'center', color: '#282c34', marginBottom: '10px' }}>
            {isRegistering ? 'Create Account' : '3D Model Marketplace'}
          </h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            {isRegistering ? 'Join as a buyer or creator' : 'Welcome back!'}
          </p>
          
          <form style={formStyle} onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  required
                  disabled={loading}
                />
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold' }}>
                    I want to:
                  </label>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <label style={radioLabelStyle}>
                      <input
                        type="radio"
                        value="BUYER"
                        checked={role === 'BUYER'}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={loading}
                        style={{ marginRight: '5px' }}
                      />
                      Buy 3D Models
                    </label>
                    <label style={radioLabelStyle}>
                      <input
                        type="radio"
                        value="CREATOR"
                        checked={role === 'CREATOR'}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={loading}
                        style={{ marginRight: '5px' }}
                      />
                      Sell My Models
                    </label>
                  </div>
                </div>
              </>
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
              placeholder="Password (min 8 characters)"
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
              textAlign: 'center',
              padding: '10px',
              backgroundColor: message.includes('failed') ? '#fee' : '#efe',
              borderRadius: '4px'
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

const containerStyle = { 
  maxWidth: '450px', 
  margin: 'auto',
  padding: '30px', 
  borderRadius: '16px', 
  // Glass-morphism key properties:
  backgroundColor: 'rgba(255, 255, 255, 0.25)', // Low opacity white
  backdropFilter: 'blur(15px)',                // Blurs the 3D scene behind it
  WebkitBackdropFilter: 'blur(15px)',          // Safari support
  border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle "shine" on the edge
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
};
const formStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '15px', 
  marginTop: '20px' 
};
const inputStyle = { 
  padding: '12px', 
  borderRadius: '6px', 
  border: '1px solid #ccc',
  fontSize: '14px'
};
const buttonStyle = { 
  padding: '12px', 
  borderRadius: '6px', 
  cursor: 'pointer', 
  color: 'white', 
  border: 'none', 
  fontWeight: 'bold',
  fontSize: '16px'
};
const toggleButtonStyle = {
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  color: '#007bff',
  border: '1px solid #007bff',
  backgroundColor: 'white',
  fontWeight: 'bold',
  fontSize: '14px'
};
const radioLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#333'
};

export default LoginRegister;
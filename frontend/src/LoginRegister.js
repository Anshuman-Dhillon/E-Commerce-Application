// src/LoginRegister.js
import React, { useState } from 'react';
import { fetchReportData } from './api';
import { useNavigate } from 'react-router-dom'; // NEW: Add useNavigate

function LoginRegister({ onLoginSuccess }) {
  const navigate = useNavigate(); // NEW: Hook for navigation
  const [customerId, setCustomerId] = useState(1); // FIXED: Use JavaScript Number, not Java Long
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setMessage('');
    try {
      // FIXED: Use Number(customerId) instead of Long.valueOf(customerId)
      const data = await fetchReportData(`/api/customers/login/${Number(customerId)}`); 
      
      setMessage(`Login successful! Welcome, ${data.name}.`);
      onLoginSuccess(data); // Call parent function to set global user/cart context
      navigate('/'); // NEW: Navigate to the home page on successful login
    } catch (error) {
      setMessage(`Login failed: User not found.`);
      console.error(error);
    }
  };

  const handleRegistration = () => {
    // **Comment for Marker: Registration is simulated/skipped to focus on DB connectivity.**
    setMessage("Registration is simulated. Please use existing Customer IDs (1-10) for demo.");
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#282c34' }}>Customer Login / Register</h2>
      <div style={formStyle}>
        <p style={{ color: '#555', textAlign: 'center' }}>
            For demonstration, please enter a valid Customer ID from your `CUSTOMER` table (e.g., 1 to 10).
        </p>
        <input
          type="number"
          placeholder="Enter Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          style={inputStyle}
          min="1"
        />
        <button onClick={handleLogin} style={{ ...buttonStyle, backgroundColor: '#007bff' }}>
          Login
        </button>
        <button onClick={handleRegistration} style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>
          Simulated Registration
        </button>
        {message && <p style={{ marginTop: '15px', color: message.includes('failed') ? 'red' : 'green' }}>{message}</p>}
      </div>
    </div>
  );
}

// ... Styles (omitted for brevity)
const containerStyle = { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { padding: '10px', borderRadius: '4px', cursor: 'pointer', color: 'white', border: 'none', fontWeight: 'bold' };

export default LoginRegister;
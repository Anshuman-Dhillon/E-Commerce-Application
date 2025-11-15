import React from 'react';
import { Link } from 'react-router-dom';

function Settings({ user }) {
  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Please log in to view your settings.</p>
        <Link to="/">Back to products</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: 'white' }}>
      <h2 style={{ marginTop: 0 }}>Account Settings</h2>
      <div style={{ marginTop: '10px', color: '#333' }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Customer ID:</strong> {user.customerId || user.id || 'N/A'}</p>
        <p><strong>Password:</strong> {'•'.repeat(8)}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{ color: '#0b63d6', textDecoration: 'none', fontWeight: 600 }}>Back to Products</Link>
      </div>
    </div>
  );
}

export default Settings;

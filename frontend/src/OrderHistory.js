import React, { useState, useEffect } from 'react';
import { fetchReportData } from './api';

// Just for demo we use Customer ID 1. 
const DEMO_CUSTOMER_ID = 1; 

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch transaction history
    fetchReportData(`/api/orders/history/${DEMO_CUSTOMER_ID}`)
      .then(data => {
        if (Array.isArray(data)) { 
            setOrders(data);
        } else {
            setOrders([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load order history:", err);
        setError("Failed to load order history. Check backend connection.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Order History...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>ERROR: {error}</div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#282c34' }}>Order History (Customer ID: {DEMO_CUSTOMER_ID})</h2>
      <p style={{ textAlign: 'center', color: '#555' }}>
        Demonstration of transactional history retrieval (essential feature).
      </p>

      {orders.length === 0 ? (
          <p style={emptyStyle}>No past orders found in the database.</p>
      ) : (
          <table style={tableStyle}>
              <thead>
                  <tr>
                      <th style={thStyle}>Order ID</th>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Amount</th>
                      <th style={thStyle}>Customer ID</th>
                  </tr>
              </thead>
              <tbody>
                  {orders.map((order, index) => (
                      <tr key={order.orderId} style={{backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'}}>
                          <td style={tdStyle}>{order.orderId}</td>
                          <td style={tdStyle}>{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td style={tdStyle}>{order.orderStatus}</td>
                          <td style={tdStyle}>${order.orderAmount.toFixed(2)}</td>
                          <td style={tdStyle}>{order.customerId}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      )}
    </div>
  );
}

const containerStyle = { padding: '20px', maxWidth: '1000px', margin: 'auto' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.9em', textAlign: 'left', marginTop: '20px' };
const thStyle = { backgroundColor: '#343a40', color: 'white', border: '1px solid #ddd', padding: '12px 8px', fontWeight: 'bold' };
const tdStyle = { border: '1px solid #ddd', padding: '8px' };
const emptyStyle = { textAlign: 'center', marginTop: '20px', padding: '20px', border: '1px dashed #ccc' };

export default OrderHistory;
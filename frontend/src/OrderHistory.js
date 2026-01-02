import React, { useState, useEffect } from 'react';
import { fetchReportData } from './api';

function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.customerId) return;
    
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("Authentication required. Please log in again.");
          setLoading(false);
          return;
        }

        const data = await fetchReportData(
          `http://localhost:8080/api/orders/history/${user.customerId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (Array.isArray(data)) { 
          setOrders(data);
        } else {
          setOrders([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load order history:", err);
        
        // Check if it's an auth error
        if (err.message.includes('403') || err.message.includes('401')) {
          setError("Authentication failed. Please log out and log in again with your updated account.");
        } else {
          setError("Failed to load order history. Please try again.");
        }
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Order History...</div>;
  
  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
        <div style={{ 
          color: '#dc3545', 
          backgroundColor: '#f8d7da', 
          padding: '20px', 
          borderRadius: '8px',
          maxWidth: '600px',
          margin: 'auto'
        }}>
          <h3>⚠️ {error}</h3>
          <p style={{ marginTop: '10px' }}>
            This might be because your account was created before the recent database updates.
          </p>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Log Out and Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#282c34' }}>Order History</h2>
      <p style={{ textAlign: 'center', color: '#555', marginBottom: '20px' }}>
        {user && user.name ? `${user.name}'s Orders` : 'Your Orders'}
      </p>

      {orders.length === 0 ? (
          <p style={emptyStyle}>No past orders found. Start shopping to see your orders here!</p>
      ) : (
          <table style={tableStyle}>
              <thead>
                  <tr>
                      <th style={thStyle}>Order ID</th>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Amount</th>
                  </tr>
              </thead>
              <tbody>
                  {orders.map((order, index) => (
                      <tr key={order.orderId} style={{backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'}}>
                          <td style={tdStyle}>{order.orderId}</td>
                          <td style={tdStyle}>{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td style={tdStyle}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              backgroundColor: order.orderStatus === 'Completed' ? '#d4edda' : '#fff3cd',
                              color: order.orderStatus === 'Completed' ? '#155724' : '#856404'
                            }}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td style={tdStyle}>${order.orderAmount.toFixed(2)}</td>
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
import React, { useState, useEffect } from 'react';
import { fetchReportData } from './api';

function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.customerId) return;
    fetchReportData(`/api/orders/history/${user.customerId}`)
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
  }, [user]);

  // Cancel an order (customer may only cancel their own order)
  const handleCancel = async (orderId) => {
    if (!user || !user.customerId) return;
    const confirmed = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/customer/${user.customerId}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      // remove from UI
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
    } catch (err) {
      console.error('Failed to cancel order:', err);
      setError('Failed to cancel order. ' + (err.message || ''));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Order History...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>ERROR: {error}</div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#282c34' }}>Order History (Customer ID: {user && user.customerId})</h2>
      <p style={{ textAlign: 'center', color: '#555' }}>
        Only your orders are shown below.
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
                    <th style={thStyle}>Actions</th>
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
                        <td style={tdStyle}>
                          {user && user.customerId === order.customerId ? (
                            <button onClick={() => handleCancel(order.orderId)} style={{padding: '6px 10px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Cancel</button>
                          ) : null}
                        </td>
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
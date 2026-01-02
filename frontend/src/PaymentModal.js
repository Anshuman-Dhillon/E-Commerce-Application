import React, { useState } from 'react';
import { fetchReportData } from './api';

function PaymentModal({ isOpen, onClose, amount, onPaymentSuccess }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    // Simple validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Invalid card number');
      setProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const result = await fetchReportData('/api/payments/process', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'USD',
          // include card digits or pm_ prefix so backend's simulated validator accepts it
          paymentMethodId: (cardNumber ? cardNumber.replace(/\s/g, '') : '') || ('pm_' + Date.now())
        })
      });

      if (result.status === 'succeeded') {
        onPaymentSuccess(result);
      } else {
        setError(result.message || 'Payment failed');
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '450px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Secure Payment</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>Total Amount:</span>
            <span style={{ fontSize: '20px', color: '#007bff', fontWeight: 'bold' }}>${amount.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handlePayment}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                if (val.replace(/\s/g, '').length <= 16) setCardNumber(val);
              }}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '16px'
              }}
              required
              disabled={processing}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                  setExpiry(val);
                }}
                maxLength="5"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
                required
                disabled={processing}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 3) setCvv(val);
                }}
                maxLength="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
                required
                disabled={processing}
              />
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee', color: 'red', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ fontSize: '12px', color: '#666', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔒</span>
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>

          <button
            type="submit"
            disabled={processing}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: processing ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: processing ? 'not-allowed' : 'pointer'
            }}
          >
            {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          </button>
        </form>

        <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
          <p>Test Mode: Use card 4242 4242 4242 4242</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
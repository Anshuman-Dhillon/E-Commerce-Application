import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchReportData } from './api';
import PaymentModal from './PaymentModal';

function ShoppingCart({ cartItems, setCartItems, user }) {
    const navigate = useNavigate();
    const [showPayment, setShowPayment] = useState(false);
    
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.13;
    const taxAmount = subtotal * taxRate;
    const orderTotal = subtotal + taxAmount;
    
    const handleCheckout = () => {
        if (!user || !user.customerId) {
            alert('You must be logged in to checkout.');
            return;
        }
        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        setShowPayment(true);
    };

    const handlePaymentSuccess = async (paymentResult) => {
        const orderPayload = {
            customerId: user.customerId,
            orderAmount: orderTotal,
            orderStatus: 'Processing',
            items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity }))
        };
        
        try {
            const token = localStorage.getItem('token');
            await fetchReportData('/api/orders', {
                method: 'POST',
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined
                },
                body: JSON.stringify(orderPayload),
            });

            setCartItems([]);
            setShowPayment(false);
            try { window.dispatchEvent(new Event('productsChanged')); } catch(e) {}
            alert(`Payment successful! Transaction ID: ${paymentResult.transactionId}`);
            navigate('/orders');
        } catch (err) {
            const msg = err && err.message ? err.message : 'Order creation failed. Please contact support.';
            alert(msg);
        }
    };

    return (
        <>
            <div style={containerStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Your Shopping Cart</h2>

                {cartItems.length === 0 ? (
                    <div style={emptyCartStyle}>
                        <p>Your cart is empty. <Link to="/" style={{ color: '#007bff' }}>Start shopping!</Link></p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                        <div style={cartListStyle}>
                            {cartItems.map(item => (
                                <div key={item.productId} style={cartItemStyle}>
                                    <div style={itemDetailsStyle}>
                                        <h4 style={{ margin: 0 }}>{item.productName}</h4>
                                        <p style={{ color: '#555' }}>{item.description.substring(0, 50)}...</p>
                                        <p>Qty: <strong>{item.quantity}</strong> | Price: ${item.price.toFixed(2)}</p>
                                    </div>
                                    <div style={itemTotalStyle}>
                                        <p style={{ fontWeight: 'bold' }}>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                                        <button 
                                            onClick={() => removeFromCart(item.productId)}
                                            style={removeButtonStyle}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={summaryStyle}>
                            <h3>Order Summary</h3>
                            <div style={summaryRowStyle}>
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div style={summaryRowStyle}>
                                <span>Tax ({taxRate * 100}%):</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                            <div style={{ ...summaryRowStyle, fontWeight: 'bold', fontSize: '1.2em', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                                <span>Order Total:</span>
                                <span>${orderTotal.toFixed(2)}</span>
                            </div>
                            <button style={checkoutButtonStyle} onClick={handleCheckout}>Proceed to Payment</button>
                        </div>
                    </div>
                )}
            </div>
            
            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                amount={orderTotal}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </>
    );
}

const containerStyle = { maxWidth: '1200px', margin: '50px auto', padding: '0 20px' };
const emptyCartStyle = { textAlign: 'center', padding: '50px', border: '1px dashed #ccc', borderRadius: '8px' };
const cartListStyle = { flex: 2, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '400px' };
const cartItemStyle = { display: 'flex', alignItems: 'center', border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: 'white' };
const itemDetailsStyle = { flexGrow: 1 };
const itemTotalStyle = { textAlign: 'right', minWidth: '150px' };
const removeButtonStyle = { 
    backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', 
    borderRadius: '4px', cursor: 'pointer', marginTop: '5px', fontSize: '0.9em'
};
const summaryStyle = { 
    flex: 1, backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', 
    border: '1px solid #ddd', alignSelf: 'flex-start'
};
const summaryRowStyle = { 
    display: 'flex', justifyContent: 'space-between', marginBottom: '10px' 
};
const checkoutButtonStyle = { 
    width: '100%', backgroundColor: '#28a745', color: 'white', padding: '15px', 
    border: 'none', borderRadius: '5px', marginTop: '20px', cursor: 'pointer',
    fontWeight: 'bold'
};

export default ShoppingCart;
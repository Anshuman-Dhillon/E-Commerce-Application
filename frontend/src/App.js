import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';
import OrderHistory from './OrderHistory';
import Settings from './Settings';
import LoginRegister from './LoginRegister';
import CreatorDashboard from './CreatorDashboard';
import Chatbot from './Chatbot';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleLoginSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.customer));
    setUser(data.customer);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartItems([]);
  };
  
  const isCreator = user && user.userRole === 'CREATOR';
  
  return (
    <Router>
      {/* CHATBOT ALWAYS VISIBLE - Even on login page */}
      <Chatbot />
      
      {user ? (
        <>
          <Navbar totalItems={totalItems} onLogout={handleLogout} user={user} />
          <div className="content">
            <Routes>
              {isCreator ? (
                <>
                  <Route path="/" element={<CreatorDashboard user={user} />} />
                  <Route path="/products" element={<ProductList addToCart={addToCart} cartItems={cartItems} setCartItems={setCartItems} user={user} />} />
                  <Route path="/orders" element={<OrderHistory user={user} />} />
                  <Route path="/settings" element={<Settings user={user} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<ProductList addToCart={addToCart} cartItems={cartItems} setCartItems={setCartItems} user={user} />} />
                  <Route path="/cart" element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems} user={user} />} />
                  <Route path="/orders" element={<OrderHistory user={user} />} />
                  <Route path="/settings" element={<Settings user={user} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<LoginRegister onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
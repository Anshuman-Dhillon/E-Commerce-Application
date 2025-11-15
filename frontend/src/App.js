import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart'; 
import OrderHistory from './OrderHistory';
import Settings from './Settings';
import LoginRegister from './LoginRegister';
import './App.css'; 

function App() {
  // State for the shopping cart items (shared across ProductList and ShoppingCart)
  const [cartItems, setCartItems] = useState([]);
  
  // State for the logged-in user
  const [user, setUser] = useState(null);

  // Function to add a product to the cart 
  const addToCart = (product) => {
    // Adding/updating items in the shopping cart
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.productId);

      if (existingItem) {
        // If product exists, increase quantity
        return prevItems.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If product is new, add it with quantity 1
        return [...prevItems, { 
            ...product, 
            quantity: 1,
            
        }];
      }
    });
  };

  // Calculate total items in the cart 
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
  };

  return (
    <Router>
      {user ? (
        <>
          {/* Show Navbar and app routes only when logged in */}
          <Navbar totalItems={totalItems} onLogout={handleLogout} user={user} /> 
          <div className="content">
            <Routes>
              {/* Main Products Page*/}
              <Route path="/" element={<ProductList addToCart={addToCart} user={user} />} />
              
              {/* Shopping Cart Page*/}
              <Route path="/cart" element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems} user={user} />} />

              {/* Orders/Transaction History Page */}
              <Route path="/orders" element={<OrderHistory user={user} />} />
              
              {/* Settings Page */}
              <Route path="/settings" element={<Settings user={user} />} />
              
              {/* Catch-all redirect to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      ) : (
        <>
          {/* Show login/register page when not logged in */}
          <Routes>
            <Route path="*" element={<LoginRegister onLoginSuccess={handleLoginSuccess} />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
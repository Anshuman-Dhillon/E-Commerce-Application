import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart'; 
import OrderHistory from './OrderHistory'; 
import './App.css'; 

function App() {
  // State for the shopping cart items (shared across ProductList and ShoppingCart)
  const [cartItems, setCartItems] = useState([]);

  // Function to add a product to the cart 
  const addToCart = (product) => {
    // Adding/updating items in the shopping cart.**
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

  return (
    <Router>
      {/* Pass totalItems count to Navbar */}
      <Navbar totalItems={totalItems} /> 
      <div className="content">
        <Routes>
          {/* Main Products Page*/}
          <Route path="/" element={<ProductList addToCart={addToCart} />} />
          
          {/* Shopping Cart Page*/}
          <Route path="/cart" element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />} />

          {/* Orders/Transaction History Page */}
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
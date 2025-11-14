import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products using native fetch API
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Handle case where data might be wrapped in an object
        const productsArray = Array.isArray(data) ? data : (data.content || []);
        setProducts(productsArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError(error.message);
        setProducts([]); // Set empty array on error
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  
  if (error) return <div style={{color: 'red', padding: '20px'}}>Error: {error}</div>;

  return (
    <div className="App">
      <h1>E-Commerce Store</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.productId} className="product-card">
            <h3>{product.productName}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <p className="stock">Stock: {product.stock}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
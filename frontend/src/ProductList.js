import React, { useState, useEffect } from 'react';
import { fetchReportData } from './api';

function ProductList({ addToCart }) { 
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData('/api/products')
      .then(data => {
        if (Array.isArray(data)) { 
            setProducts(data);
        } else {
            setProducts([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Products...</div>;
  if (!products || products.length === 0) return <div style={{ textAlign: 'center', marginTop: '50px' }}>No products found. Please ensure backend and database are running and populated.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Available Products</h2>
      <div style={productGridStyle}>
        {products.map(product => (
          <div key={product.productId} style={productCardStyle}>
            
            <h3 style={{ margin: '0 0 10px 0' }}>{product.productName}</h3>
            <p style={{ fontSize: '0.9em', color: '#555' }}>{product.description}</p>
            <p style={priceStyle}>${product.price ? product.price.toFixed(2) : 'N/A'}</p>
            <p style={{ color: product.stock < 10 ? 'red' : 'green', fontWeight: 'bold' }}>
                Stock: {product.stock}
            </p>
            <button 
                onClick={() => addToCart(product)} 
                style={buttonStyle}
            >
                Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// styles
const productGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
    maxWidth: '1200px',
    margin: '20px auto'
};

const productCardStyle = {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    textAlign: 'center'
};

const priceStyle = {
    fontWeight: 'bold',
    color: '#007bff'
};

const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
};

export default ProductList;

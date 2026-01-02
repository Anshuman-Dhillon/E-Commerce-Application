import React, { useState, useEffect } from 'react';
import { fetchReportData } from './api';
import ModelViewer from './ModelViewer';
import ProductViewer3D from './ProductViewer3D';
import SearchBar from './SearchBar';

function ProductList({ addToCart, user }) { 
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    fetchReportData('http://localhost:8080/api/products')
      .then(data => {
        if (Array.isArray(data)) { 
          setProducts(data);
          setFilteredProducts(data);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
      });
    
    const onProductsChanged = async () => {
      setLoading(true);
      try {
        const data = await fetchReportData('http://localhost:8080/api/products');
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (e) {
        console.error('Failed refreshing products:', e);
      } finally {
        setLoading(false);
      }
    };
    window.addEventListener('productsChanged', onProductsChanged);
    return () => window.removeEventListener('productsChanged', onProductsChanged);
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Products...</div>;
  if (!products || products.length === 0) return <div style={{ textAlign: 'center', marginTop: '50px' }}>No products found. Please ensure backend and database are running and populated.</div>;

  return (
    <div style={{ padding: '20px' }}>
      {user && user.name ? (
        <div style={{ textAlign: 'center', marginBottom: '12px', color: '#333' }}>
          <h3 style={{ margin: 0 }}>Welcome back, {user.name.split(' ')[0]}!</h3>
          <p style={{ margin: '6px 0 0 0', color: '#666' }}>Browse our collection of premium 3D models</p>
        </div>
      ) : (
        <h2 style={{ textAlign: 'center' }}>Premium 3D Model Store</h2>
      )}

      <SearchBar products={products} onFilteredProducts={setFilteredProducts} />

      {filteredProducts && filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
          <p>No products match your search. Try different keywords!</p>
        </div>
      ) : (
        <div style={productGridStyle}>
          {filteredProducts && filteredProducts.map(product => (
            <div key={product.productId} style={productCardStyle}>
              {/* 3D Viewer instead of static thumbnail */}
              {product.modelUrl ? (
                <ProductViewer3D 
                  modelUrl={product.modelUrl}
                  productName={product.productName}
                  height={200}
                  onClick={() => setSelectedModel(product)}
                />
              ) : (
                <div 
                  onClick={() => setSelectedModel(product)}
                  style={{ 
                    cursor: 'pointer', 
                    height: '200px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}
                >
                  🎨
                </div>
              )}
              
              <h3 style={{ margin: '10px 0' }}>{product.productName}</h3>
              <p style={{ fontSize: '0.9em', color: '#555', minHeight: '60px' }}>{product.description}</p>
              <p style={priceStyle}>${product.price ? product.price.toFixed(2) : 'N/A'}</p>
              <p style={{ color: product.stock < 10 ? 'red' : 'green', fontWeight: 'bold' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
              <button 
                onClick={() => {
                  if (typeof addToCart === 'function') {
                    addToCart(product);
                  } else {
                    alert('Please login to add items to your cart.');
                  }
                }} 
                style={{
                  ...buttonStyle,
                  backgroundColor: product.stock > 0 ? '#007bff' : '#ccc',
                  cursor: product.stock > 0 && typeof addToCart === 'function' ? 'pointer' : 'not-allowed'
                }}
                disabled={product.stock === 0 || typeof addToCart !== 'function'}
                title={typeof addToCart === 'function' ? '' : 'Login required to add to cart'}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Full 3D Model Modal */}
      {selectedModel && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>{selectedModel.productName}</h2>
              <button
                onClick={() => setSelectedModel(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#333'
                }}
              >
                ✕
              </button>
            </div>
            <ModelViewer 
              modelUrl={selectedModel.modelUrl} 
              productName={selectedModel.productName} 
            />
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '16px', color: '#666' }}>{selectedModel.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                  ${selectedModel.price.toFixed(2)}
                </span>
                <button
                  onClick={() => {
                    if (typeof addToCart === 'function') {
                      addToCart(selectedModel);
                      setSelectedModel(null);
                    } else {
                      alert('Please login to add items to your cart.');
                    }
                  }}
                  style={{
                    ...buttonStyle,
                    fontSize: '16px',
                    padding: '12px 30px'
                  }}
                  title={typeof addToCart === 'function' ? '' : 'Login required to add to cart'}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const productGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '25px',
  marginTop: '30px',
  maxWidth: '1400px',
  margin: '30px auto'
};

const productCardStyle = {
  border: '1px solid #ddd',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  backgroundColor: 'white',
  textAlign: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s'
};

const priceStyle = {
  fontWeight: 'bold',
  color: '#007bff',
  fontSize: '20px'
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '6px',
  cursor: 'pointer',
  marginTop: '10px',
  fontWeight: 'bold',
  transition: 'background-color 0.2s'
};

export default ProductList;
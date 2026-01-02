import React, { useState, useEffect, useCallback } from 'react';
import { fetchReportData, buildFileUrl } from './api';

function CreatorDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: 1,
    modelUrl: '',
    thumbnailUrl: ''
  });
  const [uploadStatus, setUploadStatus] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await fetchReportData(
        `http://localhost:8080/api/creators/${user.customerId}/products`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.customerId]);

  useEffect(() => {
    const customerId = user?.customerId;
    if (customerId) {
      loadProducts();
    }
  }, [user?.customerId, loadProducts]);

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'model' ? 'upload-model' : 'upload-thumbnail';
      
      const response = await fetch(
        `http://localhost:8080/api/creators/${user.customerId}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleModelFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadStatus('Uploading model...');
      try {
        const url = await handleFileUpload(file, 'model');
        setFormData({...formData, modelUrl: url});
        setUploadStatus('Model uploaded successfully!');
      } catch (error) {
        setUploadStatus('Model upload failed');
      }
    }
  };

  const handleThumbnailFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadStatus('Uploading thumbnail...');
      try {
        const url = await handleFileUpload(file, 'thumbnail');
        setFormData({...formData, thumbnailUrl: url});
        setUploadStatus('Thumbnail uploaded successfully!');
      } catch (error) {
        setUploadStatus('Thumbnail upload failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus('Creating product...');
    if (!user || user.userRole !== 'CREATOR') {
      setUploadStatus('Creator role required');
      alert(`Only users with Creator role can create products. Your role: ${user ? user.userRole : 'none'}`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetchReportData(
        `http://localhost:8080/api/creators/${user.customerId}/products`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      setUploadStatus('Product created successfully!');
      setShowUploadForm(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: 1,
        modelUrl: '',
        thumbnailUrl: ''
      });
      loadProducts();
    } catch (error) {
      setUploadStatus('Failed to create product: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading your products...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Creator Dashboard</h2>
          <p style={{ color: '#666', margin: '5px 0' }}>Manage your 3D model uploads</p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          {showUploadForm ? 'Cancel' : '+ Upload New Model'}
        </button>
      </div>

      {showUploadForm && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '2px dashed #007bff'
        }}>
          <h3>Upload New 3D Model</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Model Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={inputStyle}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{...inputStyle, minHeight: '100px'}}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <input
                type="number"
                placeholder="Price ($)"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={inputStyle}
                step="0.01"
                min="0"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                style={inputStyle}
                min="0"
                required
              />
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                style={inputStyle}
              >
                <option value="1">Electronics</option>
                <option value="2">Clothing</option>
                <option value="3">Home</option>
                <option value="4">Books</option>
                <option value="5">Sports</option>
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  3D Model File (.glb)
                </label>
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleModelFileChange}
                  style={inputStyle}
                />
                {formData.modelUrl && <p style={{ color: 'green', fontSize: '12px', marginTop: '5px' }}>✓ Uploaded</p>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                  style={inputStyle}
                />
                {formData.thumbnailUrl && <p style={{ color: 'green', fontSize: '12px', marginTop: '5px' }}>✓ Uploaded</p>}
              </div>
            </div>

            {uploadStatus && (
              <div style={{
                padding: '10px',
                backgroundColor: uploadStatus.includes('success') ? '#d4edda' : '#f8d7da',
                color: uploadStatus.includes('success') ? '#155724' : '#721c24',
                borderRadius: '4px'
              }}>
                {uploadStatus}
              </div>
            )}

            <button
              type="submit"
              disabled={!formData.modelUrl || !formData.thumbnailUrl}
              style={{
                padding: '12px',
                backgroundColor: formData.modelUrl && formData.thumbnailUrl ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: formData.modelUrl && formData.thumbnailUrl ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Create Product
            </button>
          </form>
        </div>
      )}

      <h3>Your Products ({products.length})</h3>
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          No products yet. Upload your first 3D model to get started!
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {products.map(product => (
            <div key={product.productId} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white'
            }}>
              {product.thumbnailUrl && (
                <img 
                  src={buildFileUrl(product.thumbnailUrl)} 
                  alt={product.productName}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
              <h4 style={{ margin: '10px 0' }}>{product.productName}</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>{product.description}</p>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>${product.price}</span>
                <span style={{ color: '#666' }}>Stock: {product.stock}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px'
};

export default CreatorDashboard;
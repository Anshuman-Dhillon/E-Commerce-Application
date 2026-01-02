import React, { useState, useEffect, useRef } from 'react';

function SearchBar({ products, onFilteredProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  const fuzzySearch = (term) => {
    if (!term || term.length < 2) return products;
    
    const termLower = term.toLowerCase();
    const scored = products.map(product => {
      const nameLower = product.productName.toLowerCase();
      const descLower = product.description.toLowerCase();
      
      let score = 0;
      
      if (nameLower.includes(termLower)) score += 100;
      if (descLower.includes(termLower)) score += 50;
      
      const nameDistance = levenshteinDistance(termLower, nameLower);
      if (nameDistance <= 3) score += (20 - nameDistance * 5);
      
      const words = termLower.split(' ');
      words.forEach(word => {
        if (nameLower.includes(word)) score += 30;
        if (descLower.includes(word)) score += 10;
      });
      
      return { product, score };
    });
    
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
  };

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = fuzzySearch(searchTerm);
      setSuggestions(results.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = fuzzySearch(searchTerm);
    onFilteredProducts(filtered);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.productName);
    onFilteredProducts([product]);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onFilteredProducts(products);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '100%', maxWidth: '700px', margin: '20px auto' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search 3D models by name, category, or description..."
            style={{
              width: '100%',
              padding: '14px 45px 14px 15px',
              fontSize: '16px',
              border: '2px solid #007bff',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#999',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          style={{
            padding: '14px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            whiteSpace: 'nowrap'
          }}
        >
          Search
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '2px solid #007bff',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          marginTop: '-8px'
        }}>
          {suggestions.map(product => (
            <div
              key={product.productId}
              onClick={() => handleSuggestionClick(product)}
              style={{
                padding: '12px 15px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              <div style={{ fontWeight: 'bold', color: '#333' }}>{product.productName}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                ${product.price.toFixed(2)} • {product.description.substring(0, 50)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
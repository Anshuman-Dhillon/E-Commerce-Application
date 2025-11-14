import React from 'react';
import { Link } from 'react-router-dom';

function CartButton({ itemCount }) {
    const cartStyle = { 
        color: 'white', textDecoration: 'none', fontSize: '1.1em', backgroundColor: '#61dafb',
        padding: '5px 15px', borderRadius: '5px', fontWeight: 'bold', position: 'relative'
    };
    const badgeStyle = { 
        position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'red',
        borderRadius: '50%', padding: '2px 7px', fontSize: '0.8em', lineHeight: '1'
    };

    return (
        <Link to="/cart" style={cartStyle}>
            🛒 Cart 
            {itemCount > 0 && <span style={badgeStyle}>{itemCount}</span>}
        </Link>
    );
}

// Navbar now has three main navigation links
function Navbar({ totalItems }) {
  return (
    <nav style={{ 
        backgroundColor: '#282c34', 
        padding: '10px 20px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <h2 style={{ color: 'white', marginRight: '30px' }}>E-Commerce DBMS</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
            <li style={{ marginRight: '20px' }}>
              <Link to="/" style={{ color: '#61dafb', textDecoration: 'none', fontSize: '1.1em' }}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/orders" style={{ color: '#61dafb', textDecoration: 'none', fontSize: '1.1em' }}>
                Orders History
              </Link>
            </li>
          </ul>
      </div>
      <CartButton itemCount={totalItems} /> 
    </nav>
  );
}

export default Navbar;
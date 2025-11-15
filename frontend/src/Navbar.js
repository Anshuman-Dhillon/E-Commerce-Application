import React from 'react';
import { Link } from 'react-router-dom';

function CartButton({ itemCount }) {
  const cartStyle = { 
    color: 'white', textDecoration: 'none', fontSize: '1.05em', backgroundColor: '#17a2b8',
    padding: '7px 14px', borderRadius: '6px', fontWeight: '600', position: 'relative'
  };
    const badgeStyle = { 
        position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'red',
        borderRadius: '50%', padding: '2px 7px', fontSize: '0.8em', lineHeight: '1'
    };

    return (
    <Link to="/cart" style={cartStyle}>
      Cart
            {itemCount > 0 && <span style={badgeStyle}>{itemCount}</span>}
        </Link>
    );
}

function LogoutButton({ onLogout }) {
    const logoutStyle = { 
        color: 'white', textDecoration: 'none', fontSize: '1.1em', backgroundColor: '#dc3545',
        padding: '5px 15px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer',
        border: 'none', marginLeft: '10px'
    };

    return (
        <button style={logoutStyle} onClick={onLogout}>
            Logout
        </button>
    );
}

// Navbar now has three main navigation links
function Navbar({ totalItems, onLogout, user }) {
  const linkStyle = { color: '#b8d7ffff', textDecoration: 'none', fontSize: '1.05em', fontFamily: 'Segoe UI, Roboto, Arial', fontWeight: 600 };
  const titleStyle = { color: 'white', marginRight: '24px', fontFamily: 'Segoe UI, Roboto, Arial' };

  const firstName = user && user.name ? user.name.split(' ')[0] : null;

  return (
    <nav style={{ 
        backgroundColor: '#282c34', 
        padding: '10px 20px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={titleStyle}>E-Commerce DBMS</h2>
            {firstName && <div style={{ color: '#dfe6ea', marginLeft: '12px', fontSize: '0.95em' }}>Hello, {firstName}</div>}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', marginLeft: '24px' }}>
            <li style={{ marginRight: '20px' }}>
              <Link to="/" style={linkStyle}>
                Products
              </Link>
            </li>
            <li style={{ marginRight: '20px' }}>
              <Link to="/orders" style={linkStyle}>
                Orders History
              </Link>
            </li>
            <li>
              <Link to="/settings" style={linkStyle}>
                Settings
              </Link>
            </li>
          </ul>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <CartButton itemCount={totalItems} />
          {onLogout && <LogoutButton onLogout={onLogout} />}
      </div>
    </nav>
  );
}

export default Navbar;
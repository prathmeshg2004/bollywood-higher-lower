import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'Admin123') {
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="screen bollywood-bg">
      <div className="glass-panel" style={{ maxWidth: '500px', padding: '3rem' }}>
        <h2 className="title-glow" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Admin Portal</h2>
        
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          
          {error && <p style={{ color: '#ff4081', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</p>}
          
          <button type="submit" className="btn btn-glamour" style={{ width: '100%' }}>Login</button>
        </form>
        
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#ccc' }}>
          <a href="/" style={{ color: '#ffcc00', textDecoration: 'none' }}>&larr; Back to Game</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

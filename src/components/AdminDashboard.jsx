import React from 'react';

const AdminDashboard = ({ movies, disabledMovies, toggleMovie }) => {
  return (
    <div className="screen bollywood-bg">
      <div className="admin-container">
        
        <div className="admin-header">
          <div>
            <h2 className="admin-title" style={{ marginBottom: '0.5rem' }}>Admin Dashboard</h2>
            <div style={{ color: '#ccc', fontSize: '1.1rem', fontWeight: '500' }}>
              <span style={{ marginRight: '1.5rem' }}>🎬 Total Movies: <strong style={{ color: '#fff' }}>{movies.length}</strong></span>
              <span>✅ Enabled Movies: <strong style={{ color: '#4caf50' }}>{movies.length - disabledMovies.length}</strong></span>
            </div>
          </div>
          <a href="/" className="btn btn-glamour" style={{ padding: '0.8rem 2rem', fontSize: '1rem', textDecoration: 'none' }}>
            &larr; Back to Game
          </a>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>SR</th>
                <th>Poster</th>
                <th>Movie Title</th>
                <th>IMDb Rating</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, index) => {
                const isDisabled = disabledMovies.includes(movie.id);
                return (
                  <tr key={movie.id} style={{ opacity: isDisabled ? 0.6 : 1 }}>
                    <td>{index + 1}</td>
                    <td>
                      <img src={movie.image} alt={movie.title} className="admin-poster-thumb" />
                    </td>
                    <td style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{movie.title}</td>
                    <td style={{ color: '#ffcc00', fontWeight: 'bold', fontSize: '1.2rem' }}>{movie.rating}</td>
                    <td>
                      <span style={{ 
                        color: isDisabled ? '#f44336' : '#4caf50', 
                        fontWeight: 'bold',
                        backgroundColor: isDisabled ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px'
                      }}>
                        {isDisabled ? 'Disabled' : 'Enabled'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`btn-toggle ${isDisabled ? 'btn-enabled' : 'btn-disabled'}`}
                        onClick={() => toggleMovie(movie.id)}
                      >
                        {isDisabled ? 'Enable' : 'Disable'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

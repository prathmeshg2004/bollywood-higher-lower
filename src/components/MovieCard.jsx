import React, { useState, useEffect } from 'react';

const CountUpRating = ({ targetRating }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1500; // 1500ms animation

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo function for smooth deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCurrent(easeProgress * targetRating);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(targetRating);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [targetRating]);

  return <span>{current.toFixed(1)}</span>;
};

const MovieCard = ({ movie, isGuessing, onGuess, revealedRating, previousMovieTitle }) => {
  return (
    <div className="movie-card">
      <div 
        className="movie-background" 
        style={{ backgroundImage: `url(${movie.image})` }}
      ></div>
      <img src={movie.image} alt={movie.title} className="movie-poster-contain" />
      <div className="card-overlay"></div>
      
      <div className="card-content">
        <h2 className="movie-title">"{movie.title}"</h2>
        <p className="quote">has an IMDb rating of</p>
        
        {isGuessing && !revealedRating ? (
          <>
            <div className="action-buttons">
              <button className="btn-higher" onClick={() => onGuess('higher')}>
                Higher ▲
              </button>
              <button className="btn-lower" onClick={() => onGuess('lower')}>
                Lower ▼
              </button>
            </div>
            <p className="quote">than "{previousMovieTitle}"</p>
          </>
        ) : (
          <>
            <div className="rating-display">
              {revealedRating ? <CountUpRating targetRating={revealedRating} /> : movie.rating.toFixed(1)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

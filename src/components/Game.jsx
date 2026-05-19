import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';

const Game = ({ onGameOver, score, setScore, highScore, activeMovies }) => {
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [revealedRating, setRevealedRating] = useState(null);
  const [moviePool, setMoviePool] = useState([]);
  const [guessResult, setGuessResult] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  
  // Initialize game
  useEffect(() => {
    if (!activeMovies || activeMovies.length < 2) return;
    const shuffled = [...activeMovies].sort(() => 0.5 - Math.random());
    setVisibleMovies([shuffled[0], shuffled[1]]);
    setMoviePool(shuffled.slice(2)); // Store the rest of the movies in the pool
  }, [activeMovies]);

  const handleGuess = (guess) => {
    setRevealedRating(visibleMovies[1].rating);
    
    // Wait for the 1500ms count-up animation to finish before showing the tick/cross
    setTimeout(() => {
      let isCorrect = false;
      if (guess === 'higher' && visibleMovies[1].rating >= visibleMovies[0].rating) isCorrect = true;
      if (guess === 'lower' && visibleMovies[1].rating <= visibleMovies[0].rating) isCorrect = true;
      
      setGuessResult(isCorrect ? 'correct' : 'wrong');
      
      // Give the user 1000ms to see the tick/cross before moving on
      if (isCorrect) {
        setTimeout(() => {
          // Prepare the next movie
          let nextPool = [...moviePool];
          let upcomingMovie;
          
          // Pick from the pool to avoid duplicates
          if (nextPool.length === 0) {
            // If the pool is empty, reshuffle all active movies except the one we just made current
            nextPool = [...activeMovies].filter(m => m.id !== visibleMovies[1].id).sort(() => 0.5 - Math.random());
            upcomingMovie = nextPool[0];
            nextPool = nextPool.slice(1);
          } else {
            upcomingMovie = nextPool[0];
            nextPool = nextPool.slice(1);
          }
          
          setMoviePool(nextPool);
          
          // Add 3rd movie to DOM
          setVisibleMovies([visibleMovies[0], visibleMovies[1], upcomingMovie]);
          
          // Small delay to ensure React renders the 3rd card before we trigger the CSS slide
          setTimeout(() => {
            setIsSliding(true);
            
            // Wait for slide animation (600ms) to finish
            setTimeout(() => {
              // Reset the track and remove the first card instantly
              setIsSliding(false);
              setVisibleMovies([visibleMovies[1], upcomingMovie]);
              setScore(score + 1);
              setRevealedRating(null);
              setGuessResult(null); // Reset badge
            }, 600);
            
          }, 50);

        }, 1000);
      } else {
        setTimeout(() => {
          onGameOver(score);
        }, 1000);
      }
    }, 1500); 
  };

  if (visibleMovies.length < 2) return null;

  return (
    <>
      <div className="high-score-area">High Score: {highScore}</div>
      <div className="score-area">Score: {score}</div>
      <div className="game-container">
        
        <div className={`slider-track ${isSliding ? 'sliding' : ''}`}>
          {visibleMovies.map((movie, index) => {
            const isSecond = index === 1;
            const isThird = index === 2;
            
            let isGuessing = false;
            let currentRevealedRating = null;
            
            if (isSecond) {
              isGuessing = true;
              currentRevealedRating = revealedRating;
            }
            if (isThird) {
              isGuessing = true;
              currentRevealedRating = null;
            }
            
            return (
              <MovieCard 
                key={movie.id}
                movie={movie} 
                isGuessing={isGuessing}
                onGuess={isSecond && !isSliding ? handleGuess : () => {}} 
                revealedRating={currentRevealedRating} 
                previousMovieTitle={index > 0 ? visibleMovies[index - 1].title : ''}
              />
            );
          })}
        </div>
        
        <div className={`vs-badge ${guessResult || ''}`}>
          {guessResult === 'correct' && '✓'}
          {guessResult === 'wrong' && '✗'}
          {!guessResult && 'VS'}
        </div>
        
      </div>
    </>
  );
};

export default Game;

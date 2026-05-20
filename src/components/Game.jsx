import React, { useState, useEffect, useMemo } from 'react';
import MovieCard from './MovieCard';
import { audioSynth } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

const Game = ({ onGameOver, score, setScore, highScore, activeMovies, isSoundOn }) => {
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [revealedRating, setRevealedRating] = useState(null);
  const [moviePool, setMoviePool] = useState([]);
  const [guessResult, setGuessResult] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [hasBeatenRecord, setHasBeatenRecord] = useState(false);
  
  // Clear toast after 7 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, [toastMessage]);
  // Compute next milestone motivation text
  const targetMotivation = useMemo(() => {
    if (highScore < 5) {
      return "Reach 5, be in the better half!";
    }
    if (highScore < 10) {
      return "Reach 10, join the top 10%!";
    }
    if (highScore < 20) {
      return "Reach 20, literally the top 1%!";
    }
    if (highScore < 50) {
      return "Reach 50 to become a Veteran!";
    }
    return `Reach ${highScore + 1} to set a new record!`;
  }, [highScore]);

  // Initialize game
  useEffect(() => {
    if (!activeMovies || activeMovies.length < 2) return;
    const shuffled = [...activeMovies].sort(() => 0.5 - Math.random());
    setVisibleMovies([shuffled[0], shuffled[1]]);
    setMoviePool(shuffled.slice(2)); // Store the rest of the movies in the pool
  }, [activeMovies]);

  // Preload the next 3 movie images in the background to eliminate loading delay
  useEffect(() => {
    if (!moviePool || moviePool.length === 0) return;
    const toPreload = moviePool.slice(0, 3);
    toPreload.forEach((movie) => {
      if (movie && movie.image) {
        const img = new Image();
        img.src = movie.image;
      }
    });
  }, [moviePool]);

  const handleGuess = (guess) => {
    setRevealedRating(visibleMovies[1].rating);
    
    // 1. Play buildup sound
    if (isSoundOn) {
      audioSynth.playBuildUp(1500);
    }

    // Wait for the 1500ms count-up animation to finish before showing the tick/cross
    setTimeout(() => {
      let isCorrect = false;
      if (guess === 'higher' && visibleMovies[1].rating >= visibleMovies[0].rating) isCorrect = true;
      if (guess === 'lower' && visibleMovies[1].rating <= visibleMovies[0].rating) isCorrect = true;
      
      setGuessResult(isCorrect ? 'correct' : 'wrong');
      
      // 2 & 3. Play success/failure sound
      if (isSoundOn) {
        if (isCorrect) {
          audioSynth.playCorrect();
        } else {
          audioSynth.playWrong();
        }
      }
      
      // Give the user 1000ms to see the tick/cross before moving on
      if (isCorrect) {
        const newScore = score + 1;

        // Confetti when user beats their own high score
        if (highScore > 0 && newScore > highScore && !hasBeatenRecord) {
          triggerConfetti();
          if (isSoundOn) {
            audioSynth.playConfetti();
          }
          setHasBeatenRecord(true);
        }

        // Milestone achievements toast messages
        if (newScore === 5) {
          setToastMessage("🏆 Better than 50% of players! Keep going!");
        } else if (newScore === 10) {
          setToastMessage("🎉 Top 10% Club! Next stop: Top 1%!");
        } else if (newScore === 20) {
          setToastMessage("👑 Bollywood Expert! Can you cross 50?");
        }

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
      {toastMessage && (
        <div className="milestone-toast">
          {toastMessage}
        </div>
      )}
      <div className="high-score-area">
        <span className="high-score-text">High Score: {highScore}</span>
        <span className="high-score-goal">{targetMotivation}</span>
      </div>
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

import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { movies } from './data/movies';
import './index.css';

function App() {
  const [gameState, setGameState] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin_login' : 'start';
  }); 
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('bollywoodHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [disabledMovies, setDisabledMovies] = useState(() => {
    const saved = localStorage.getItem('disabledMovies');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleMovie = (id) => {
    setDisabledMovies(prev => {
      let newDisabled;
      if (prev.includes(id)) {
        newDisabled = prev.filter(mId => mId !== id);
      } else {
        newDisabled = [...prev, id];
      }
      localStorage.setItem('disabledMovies', JSON.stringify(newDisabled));
      return newDisabled;
    });
  };

  const activeMovies = movies.filter(m => !disabledMovies.includes(m.id));

  const startGame = () => {
    setScore(0);
    setGameState('playing');
  };

  const gameOver = (finalScore) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('bollywoodHighScore', finalScore.toString());
    }
    setGameState('gameover');
  };

  return (
    <>
      <div className="app-container">
        {gameState === 'start' && (
          <div className="screen bollywood-bg">
            <div className="glass-panel">
              <h1 className="logo title-glow">
                Higher-Lower<br/>
                <span style={{fontSize: '0.55em', color: '#ffcc00', letterSpacing: '4px', textTransform: 'uppercase', display: 'block', marginTop: '10px'}}>Bollywood Edition</span>
              </h1>
              <p className="subtitle flirty-text" style={{marginTop: '1.5rem', marginBottom: '0.8rem', fontWeight: '600', fontSize: '1.7rem', color: '#ffcc00'}}>Which movie is higher rated?</p>
              <p className="subtitle flirty-text" style={{fontSize: '1.4rem'}}>Ready to test your filmi gyaan? 😉</p>
              <button className="btn btn-glamour" onClick={startGame}>Lights, Camera, Play! 🎬</button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <Game 
            onGameOver={gameOver} 
            score={score} 
            setScore={setScore} 
            highScore={highScore} 
            activeMovies={activeMovies}
          />
        )}

        {gameState === 'gameover' && (
          <div className="screen bollywood-bg">
            <div className="glass-panel">
              <h1 className="logo title-glow">Cut! It's a Wrap</h1>
              <p className="score-display">
                Box Office Score: <span className="score-number">{score}</span>
              </p>
              
              <div className="feedback-text">
                {score > 10 ? <p>Ooh la la! You're a true Bollywood superstar! 🌟😘</p> : 
                 score > 5 ? <p>Not bad, but picture abhi baaki hai mere dost... 😉</p> :
                 <p>Haye ram! You need to watch more movies. 💔</p>}
              </div>
              
              <button className="btn btn-glamour" style={{marginTop: '2rem'}} onClick={startGame}>Take Two 🎬</button>
            </div>
          </div>
        )}

        {gameState === 'admin_login' && (
          <AdminLogin onLogin={() => setGameState('admin_dashboard')} />
        )}

        {gameState === 'admin_dashboard' && (
          <AdminDashboard 
            movies={movies} 
            disabledMovies={disabledMovies} 
            toggleMovie={toggleMovie} 
          />
        )}
      </div>
    </>
  );
}

export default App;

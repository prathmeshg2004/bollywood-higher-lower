import React, { useState, useEffect, useMemo } from 'react';
import Game from './components/Game';
import { movies } from './data/movies';
import './index.css';

function App() {
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('bollywoodHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [disabledMovies, setDisabledMovies] = useState(() => {
    const saved = localStorage.getItem('disabledMovies');
    return saved ? JSON.parse(saved) : [];
  });

  const flipperPairs = [
    "Dangal vs PK",
    "Sholay vs Lagaan",
    "3 Idiots vs Swades",
    "Andhadhun vs Drishyam",
    "Bajrangi Bhaijaan vs Sultan"
  ];
  const [flipperIndex, setFlipperIndex] = useState(0);
  const [flipperFade, setFlipperFade] = useState(true);

  useEffect(() => {
    if (gameState !== 'start') return;
    
    const interval = setInterval(() => {
      setFlipperFade(false); 
      setTimeout(() => {
        setFlipperIndex((prev) => (prev + 1) % flipperPairs.length);
        setFlipperFade(true); 
      }, 500); 
    }, 3000); 
    
    return () => clearInterval(interval);
  }, [gameState]);

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

  const activeMovies = useMemo(() => {
    return movies.filter(m => !disabledMovies.includes(m.id));
  }, [disabledMovies]);
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
              <h1 className="logo title-glow" style={{ position: 'relative', display: 'inline-block' }}>
                <span className="float-arrow up">▲</span>
                Higher-Lower<br/>
                <span style={{fontSize: '0.55em', color: '#ffcc00', letterSpacing: '4px', textTransform: 'uppercase', display: 'block', marginTop: '10px'}}>Bollywood Edition</span>
                <span className="float-arrow down">▼</span>
              </h1>
              
              <p className="subtitle flirty-text" style={{marginTop: '2.5rem', marginBottom: '0.5rem', fontWeight: '500', fontSize: '1.4rem', color: '#ffcc00', textShadow: '0 2px 10px rgba(0,0,0,1)'}}>Which movie is higher rated on IMDB?</p>
              
              <div className="flipper-container" style={{ marginTop: '0', marginBottom: '0' }}>
                 <p className={`flipper-text ${flipperFade ? 'fade-in' : 'fade-out'}`}>{flipperPairs[flipperIndex]}</p>
              </div>
              
              <button className="btn btn-glamour" style={{marginTop: '1rem'}} onClick={startGame}>Guess Now 🎬</button>
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
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem', width: '100%' }}>
                <button className="btn btn-glamour" style={{ width: '100%', maxWidth: '350px' }} onClick={startGame}>Take Two 🎬</button>
                
                <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '350px' }}>
                  <button 
                    className="btn-small" 
                    style={{ flex: 1, fontSize: '0.85rem', background: 'linear-gradient(45deg, #25D366, #128C7E)', boxShadow: '0 5px 15px rgba(37, 211, 102, 0.3)' }} 
                    onClick={async () => {
                      const shareText = `🔥 I just scored ${score} on the Bollywood Higher-Lower Game! 🍿\nThink you know Bollywood better than me? I challenge you to beat my score! 👇`;
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: 'Bollywood Higher-Lower Challenge',
                            text: shareText,
                            url: window.location.href
                          });
                        } catch (err) {
                          console.log('Share cancelled', err);
                        }
                      } else {
                        navigator.clipboard.writeText(`${shareText}\nPlay here: ${window.location.href}`);
                        alert('Challenge copied to clipboard! Paste it to your friends.');
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                      </svg>
                      Challenge your Friends
                    </div>
                  </button>
                  
                  <button 
                    className="btn-small" 
                    style={{ flex: 1, fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                    onClick={() => setGameState('start')}
                  >
                    🏠 Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </>
  );
}

export default App;

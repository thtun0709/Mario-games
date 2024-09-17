import React, { useState, useEffect } from 'react';
import './App.css';

const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const MOVE_SPEED = 5;

function Cloud({ x, y }) {
  return (
    <div 
      className="cloud"
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    />
  );
}

function App() {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [playerVelocity, setPlayerVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [coinPos] = useState({ x: 300, y: 100 });
  const [clouds] = useState([
    { x: 100, y: 300 },
    { x: 300, y: 200 },
    { x: 500, y: 350 },
  ]);

  const platform = { x: 200, y: 100, width: 100, height: 20 };
  const groundHeight = 50;

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'a':
          setPlayerVelocity(v => ({ ...v, x: -MOVE_SPEED }));
          break;
        case 'd':
          setPlayerVelocity(v => ({ ...v, x: MOVE_SPEED }));
          break;
        case 'w':
          if (!isJumping) {
            setPlayerVelocity(v => ({ ...v, y: JUMP_FORCE }));
            setIsJumping(true);
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'd') {
        setPlayerVelocity(v => ({ ...v, x: 0 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isJumping]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayerPos(pos => {
        let newPos = {
          x: pos.x + playerVelocity.x,
          y: pos.y + playerVelocity.y
        };

        let newVelocity = { ...playerVelocity };

        // Ground collision
        if (newPos.y <= groundHeight) {
          newPos.y = groundHeight;
          newVelocity.y = 0;
          setIsJumping(false);
        } else {
          // Apply gravity only when in the air
          newVelocity.y += GRAVITY;
        }

        // Platform collision
        if (newPos.x < platform.x + platform.width &&
            newPos.x + 50 > platform.x &&
            newPos.y < platform.y + platform.height &&
            newPos.y + 50 > platform.y) {
          newPos.y = platform.y + platform.height;
          newVelocity.y = 0;
          setIsJumping(false);
        }

        // Coin collection
        if (Math.abs(newPos.x - coinPos.x) < 30 && Math.abs(newPos.y - coinPos.y) < 30) {
          setScore(s => s + 1);
        }

        setPlayerVelocity(newVelocity);
        return newPos;
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [playerVelocity, coinPos]);

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>
      {clouds.map((cloud, index) => (
        <Cloud key={index} x={cloud.x} y={cloud.y} />
      ))}
      <div 
        className="player"
        style={{ 
          left: `${playerPos.x}px`,
          bottom: `${playerPos.y}px`
        }}
      />
      <div 
        className="platform"
        style={{
          left: `${platform.x}px`,
          bottom: `${platform.y}px`,
          width: `${platform.width}px`,
          height: `${platform.height}px`
        }}
      />
      <div 
        className="coin"
        style={{
          left: `${coinPos.x}px`,
          bottom: `${coinPos.y}px`
        }}
      />
      <div className="ground" />
    </div>
  );
}

export default App;
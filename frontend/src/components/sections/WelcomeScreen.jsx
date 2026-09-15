import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';

export default function WelcomeScreen({ config, onStart }) {
  const typedRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [floatingHearts, setFloatingHearts] = useState([]);

  useEffect(() => {
    // Generate stars
    const newStars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      dur: 2 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setStars(newStars);

    // Generate floating hearts
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '🌹', '💫', '✨'];
    const newHearts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      char: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      left: Math.random() * 100,
      size: 0.8 + Math.random() * 1.5,
      dur: 6 + Math.random() * 8,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 80,
    }));
    setFloatingHearts(newHearts);

    // Typed.js
    const typed = new Typed(typedRef.current, {
      strings: [
        'Someone very special has a birthday today...',
        `That someone is you, ${config.hername || 'My Love'}...`,
        'This surprise was made just for you 💝',
      ],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 1800,
      loop: false,
      showCursor: true,
    });

    return () => typed.destroy();
  }, [config.hername]);

  return (
    <div id="welcome-screen">
      {/* Dynamic Stars */}
      <div className="welcome-stars" id="welcome-stars">
        {stars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              width: `${s.size}px`,
              height: `${s.size}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="welcome-moon"></div>

      {/* Dynamic Floating Hearts */}
      <div className="floating-hearts-bg" id="floating-hearts-bg">
        {floatingHearts.map((h) => (
          <div
            key={h.id}
            className="float-heart"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}rem`,
              animationDuration: `${h.dur}s`,
              animationDelay: `${h.delay}s`,
              ['--drift']: `${h.drift}px`,
            }}
          >
            {h.char}
          </div>
        ))}
      </div>

      <div className="welcome-content">
        <p className="welcome-subtitle" style={{ opacity: 1 }}>
          ✨ A Special Message For You ✨
        </p>
        <div className="welcome-typing-container">
          <div className="welcome-typed-text" id="welcome-big-text" style={{ opacity: 1 }}>
            Happy Birthday {config.hername || 'My Love'}! ❤️
          </div>
          <span ref={typedRef} id="typed-output"></span>
        </div>
        <button
          className="welcome-btn"
          id="start-btn"
          aria-label="Open your birthday surprise"
          onClick={onStart}
          style={{ opacity: 1, transform: 'translateY(0)', marginTop: '40px' }}
        >
          💝 Open Your Surprise 💝
        </button>
      </div>
    </div>
  );
}

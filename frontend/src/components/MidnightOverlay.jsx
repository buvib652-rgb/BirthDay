import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import CakeIcon from './icons/CakeIcon';
import HeartIcon from './icons/HeartIcon';
import SparkleIcon from './icons/SparkleIcon';

export default function MidnightOverlay({ isOpen, onClose, name = 'MY LOVE' }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    // Generate stars for the midnight overlay
    const newStars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      dur: 2 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setStars(newStars);

    // Launch confetti burst on midnight overlay open
    const launchConfetti = () => {
      const end = Date.now() + 3000;
      const colors = ['#c41e5a', '#ffd700', '#6a0dad', '#ff6b9d', '#dc143c'];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    };

    setTimeout(launchConfetti, 300);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div id="midnight-overlay" className="active" role="dialog" aria-modal="true" aria-labelledby="midnight-title">
      {/* Stars background */}
      <div id="midnight-overlay-stars" className="welcome-stars">
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

      <div className="midnight-text" id="midnight-title">
        <CakeIcon size="1.2em" style={{ marginRight: '8px' }} /> HAPPY BIRTHDAY {name.toUpperCase()} <HeartIcon size="1.2em" style={{ marginLeft: '8px' }} />
      </div>
      <div className="midnight-sub">
        <SparkleIcon size="1em" /> THIS MAGICAL DAY IS ALL YOURS <SparkleIcon size="1em" />
      </div>
      <button className="midnight-close-btn" id="midnight-close-btn" onClick={onClose}>
        Continue to Your Surprise <HeartIcon size="1.1em" style={{ marginLeft: '6px' }} />
      </button>
    </div>
  );
}


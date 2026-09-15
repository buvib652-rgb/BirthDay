import React, { useEffect, useState } from 'react';
import HeartIcon from '../icons/HeartIcon';
import LoveHeartsIcon from '../icons/LoveHeartsIcon';
import RoseIcon from '../icons/RoseIcon';
import SparkleIcon from '../icons/SparkleIcon';
import DynamicIcon from '../icons/DynamicIcon';

export default function EndingSection({ name = 'My Love' }) {
  const [stars, setStars] = useState([]);
  const [floatingHearts, setFloatingHearts] = useState([]);

  useEffect(() => {
    // Generate stars (same as WelcomeScreen)
    const newStars = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      dur: 2 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setStars(newStars);

    // Generate floating hearts
    const heartEmojis = ['heart', 'hearts', 'rose', 'sparkle'];
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      char: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      left: Math.random() * 100,
      size: 0.8 + Math.random() * 1.2,
      dur: 6 + Math.random() * 8,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 80,
    }));
    setFloatingHearts(newHearts);
  }, []);

  return (
    <section id="ending-section" className="section" data-section="ending" aria-label="Ending">
      {/* Dynamic Stars */}
      <div className="welcome-stars" id="ending-stars">
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

      {/* Dynamic Floating Hearts */}
      <div className="floating-hearts-bg" id="ending-hearts-bg">
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
            <DynamicIcon name={h.char} size="1em" />
          </div>
        ))}
      </div>

      <div className="ending-content" data-aos="fade-up">
        <div className="section-title" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', letterSpacing: '5px' }}>
          <SparkleIcon size="1.2em" /> The End <SparkleIcon size="1.2em" />
        </div>
        <div style={{ margin: '20px 0' }}>
          <HeartIcon size="5rem" animated />
        </div>
        <div className="ending-text">
          Happy Birthday, {name}<br />
          <span style={{ fontSize: '70%', opacity: 0.8 }}>May this year bring you all the joy you deserve</span>
        </div>
        <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '2rem' }}>
          <span style={{ animation: 'heartbeatInline 1s 0s ease-in-out infinite' }}><RoseIcon size="2rem" /></span>
          <span style={{ animation: 'heartbeatInline 1s 0.2s ease-in-out infinite' }}><LoveHeartsIcon size="2rem" /></span>
          <span style={{ animation: 'heartbeatInline 1s 0.4s ease-in-out infinite' }}><RoseIcon size="2rem" /></span>
          <span style={{ animation: 'heartbeatInline 1s 0.6s ease-in-out infinite' }}><LoveHeartsIcon size="2rem" /></span>
          <span style={{ animation: 'heartbeatInline 1s 0.8s ease-in-out infinite' }}><RoseIcon size="2rem" /></span>
        </div>
      </div>
    </section>
  );
}


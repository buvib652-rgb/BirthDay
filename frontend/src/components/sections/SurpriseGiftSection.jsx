import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function SurpriseGiftSection({ giftMessage = 'You are my greatest gift ✨\nHappy Birthday, My Love! 🎂' }) {
  const [opened, setOpened] = useState(false);

  const handleOpenGift = () => {
    if (opened) return;
    setOpened(true);

    // Confetti burst when gift is opened
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#c41e5a', '#ffd700', '#6a0dad', '#ff6b9d', '#dc143c', '#ffe55c'],
    });
  };

  return (
    <section id="surprise-gift" className="section" data-section="gift" aria-label="Surprise Gift">
      <h2 className="section-title" data-aos="fade-up">A Special Gift</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">Something wrapped with all my love 🎁</p>

      <div className="gift-container" data-aos="zoom-in" data-aos-delay="200" onClick={handleOpenGift}>
        <span
          className={`gift-box ${opened ? 'exploded' : ''}`}
          id="gift-box"
          role="button"
          tabIndex={0}
          aria-label="Click to open your gift"
          onKeyDown={(e) => e.key === 'Enter' && handleOpenGift()}
        >
          🎁
        </span>
        {!opened && <p className="gift-hint" id="gift-hint">~ tap to open your gift ~</p>}

        <div className={`gift-message ${opened ? 'show' : ''}`} id="gift-message">
          <div className="gift-message-text" style={{ whiteSpace: 'pre-line' }}>
            {giftMessage}
          </div>
        </div>
      </div>
    </section>
  );
}

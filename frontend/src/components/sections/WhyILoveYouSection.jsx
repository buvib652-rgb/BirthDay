import React, { useState } from 'react';

export default function WhyILoveYouSection({ reasons = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % reasons.length);
  };

  if (!reasons.length) return null;

  return (
    <section id="why-i-love-you" className="section" data-section="reasons" aria-label="Reasons I Love You">
      <h2 className="section-title" data-aos="fade-up">Why I Love You</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">Click to reveal each reason ✨</p>

      <div className="love-reasons-container" data-aos="zoom-in" data-aos-delay="200">
        <div className="love-reason-counter" id="love-reason-counter">
          {currentIndex + 1} / {reasons.length}
        </div>
        <div id="love-reason-cards">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className={`love-reason-card glass ${idx === currentIndex ? 'active' : ''}`}
              onClick={nextCard}
              style={{ display: idx === currentIndex ? 'flex' : 'none' }}
            >
              <div className="love-reason-number">#{idx + 1}</div>
              <div className="love-reason-icon">{reason.icon}</div>
              <div className="love-reason-text">{reason.text}</div>
            </div>
          ))}
        </div>
        <p className="love-reason-hint">tap the card to see the next reason ❤️</p>
      </div>
    </section>
  );
}

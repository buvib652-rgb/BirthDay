import React, { useState } from 'react';

export default function WhyILoveYouSection({ reasons = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [direction, setDirection] = useState('next');

  const nextCard = () => {
    if (isExiting || reasons.length <= 1) return;
    setDirection('next');
    setIsExiting(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % reasons.length);
      setIsExiting(false);
    }, 320);
  };

  const prevCard = (e) => {
    e.stopPropagation();
    if (isExiting || reasons.length <= 1) return;
    setDirection('prev');
    setIsExiting(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
      setIsExiting(false);
    }, 320);
  };

  if (!reasons.length) return null;

  const currentReason = reasons[currentIndex];

  return (
    <section id="why-i-love-you" className="section" data-section="reasons" aria-label="Reasons I Love You">
      <h2 className="section-title" data-aos="fade-up">Why I Love You</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">Click to reveal each reason ✨</p>

      <div className="love-reasons-container" data-aos="zoom-in" data-aos-delay="200">
        <div className="love-reason-counter">
          <span>{currentIndex + 1}</span> / {reasons.length}
        </div>

        <div className="love-reason-cards-wrapper">
          {/* Stacked background card effect */}
          <div className="love-reason-card-bg glass" aria-hidden="true" />

          {/* Active card with swipe + zoom-out animation */}
          <div
            key={currentIndex}
            className={`love-reason-card glass ${
              isExiting
                ? direction === 'next'
                  ? 'swipe-exit-next'
                  : 'swipe-exit-prev'
                : 'swipe-enter'
            }`}
            onClick={nextCard}
            role="button"
            tabIndex={0}
            aria-label={`Reason ${currentIndex + 1}: ${currentReason.text}`}
            onKeyDown={(e) => e.key === 'Enter' && nextCard()}
          >
            <div className="love-reason-number">#{currentIndex + 1}</div>
            <div className="love-reason-icon">{currentReason.icon}</div>
            <div className="love-reason-text">{currentReason.text}</div>
            <div className="love-reason-tap-badge">Tap card for next ✨</div>
          </div>
        </div>

        {/* Navigation Dots and Arrows */}
        <div className="love-reason-nav">
          <button className="love-reason-nav-btn" onClick={prevCard} aria-label="Previous reason">❮</button>
          <div className="love-reason-dots">
            {reasons.map((_, idx) => (
              <button
                key={idx}
                className={`love-reason-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (idx === currentIndex || isExiting) return;
                  setDirection(idx > currentIndex ? 'next' : 'prev');
                  setIsExiting(true);
                  setTimeout(() => {
                    setCurrentIndex(idx);
                    setIsExiting(false);
                  }, 320);
                }}
                aria-label={`Go to reason ${idx + 1}`}
              />
            ))}
          </div>
          <button className="love-reason-nav-btn" onClick={nextCard} aria-label="Next reason">❯</button>
        </div>

        <p className="love-reason-hint">tap the card to see the next reason ❤️</p>
      </div>
    </section>
  );
}

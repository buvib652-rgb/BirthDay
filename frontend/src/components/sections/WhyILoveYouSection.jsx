import React, { useState, useRef, useEffect } from 'react';

export default function WhyILoveYouSection({ reasons = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // 'visible' = card fully shown | 'leaving' = fading out | 'entering' = fading in
  const [phase, setPhase] = useState('visible');
  const nextIndexRef = useRef(0);
  const timerRef    = useRef(null);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const nextCard = () => {
    // Guard: ignore clicks while mid-transition
    if (phase !== 'visible') return;

    const next = (currentIndex + 1) % reasons.length;
    nextIndexRef.current = next;

    // Phase 1 – fade the current card out (180 ms)
    setPhase('leaving');

    timerRef.current = setTimeout(() => {
      // Swap to the new index while card is invisible
      setCurrentIndex(next);
      setPhase('entering');

      // Phase 2 – fade new card in (200 ms)
      timerRef.current = setTimeout(() => {
        setPhase('visible');
      }, 200);
    }, 180);
  };

  if (!reasons.length) return null;

  const reason = reasons[currentIndex];

  // Derive inline style from phase
  const cardStyle = (() => {
    if (phase === 'leaving')  return { opacity: 0, transform: 'scale(0.97) translateY(6px)' };
    if (phase === 'entering') return { opacity: 0, transform: 'scale(0.97) translateY(-4px)' };
    return { opacity: 1, transform: 'scale(1) translateY(0)' };
  })();

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
          {/*
            Single rendered card — we render only the active reason.
            Position/size stay identical to the original (position:absolute inset:0).
            The transition is driven by inline style + CSS transition on .love-reason-card-inner.
          */}
          <div
            className="love-reason-card glass active love-reason-card-inner"
            id="love-reason-active-card"
            onClick={nextCard}
            style={cardStyle}
            role="button"
            tabIndex={0}
            aria-label={`Reason ${currentIndex + 1} of ${reasons.length}: ${reason.text}`}
            onKeyDown={(e) => e.key === 'Enter' && nextCard()}
          >
            <div className="love-reason-number">#{currentIndex + 1}</div>
            <div className="love-reason-icon">{reason.icon}</div>
            <div className="love-reason-text">{reason.text}</div>
          </div>
        </div>

        <p className="love-reason-hint">tap the card to see the next reason ❤️</p>
      </div>
    </section>
  );
}

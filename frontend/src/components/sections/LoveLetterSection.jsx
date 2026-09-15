import React, { useState, useEffect, useRef } from 'react';

/* ── Pre-compute block scatter data (once at module load) ── */
const GRID = 5;
const BLOCKS = Array.from({ length: GRID * GRID }, (_, i) => {
  const row = Math.floor(i / GRID);
  const col = i % GRID;
  const cx  = (GRID - 1) / 2;
  const cy  = (GRID - 1) / 2;
  const jx  = (Math.random() - 0.5) * 80;
  const jy  = (Math.random() - 0.5) * 80;
  const tx  = Math.round((col - cx) * 220 + jx);
  const ty  = Math.round((row - cy) * 220 + jy);
  const rot = Math.round((Math.random() - 0.5) * 160);
  const dist  = Math.abs(col - cx) + Math.abs(row - cy);
  const delay = Math.round(dist * 80 + Math.random() * 80);
  return { i, tx, ty, rot, delay };
});




/* ── Helper to cleanly parse paragraphs & lines ── */
function getParagraphs(text) {
  if (!text) return [];
  const trimmed = text.trim();
  if (!trimmed) return [];
  // If text contains double newlines, split by paragraphs
  if (/\r?\n\s*\r?\n/.test(trimmed)) {
    return trimmed.split(/\r?\n\s*\r?\n/).map(p => p.trim()).filter(Boolean);
  }
  // Otherwise split by line breaks (Enter)
  return trimmed.split(/\r?\n/).map(p => p.trim()).filter(Boolean);
}

/*
  Phases:
  0 → closed
  1 → dark overlay + beating heart
  2 → blocks scatter
  3 → pink template letter
*/
export default function LoveLetterSection({ letterText = '', hername = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase]   = useState(0);
  const [displayedParagraphs, setDisplayedParagraphs] = useState([]);
  const scrollRef = useRef(null);

  const openLetter = () => {
    setIsOpen(true);
    setPhase(1);
    setTimeout(() => setPhase(2), 1500);
    setTimeout(() => setPhase(3), 2800);
    document.body.style.overflow = 'hidden';
  };

  const closeLetter = () => {
    setPhase(0);
    setTimeout(() => {
      setIsOpen(false);
      setDisplayedParagraphs([]);
      document.body.style.overflow = '';
    }, 500);
  };

  useEffect(() => {
    if (phase !== 3) return;
    let startTimer, charInterval, paraTimer;
    setDisplayedParagraphs([]);

    startTimer = setTimeout(() => {
      const parasList = getParagraphs(letterText);
      if (!parasList.length) return;
      let pIdx = 0;

      function typeNext() {
        if (pIdx >= parasList.length) return;
        const full = parasList[pIdx];
        let cIdx = 0;
        charInterval = setInterval(() => {
          cIdx++;
          setDisplayedParagraphs(prev => {
            const u = [...prev];
            u[pIdx] = full.slice(0, cIdx);
            return u;
          });
          if (cIdx >= full.length) {
            clearInterval(charInterval);
            pIdx++;
            paraTimer = setTimeout(typeNext, 350);
          }
        }, 22);
      }
      typeNext();
    }, 500);

    return () => {
      clearTimeout(startTimer);
      clearInterval(charInterval);
      clearTimeout(paraTimer);
    };
  }, [phase, letterText]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [displayedParagraphs]);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') closeLetter(); };
    if (isOpen) window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen]);

  const paras       = getParagraphs(letterText);
  const stillTyping = displayedParagraphs.length < paras.length;

  return (
    <>
      {/* ── Section: envelope ── */}
      <section id="love-letter" className="section" data-section="letter" aria-label="Love Letter">
        <h2 className="section-title" data-aos="fade-up">A Letter From My Heart</h2>
        <div className="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">
          Click the envelope to read your letter 💌
        </p>
        <div
          className="envelope-container"
          data-aos="zoom-in"
          data-aos-delay="200"
          id="envelope-container"
          role="button"
          tabIndex={0}
          aria-label="Open your love letter"
          onClick={openLetter}
          onKeyDown={(e) => e.key === 'Enter' && openLetter()}
          style={{ cursor: 'pointer' }}
        >
          <div className="envelope" id="envelope">
            <div className="envelope-body"></div>
            <div className="envelope-flap"></div>
            <div className="envelope-left"></div>
            <div className="envelope-right"></div>
            <div className="envelope-seal">💝</div>
          </div>
        </div>
        <p className="envelope-hint" id="envelope-hint">~ tap to open ~</p>
      </section>

      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className={`rl-overlay ${phase >= 1 ? 'rl-overlay--in' : ''}`}
          onClick={(e) => e.target === e.currentTarget && closeLetter()}
          role="dialog" aria-modal="true" aria-label="Love Letter"
        >

          {/* PHASE 1: beating heart */}
          {phase === 1 && (
            <div className="hl-scene" aria-hidden="true">
              <div className="hl-emoji">❤️</div>
              <div className="hl-glow" />
            </div>
          )}

          {/* PHASE 2: block scatter */}
          {phase === 2 && (
            <div className="hl-scene" aria-hidden="true">
              <div className="hl-blocks">
                {BLOCKS.map(({ i, tx, ty, rot, delay }) => (
                  <div key={i} className="hl-block" style={{
                    '--tx': `${tx}px`, '--ty': `${ty}px`,
                    '--rot': `${rot}deg`, '--delay': `${delay}ms`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* PHASE 3: pink letter template */}
          {phase === 3 && (
            <>
              {/* white letter card */}
              <div className="lt-card">

                {/* 3D paper hearts + "love" at top */}
                <div className="lt-header" aria-hidden="true">
                  <div className="lt-hearts-row">
                    <div className="lt-heart lt-heart--sm lt-heart--back" />
                    <div className="lt-heart lt-heart--lg lt-heart--front" />
                    <div className="lt-heart lt-heart--md lt-heart--mid" />
                  </div>
                  <div className="lt-love-text">love</div>
                </div>

                {/* close button */}
                <button className="lt-close" onClick={closeLetter} aria-label="Close">✕</button>

                {/* scrollable letter body */}
                <div className="lt-scroll" ref={scrollRef}>
                  <p className="lt-salutation">My Dearest Love,</p>

                  <div className="lt-body">
                    {displayedParagraphs.map((para, idx) => (
                      <p key={idx}>
                        {para}
                        {stillTyping && idx === displayedParagraphs.length - 1 && (
                          <span className="lt-cursor">|</span>
                        )}
                      </p>
                    ))}
                    {stillTyping && displayedParagraphs.length === 0 && (
                      <span className="lt-cursor">|</span>
                    )}
                  </div>

                  {!stillTyping && displayedParagraphs.length > 0 && (
                    <div className="lt-closing">
                      <span className="lt-closing-line">Love you a lot,</span>
                      <span className="lt-signature">{hername || 'Forever Yours ❤️'}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      )}
    </>
  );
}

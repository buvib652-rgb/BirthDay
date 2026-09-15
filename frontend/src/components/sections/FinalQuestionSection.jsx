import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';

/* ─── tiny inline sparkle component ─── */
function Sparkle({ style }) {
  return (
    <span className="fq-sparkle" style={style} aria-hidden="true">
      ✨
    </span>
  );
}

export default function FinalQuestionSection() {
  const [answered, setAnswered]   = useState(false);
  const [phase, setPhase]         = useState(0); // 0=idle 1=burst 2=ring 3=text
  const [noPos, setNoPos]         = useState({ top: null, left: null });
  const [hearts, setHearts]       = useState([]);
  const [sparkles, setSparkles]   = useState([]);
  const canvasRef                 = useRef(null);
  const animRef                   = useRef(null);
  const confettiTimerRef          = useRef(null);

  /* ── move the "No" button away ── */
  const moveNoButton = () => {
    const maxX = Math.min(220, window.innerWidth  / 4);
    const maxY = Math.min(180, window.innerHeight / 5);
    setNoPos({
      top:  `${Math.floor(Math.random() * maxY * 2) - maxY}px`,
      left: `${Math.floor(Math.random() * maxX * 2) - maxX}px`,
    });
  };

  /* ── generate sparkle positions ── */
  const makeSparkles = useCallback(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      top:   `${Math.random() * 90}%`,
      left:  `${Math.random() * 90}%`,
      delay: `${(Math.random() * 2).toFixed(2)}s`,
      size:  `${1 + Math.random() * 1.5}rem`,
    }));
  }, []);

  /* ── generate floating heart objects ── */
  const makeHearts = useCallback(() => {
    const emojis = ['❤️','💕','💖','💗','💝','💓','🌹'];
    return Array.from({ length: 28 }, (_, i) => ({
      id:    i,
      char:  emojis[i % emojis.length],
      left:  `${5 + Math.random() * 90}%`,
      size:  `${1.2 + Math.random() * 2}rem`,
      dur:   `${5 + Math.random() * 6}s`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
      drift: `${(Math.random() - 0.5) * 120}px`,
    }));
  }, []);

  /* ── confetti cannon ── */
  const launchConfetti = useCallback(() => {
    const colors = ['#c41e5a','#ffd700','#6a0dad','#ff6b9d','#dc143c','#ffe55c','#ffffff'];

    // big initial burst
    confetti({ particleCount: 180, spread: 160, origin: { y: 0.5 }, colors, startVelocity: 55 });

    // side cannons loop
    const end = Date.now() + 5000;
    const frame = () => {
      confetti({ particleCount: 7, angle: 60,  spread: 70, origin: { x: 0, y: 0.65 }, colors });
      confetti({ particleCount: 7, angle: 120, spread: 70, origin: { x: 1, y: 0.65 }, colors });
      if (Date.now() < end) confettiTimerRef.current = requestAnimationFrame(frame);
    };
    confettiTimerRef.current = requestAnimationFrame(frame);
  }, []);

  /* ── handle YES click ── */
  const handleYes = () => {
    if (answered) return;
    setAnswered(true);
    setPhase(1);

    // stagger phases
    launchConfetti();
    setHearts(makeHearts());
    setSparkles(makeSparkles());
    setTimeout(() => setPhase(2), 200);   // text reveals smoothly
  };

  /* cleanup on unmount */
  useEffect(() => {
    return () => {
      if (confettiTimerRef.current) cancelAnimationFrame(confettiTimerRef.current);
      if (animRef.current)          cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <section
      id="final-question"
      className="section"
      data-section="question"
      aria-label="Final Question"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* ══════════════ CELEBRATION BACKGROUND EFFECTS ══════════════ */}
      {answered && (
        <div className={`fq-celebration ${phase >= 1 ? 'fq-celebration--active' : ''}`} aria-live="polite">

          {/* floating heart rain */}
          <div className="fq-hearts-bg" aria-hidden="true">
            {hearts.map(h => (
              <span
                key={h.id}
                className="fq-float-heart"
                style={{
                  left:               h.left,
                  fontSize:           h.size,
                  animationDuration:  h.dur,
                  animationDelay:     h.delay,
                  '--fq-drift':       h.drift,
                }}
              >
                {h.char}
              </span>
            ))}
          </div>

          {/* sparkles scattered */}
          <div className="fq-sparkles-bg" aria-hidden="true">
            {sparkles.map(s => (
              <Sparkle
                key={s.id}
                style={{
                  top:             s.top,
                  left:            s.left,
                  fontSize:        s.size,
                  animationDelay:  s.delay,
                }}
              />
            ))}
          </div>

          {/* hidden canvas ref (canvas-confetti uses its own canvas) */}
          <canvas ref={canvasRef} className="fq-canvas" aria-hidden="true" />
        </div>
      )}

      {/* ── QUESTION + CELEBRATION CONTENT AREA ── */}
      <div
        data-aos="fade-up"
        className="fq-content-wrap"
        style={{ textAlign: 'center', width: '100%', padding: '20px', position: 'relative', zIndex: 2 }}
      >
        <div className="question-text">Will you stay with me forever?</div>
        <p className="question-subtitle">~ This is the only question that matters ~</p>

        {!answered ? (
          <div className="question-buttons" id="question-buttons">
            <button
              className="btn-yes"
              id="btn-yes"
              aria-label="Yes, I will stay with you forever"
              onClick={handleYes}
            >
              YES ❤️
            </button>
            <button
              className="btn-no"
              id="btn-no"
              aria-label="No (try to click it!)"
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              style={{
                top:      noPos.top  ?? 'auto',
                left:     noPos.left ?? 'auto',
                position: noPos.top  ? 'absolute' : 'relative',
              }}
            >
              Maybe... 😅
            </button>
          </div>
        ) : (
          /* ── "I knew it!" text block positioned cleanly below question ── */
          <div className={`fq-text-block ${phase >= 2 ? 'fq-text-block--show' : ''}`}>
            <div className="fq-line1">I knew it!</div>
            <div className="fq-line2">Together Forever!</div>
            <div className="fq-line3">❤️</div>
            <div className="fq-tagline">Always &amp; forever yours ✨</div>
          </div>
        )}
      </div>
    </section>
  );
}

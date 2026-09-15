import React, { useEffect, useRef, useState } from 'react';
import HeartIcon from '../icons/HeartIcon';
import LoveHeartsIcon from '../icons/LoveHeartsIcon';
import InfinityIcon from '../icons/InfinityIcon';

/* ── Staged loading sequence ────────────────────────────────────────────── */
const STAGES = [
  { value: 10,  delay: 0   },  // immediate start when section enters viewport
  { value: 30,  delay: 600 },
  { value: 50,  delay: 600 },
  { value: 80,  delay: 600 },
  { value: 100, delay: 600 },
];
const INFINITY_DELAY = 700;

export default function LoveMeterSection() {
  const [phase, setPhase]           = useState('idle');
  const [percent, setPercent]       = useState(0);
  const [displayVal, setDisplayVal] = useState('');
  const [showLabel, setShowLabel]   = useState(false);
  const [visible, setVisible]       = useState(false);

  const sectionRef  = useRef(null);
  const hasAnimated = useRef(false);
  const timers      = useRef([]);

  /* ── helper: register a clearable timeout ──────────────────────────── */
  const addTimer = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  /* ── staged loading sequence ────────────────────────────────────────── */
  const runSequence = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    setPhase('loading'); // mount the display div

    let accumulated = 0;
    STAGES.forEach(({ value, delay }, index) => {
      accumulated += delay;

      addTimer(() => {
        if (index === 0) {
          // First step: show immediately on entry
          setPercent(value);
          setDisplayVal(`${value}%`);
          setVisible(true);
        } else {
          // Subsequent steps: crossfade to next value
          setVisible(false);
          addTimer(() => {
            setPercent(value);
            setDisplayVal(`${value}%`);
            setVisible(true);

            // After last stage (100%), schedule ∞
            if (index === STAGES.length - 1) {
              addTimer(() => {
                setVisible(false);
                addTimer(() => {
                  setPhase('infinity');
                  setDisplayVal('∞');
                  setVisible(true);
                  addTimer(() => setShowLabel(true), 350);
                }, 200);
              }, INFINITY_DELAY);
            }
          }, 140); // crossfade gap
        }
      }, accumulated);
    });
  };

  /* ── Viewport IntersectionObserver trigger ───────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            runSequence();
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px',
      }
    );

    observer.observe(section);

    // Fallback check on mount if already in viewport
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom > 0) {
      runSequence();
      observer.disconnect();
    }

    return () => {
      observer.disconnect();
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── computed styles for animated display value ─────────────────────── */
  const displayStyle = {
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    opacity:   visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0.88)',
    display:   'block',
    ...(phase === 'infinity' && {
      fontSize: 'clamp(4rem, 14vw, 8rem)',
      filter:
        'drop-shadow(0 0 28px rgba(255,100,150,0.85)) ' +
        'drop-shadow(0 0 55px rgba(196,30,90,0.55))',
    }),
  };

  return (
    <section
      id="love-meter"
      className="section"
      data-section="meter"
      aria-label="Love Meter"
      ref={sectionRef}
    >
      <h2 className="section-title" data-aos="fade-up">Love Meter</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="50"></div>
      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="50">
        Calculating how much I love you... <LoveHeartsIcon size="1.2em" />
      </p>

      <div className="love-meter-container" data-aos="zoom-in" data-aos-delay="50">

        {/* Percent / ∞ — hidden during idle */}
        {phase !== 'idle' && (
          <div
            className="love-meter-percent"
            id="love-meter-percent"
            style={displayStyle}
            aria-live="polite"
          >
            {displayVal === '∞' ? <InfinityIcon size="1.2em" /> : displayVal}
          </div>
        )}

        {/* Progress bar — only during loading */}
        {phase === 'loading' && (
          <div
            className="love-meter-bar-wrap"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="love-meter-bar"
              id="love-meter-bar"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        )}

        {/* "Infinite Love Loaded" label */}
        <div
          className={`love-meter-label ${showLabel ? 'show' : ''}`}
          id="love-meter-label"
        >
          <HeartIcon size="1em" style={{ marginRight: '6px' }} /> Infinite Love Loaded <HeartIcon size="1em" style={{ marginLeft: '6px' }} />
        </div>
      </div>
    </section>
  );
}


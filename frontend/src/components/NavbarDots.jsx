import React, { useEffect, useState, useRef, useCallback } from 'react';

const SECTION_IDS = [
  { id: 'countdown-section', label: 'Countdown' },
  { id: 'our-story',         label: 'Our Story' },
  { id: 'photo-gallery',     label: 'Gallery' },
  { id: 'video-section',     label: 'Video' },
  { id: 'love-letter',       label: 'Letter' },
  { id: 'why-i-love-you',    label: 'Reasons' },
  { id: 'love-counter',      label: 'Counter' },
  { id: 'love-meter',        label: 'Love Meter' },
  { id: 'heart-rain-section',label: 'Heart Rain' },
  { id: 'surprise-gift',     label: 'Gift' },
  { id: 'final-message',     label: 'Final Message' },
  { id: 'final-question',    label: 'Question' },
  { id: 'ending-section',    label: 'Ending' },
  { id: 'reply-section',     label: 'Reply' },
];

export default function NavbarDots() {
  const [activeIndex, setActiveIndex] = useState(0);
  // Cache of { top, bottom } for each section — rebuilt on resize only
  const positionsRef = useRef([]);
  const rafRef       = useRef(null);
  const lastScrollY  = useRef(-1);

  // Rebuild section position cache (called on mount + resize, NOT on scroll)
  const rebuildPositions = useCallback(() => {
    positionsRef.current = SECTION_IDS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return { top: 0, bottom: 0 };
      const top = el.offsetTop;
      return { top, bottom: top + el.offsetHeight };
    });
  }, []);

  useEffect(() => {
    // Build once after a brief delay (sections may not be laid out instantly)
    const buildTimer = setTimeout(rebuildPositions, 300);

    // Rebuild on resize — debounced
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(rebuildPositions, 200);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Scroll handler: read scrollY, then schedule a RAF to do the DOM check
    // This decouples scroll events (can fire 60-120/s) from actual work
    const onScroll = () => {
      lastScrollY.current = window.scrollY;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          const pos    = positionsRef.current;
          const target = lastScrollY.current + window.innerHeight / 3;
          let found    = 0;
          for (let i = 0; i < pos.length; i++) {
            if (target >= pos[i].top && target < pos[i].bottom) {
              found = i;
              break;
            }
          }
          setActiveIndex(found);
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(buildTimer);
      clearTimeout(resizeTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll',  onScroll);
      window.removeEventListener('resize',  onResize);
    };
  }, [rebuildPositions]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav id="nav-dots" aria-label="Section navigation">
      {SECTION_IDS.map((sec, idx) => (
        <div
          key={sec.id}
          className={`nav-dot ${idx === activeIndex ? 'active' : ''}`}
          onClick={() => scrollToSection(sec.id)}
          title={sec.label}
        />
      ))}
    </nav>
  );
}

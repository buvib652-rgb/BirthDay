import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'countdown-section', label: 'Countdown' },
  { id: 'our-story', label: 'Our Story' },
  { id: 'photo-gallery', label: 'Gallery' },
  { id: 'video-section', label: 'Video' },
  { id: 'love-letter', label: 'Letter' },
  { id: 'why-i-love-you', label: 'Reasons' },
  { id: 'love-counter', label: 'Counter' },
  { id: 'love-meter', label: 'Love Meter' },
  { id: 'heart-rain-section', label: 'Heart Rain' },
  { id: 'surprise-gift', label: 'Gift' },
  { id: 'final-message', label: 'Final Message' },
  { id: 'final-question', label: 'Question' },
  { id: 'ending-section', label: 'Ending' },
  { id: 'reply-section', label: 'Reply' },
];

export default function NavbarDots() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      SECTIONS.forEach((sec, idx) => {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveIndex(idx);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav id="nav-dots" aria-label="Section navigation">
      {SECTIONS.map((sec, idx) => (
        <div
          key={sec.id}
          className={`nav-dot ${idx === activeIndex ? 'active' : ''}`}
          onClick={() => scrollToSection(sec.id)}
          title={sec.label}
        ></div>
      ))}
    </nav>
  );
}

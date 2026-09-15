import React from 'react';

export default function FinalMessageSection() {
  return (
    <section id="final-message" className="section" data-section="final" aria-label="Final Message">
      <div data-aos="fade-up" style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', marginBottom: '30px', animation: 'heartbeatInline 1.5s ease-in-out infinite' }}>
          💝
        </div>
        <div className="final-text">
          "You are the best thing that ever happened to me."
        </div>
        <div style={{ marginTop: '30px', fontFamily: 'var(--font-elegant)', fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', letterSpacing: '3px', fontSize: '0.95rem' }}>
          — With all my love, always ✨
        </div>
      </div>
    </section>
  );
}


import React, { useEffect, useRef, useState } from 'react';

export default function LoveMeterSection() {
  const [percent, setPercent] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let current = 0;
          const interval = setInterval(() => {
            current += 2;
            if (current >= 100) {
              current = 100;
              clearInterval(interval);
              setShowLabel(true);
            }
            setPercent(current);
          }, 30);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="love-meter" className="section" data-section="meter" aria-label="Love Meter" ref={sectionRef}>
      <h2 className="section-title" data-aos="fade-up">Love Meter</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">Calculating how much I love you... 💕</p>

      <div className="love-meter-container" data-aos="zoom-in" data-aos-delay="200">
        <div className="love-meter-percent" id="love-meter-percent">{percent}%</div>
        <div className="love-meter-bar-wrap" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
          <div className="love-meter-bar" id="love-meter-bar" style={{ width: `${percent}%` }}></div>
        </div>
        <div className={`love-meter-label ${showLabel ? 'show' : ''}`} id="love-meter-label">
          ❤️ Infinite Love Loaded ❤️
        </div>
      </div>
    </section>
  );
}

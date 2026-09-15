import React, { useEffect, useState } from 'react';

export default function LoveCounterSection({ startDate = '2023-01-15' }) {
  const [counter, setCounter] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCounter = () => {
      const start = new Date(startDate);
      const now = new Date();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCounter({ days, hours, minutes, seconds });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <section id="love-counter" className="section" data-section="counter" aria-label="Love Counter">
      <h2 className="section-title" data-aos="fade-up">Time We've Shared</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
      <div className="love-counter-text" data-aos="fade-up" data-aos-delay="150">I have loved you for...</div>

      <div className="love-counter-grid" data-aos="zoom-in" data-aos-delay="200">
        <div className="counter-item glass">
          <span className="counter-number" id="love-days">{counter.days}</span>
          <span className="counter-label">Days</span>
        </div>
        <div className="counter-item glass">
          <span className="counter-number" id="love-hours">{counter.hours}</span>
          <span className="counter-label">Hours</span>
        </div>
        <div className="counter-item glass">
          <span className="counter-number" id="love-minutes">{counter.minutes}</span>
          <span className="counter-label">Minutes</span>
        </div>
        <div className="counter-item glass">
          <span className="counter-number" id="love-seconds">{counter.seconds}</span>
          <span className="counter-label">Seconds</span>
        </div>
      </div>
    </section>
  );
}

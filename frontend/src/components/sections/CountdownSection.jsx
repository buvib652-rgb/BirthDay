import React, { useEffect, useRef, useState } from 'react';

export default function CountdownSection({ onMidnight }) {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [isDone, setIsDone]     = useState(false);
  // Stable ref so onMidnight never causes the interval to restart
  const onMidnightRef = useRef(onMidnight);
  useEffect(() => { onMidnightRef.current = onMidnight; }, [onMidnight]);

  useEffect(() => {
    let firedMidnight = false;

    const updateCountdown = () => {
      const now    = new Date();
      const target = new Date();
      target.setHours(24, 0, 0, 0);

      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        setIsDone(true);
        if (!firedMidnight) {
          firedMidnight = true;
          if (onMidnightRef.current) onMidnightRef.current();
        }
        clearInterval(timer);
        return;
      }

      const hrs  = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours:   String(hrs).padStart(2, '0'),
        minutes: String(mins).padStart(2, '0'),
        seconds: String(secs).padStart(2, '0'),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []); // ← Empty dep array: interval created once, never restarted

  return (
    <section id="countdown-section" className="section" data-section="countdown" aria-label="Birthday Countdown">
      <div className="countdown-wrapper fade-in-section visible" data-aos="fade-up">
        <h2 className="section-title">The Midnight Magic</h2>
        <div className="section-divider"></div>
        <p className="countdown-label">Until Your Special Moment Arrives...</p>

        <div id="countdown-display">
          <div className="countdown-grid">
            <div className="countdown-item">
              <div className="countdown-box">
                <span className="countdown-number" id="cd-hours">{timeLeft.hours}</span>
              </div>
              <span className="countdown-label-small">Hours</span>
            </div>

            <div className="countdown-colon">:</div>

            <div className="countdown-item">
              <div className="countdown-box">
                <span className="countdown-number" id="cd-minutes">{timeLeft.minutes}</span>
              </div>
              <span className="countdown-label-small">Minutes</span>
            </div>

            <div className="countdown-colon">:</div>

            <div className="countdown-item">
              <div className="countdown-box">
                <span className="countdown-number" id="cd-seconds">{timeLeft.seconds}</span>
              </div>
              <span className="countdown-label-small">Seconds</span>
            </div>
          </div>
        </div>

        {isDone && (
          <div id="countdown-done" style={{ marginTop: '30px' }}>
            <p className="section-subtitle">🎉 The magical moment has arrived!</p>
          </div>
        )}
      </div>
    </section>
  );
}

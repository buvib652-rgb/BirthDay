import React, { useEffect, useState } from 'react';
import HeartIcon from './icons/HeartIcon';

export default function Preloader({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15 + 3;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setHidden(true);
            if (onFinish) onFinish();
          }, 400);
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onFinish]);

  if (hidden) return null;

  return (
    <div id="preloader" role="status" aria-label="Loading" style={{ opacity: progress === 100 ? 0 : 1, transition: 'opacity 0.8s ease' }}>
      <div className="preloader-heart-container">
        <div className="preloader-rings"></div>
        <div className="preloader-rings"></div>
        <div className="preloader-rings"></div>
        <div className="preloader-heart"><HeartIcon size="3.5rem" animated /></div>
      </div>
      <div className="preloader-text">Preparing Something Special...</div>
      <div className="preloader-bar-container">
        <div className="preloader-bar" id="preloader-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="preloader-percent" id="preloader-percent">{Math.round(progress)}%</div>
    </div>
  );
}

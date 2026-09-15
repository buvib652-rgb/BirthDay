import React from 'react';

export default function HeartIcon({ size = '1em', color, className = '', style = {}, animated = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`inline-block align-middle ${animated ? 'animate-heartbeat' : ''} ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: 'drop-shadow(0 0 6px rgba(220, 20, 60, 0.6))',
        ...style,
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color || '#ff4d6d'} />
          <stop offset="100%" stopColor={color || '#c41e5a'} />
        </linearGradient>
      </defs>
      <path
        fill="url(#heartGrad)"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

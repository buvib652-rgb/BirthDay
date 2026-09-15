import React from 'react';

export default function LoveHeartsIcon({ size = '1.2em', className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 32 28"
      width={size}
      height={size}
      className={`inline-block align-middle ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 0 6px rgba(255,107,157,0.6))', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lhGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff758c" />
          <stop offset="100%" stopColor="#ff7eb3" />
        </linearGradient>
        <linearGradient id="lhGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d6d" />
          <stop offset="100%" stopColor="#c41e5a" />
        </linearGradient>
      </defs>
      <path
        fill="url(#lhGrad1)"
        opacity="0.85"
        transform="translate(14, 0) scale(0.65)"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
      <path
        fill="url(#lhGrad2)"
        transform="translate(0, 4) scale(0.85)"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

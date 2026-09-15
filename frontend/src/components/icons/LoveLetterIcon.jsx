import React from 'react';

export default function LoveLetterIcon({ size = '1.2em', className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 32 26"
      width={size}
      height={size}
      className={`inline-block align-middle ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 0 8px rgba(196, 30, 90, 0.5))', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff0f5" />
          <stop offset="100%" stopColor="#ffd1dc" />
        </linearGradient>
      </defs>
      <rect x="2" y="3" width="28" height="20" rx="3" fill="url(#envGrad)" stroke="#c41e5a" strokeWidth="1" />
      <path d="M2 4L16 14L30 4" fill="none" stroke="#c41e5a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path fill="#c41e5a" d="M16 16.5C15 15 13 14 13 12.5C13 11 14.2 10 15.5 10C16 10 16.5 10.3 16 10.8C16.5 10.3 17 10 17.5 10C18.8 10 20 11 20 12.5C20 14 18 15 16 16.5Z" transform="translate(0, -1)" />
    </svg>
  );
}

import React from 'react';

export default function CakeIcon({ size = '1.1em', className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`inline-block align-middle ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b9d" />
          <stop offset="100%" stopColor="#c41e5a" />
        </linearGradient>
        <linearGradient id="icingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffe5ec" />
        </linearGradient>
      </defs>
      <rect x="4" y="16" width="24" height="12" rx="2" fill="url(#cakeGrad)" />
      <path fill="url(#icingGrad)" d="M4 16C6 18 8 16 10 18C12 16 14 18 16 16C18 18 20 16 22 18C24 16 26 18 28 16V14H4V16Z" />
      <rect x="14.5" y="7" width="3" height="7" fill="#ffd700" rx="1" />
      <path fill="#ff4500" d="M16 2C15 4 14.5 5.5 16 7C17.5 5.5 17 4 16 2Z" />
      <path fill="#ffff00" d="M16 4C15.5 5 15.2 5.8 16 6.5C16.8 5.8 16.5 5 16 4Z" />
    </svg>
  );
}

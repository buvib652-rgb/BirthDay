import React from 'react';

export default function InfinityIcon({ size = '1em', className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 48 24"
      width={size}
      height={size}
      className={`inline-block align-middle ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 0 16px rgba(255, 100, 150, 0.95))', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="infGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="50%" stopColor="#ff4d6d" />
          <stop offset="100%" stopColor="#c41e5a" />
        </linearGradient>
      </defs>
      <path
        fill="none"
        stroke="url(#infGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        d="M14 12C14 16 9 18 6 18C3 18 2 15 2 12C2 9 3 6 6 6C9 6 14 8 14 12ZM14 12C14 16 19 18 22 18C25 18 26 15 26 12C26 9 25 6 22 6C19 6 14 8 14 12Z"
        transform="scale(1.7) translate(-1, -2)"
      />
    </svg>
  );
}

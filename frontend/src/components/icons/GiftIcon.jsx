import React from 'react';

export default function GiftIcon({ size = '1em', opened = false, className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`inline-block align-middle ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 0 10px rgba(196, 30, 90, 0.6))', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="giftBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c41e5a" />
          <stop offset="100%" stopColor="#6a0dad" />
        </linearGradient>
        <linearGradient id="giftRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#ffa500" />
        </linearGradient>
      </defs>

      {/* Box Body */}
      <rect x="5" y="14" width="22" height="15" rx="2" fill="url(#giftBoxGrad)" />
      {/* Vertical Ribbon */}
      <rect x="13.5" y="14" width="5" height="15" fill="url(#giftRibbonGrad)" />

      {/* Lid Group */}
      <g style={{
        transform: opened ? 'translateY(-14px) rotate(-18deg)' : 'none',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transformOrigin: '5px 14px'
      }}>
        <rect x="3.5" y="9" width="25" height="5" rx="1.5" fill="#e6005c" />
        <rect x="13.5" y="9" width="5" height="5" fill="url(#giftRibbonGrad)" />
        {/* Bow */}
        <path fill="url(#giftRibbonGrad)" d="M12 9C9 5 6 9 12 9Z" />
        <path fill="url(#giftRibbonGrad)" d="M20 9C23 5 26 9 20 9Z" />
        <circle cx="16" cy="9" r="2" fill="#ffd700" />
      </g>
    </svg>
  );
}

import React from 'react';

export default function RoseIcon({ size = '1.1em', className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`inline-block align-middle ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 0 6px rgba(196, 30, 90, 0.5))', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rosePetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d6d" />
          <stop offset="100%" stopColor="#800f2f" />
        </linearGradient>
        <linearGradient id="roseStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d6a4f" />
          <stop offset="100%" stopColor="#1b4332" />
        </linearGradient>
      </defs>
      <path fill="url(#rosePetalGrad)" d="M12 2C9.5 2 7 3.8 7 6.5C7 9.2 9.8 11.5 12 13C14.2 11.5 17 9.2 17 6.5C17 3.8 14.5 2 12 2Z" />
      <path fill="#c41e5a" opacity="0.8" d="M12 4C10.5 4 9 5.2 9 7C9 8.5 10.8 10 12 11C13.2 10 15 8.5 15 7C15 5.2 13.5 4 12 4Z" />
      <path fill="#ff758c" opacity="0.9" d="M12 5.5C11 5.5 10 6.2 10 7.2C10 8.2 11.2 9.2 12 9.8C12.8 9.2 14 8.2 14 7.2C14 6.2 13 5.5 12 5.5Z" />
      <path stroke="url(#roseStemGrad)" strokeWidth="1.5" strokeLinecap="round" fill="none" d="M12 13V22" />
      <path fill="#2d6a4f" d="M12 16C10 15 8 16 7.5 17C8.5 17.5 11 17 12 16Z" />
      <path fill="#2d6a4f" d="M12 18C14 17 16 18 16.5 19C15.5 19.5 13 19 12 18Z" />
    </svg>
  );
}

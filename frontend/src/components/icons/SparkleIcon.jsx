import React from 'react';

export default function SparkleIcon({ size = '1em', color = '#ffd700', className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`inline-block align-middle ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.7))', ...style }}
      aria-hidden="true"
    >
      <path
        fill={color}
        d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
      />
    </svg>
  );
}

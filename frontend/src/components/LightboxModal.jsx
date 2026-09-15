import React, { useEffect } from 'react';

export default function LightboxModal({ isOpen, imageSrc, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="lightbox" className="active" role="dialog" aria-label="Image Preview">
      <button id="lightbox-close" aria-label="Close preview" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
      <img id="lightbox-img" src={imageSrc} alt="Gallery preview" crossOrigin="anonymous" decoding="async" />
    </div>
  );
}

import React from 'react';
import { getFullImageUrl } from '../../services/api';

const DEFAULT_GALLERY_PHOTOS = [
  { src: '', caption: 'Our First Photo 📸' },
  { src: '', caption: 'A Beautiful Memory ✨' },
  { src: '', caption: 'Us, Always 💕' },
  { src: '', caption: 'My Favourite Moment 🌸' },
  { src: '', caption: 'Adventure Together 🌍' },
  { src: '', caption: 'Pure Joy 😄' },
  { src: '', caption: 'Love in Every Frame ❤️' },
  { src: '', caption: 'Unforgettable 💖' },
  { src: '', caption: 'Forever & Always 🌹' },
];

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #c41e5a, #6a0dad)',
  'linear-gradient(135deg, #6a0dad, #0a0a8a)',
  'linear-gradient(135deg, #c41e5a, #b8860b)',
  'linear-gradient(135deg, #b8860b, #c41e5a)',
  'linear-gradient(135deg, #dc143c, #9b59b6)',
  'linear-gradient(135deg, #4a0080, #c41e5a)',
  'linear-gradient(135deg, #9b59b6, #ffd700)',
  'linear-gradient(135deg, #c41e5a, #4a0080)',
  'linear-gradient(135deg, #ffd700, #dc143c)',
];

const PLACEHOLDER_ICONS = ['💕', '🌹', '❤️', '💖', '🌸', '✨', '💝', '💫', '🌺'];

export default function GallerySection({ photos = [], placeholderCount = 9, onSelectImage }) {
  // Merge uploaded database photos with default placeholder cards
  const totalCount = Math.max(placeholderCount, photos.length);
  const galleryItems = Array.from({ length: totalCount }, (_, i) => {
    if (photos[i]) {
      const rawSrc = photos[i].imageUrl || photos[i].url || photos[i].src || '';
      return {
        src: getFullImageUrl(rawSrc),
        caption: photos[i].caption || DEFAULT_GALLERY_PHOTOS[i]?.caption || `Memory #${i + 1}`,
      };
    }
    return DEFAULT_GALLERY_PHOTOS[i] || { src: '', caption: `Memory #${i + 1}` };
  });

  return (
    <section id="photo-gallery" className="section" data-section="gallery" aria-label="Photo Gallery">
      <h2 className="section-title" data-aos="fade-up">Our Memories</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">Moments frozen in time, forever in my heart 📸</p>

      <div className="gallery-grid" id="gallery-grid" data-aos="fade-up" data-aos-delay="200">
        {galleryItems.map((photo, i) => {
          const imgSrc = photo.src;
          const hasRealPhoto = imgSrc && imgSrc.length > 0;
          const grad = PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length];
          const icon = PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length];

          return (
            <div
              key={i}
              className="gallery-item"
              style={{ background: hasRealPhoto ? 'rgba(255,255,255,0.05)' : grad }}
              onClick={() => onSelectImage && onSelectImage(imgSrc || `/assets/images/gallery/photo${i + 1}.jpg`)}
            >
              {hasRealPhoto ? (
                <>
                  <img src={imgSrc} alt={photo.caption} crossOrigin="anonymous" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="gallery-item-overlay">
                    <span className="gallery-item-icon"><i className="fas fa-expand"></i></span>
                    <span style={{ fontFamily: 'var(--font-elegant)', fontStyle: 'italic', fontSize: '0.85rem', color: 'white', marginLeft: '8px' }}>
                      {photo.caption}
                    </span>
                  </div>
                </>
              ) : (
                <div className="gallery-placeholder">
                  <span style={{ fontSize: '2.5rem' }}>{icon}</span>
                  <span>{photo.caption}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '4px', textAlign: 'center' }}>
                    Add photo in Admin Dashboard
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

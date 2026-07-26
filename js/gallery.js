/* ============================================
   gallery.js – Photo Gallery
============================================ */

'use strict';

// ============================================
// GALLERY DATA
// Add your real photo paths here!
// Format: { src: 'path/to/photo.jpg', caption: 'Caption text' }
// ============================================
const GALLERY_PHOTOS = [
  // Real photos — add your paths here:
  // { src: 'assets/images/gallery/photo1.jpg', caption: 'Together always ❤️' },
  // { src: 'assets/images/gallery/photo2.jpg', caption: 'My favourite smile 😊' },

  // Placeholder slots (replaced when you add real photos):
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

// Placeholder gradient backgrounds for missing photos
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

// ============================================
// BUILD GALLERY
// ============================================
function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = '';

  GALLERY_PHOTOS.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-aos', 'zoom-in');
    item.setAttribute('data-aos-delay', String(i * 80));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Open photo: ${photo.caption}`);

    const hasRealPhoto = photo.src && photo.src.length > 0;

    if (hasRealPhoto) {
      // Real photo
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption;
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';

      const overlay = document.createElement('div');
      overlay.className = 'gallery-item-overlay';
      overlay.innerHTML = `
        <span class="gallery-item-icon"><i class="fas fa-expand"></i></span>
        <span style="font-family: var(--font-elegant); font-style: italic; font-size: 0.85rem; color: white; margin-left: 8px;">${photo.caption}</span>
      `;

      item.appendChild(img);
      item.appendChild(overlay);

      // Click = open lightbox
      item.addEventListener('click', () => openLightbox(photo.src, photo.caption));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') openLightbox(photo.src, photo.caption);
      });

    } else {
      // Placeholder
      const grad = PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length];
      const icon = PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length];
      item.style.background = grad;

      item.innerHTML = `
        <div class="gallery-placeholder">
          <span style="font-size: 2.5rem;">${icon}</span>
          <span>${photo.caption}</span>
          <span style="font-size: 0.7rem; opacity: 0.5; margin-top: 4px;">Add photo to<br>assets/images/gallery/</span>
        </div>
      `;
    }

    grid.appendChild(item);
  });
}

// ============================================
// LIGHTBOX
// ============================================
function openLightbox(src, caption) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lightbox || !img) return;

  img.src = src;
  img.alt = caption || 'Gallery photo';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('lightbox-close');
  const lightbox = document.getElementById('lightbox');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});

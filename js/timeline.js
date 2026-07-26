/* ============================================
   timeline.js – Our Story Timeline
============================================ */

'use strict';

// ============================================
// BUILD TIMELINE
// Uses CONFIG.timelineEvents from main.js
// ============================================
function buildTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  // Remove any old items (keep the line)
  const existingItems = container.querySelectorAll('.timeline-item');
  existingItems.forEach(el => el.remove());

  // Ensure CONFIG is available
  const events = (typeof CONFIG !== 'undefined' && CONFIG.timelineEvents)
    ? CONFIG.timelineEvents
    : getDefaultEvents();

  events.forEach((event, i) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';

    const isEven = i % 2 === 0;

    item.innerHTML = `
      <div class="timeline-card glass ${isEven ? '' : 'text-right'}" style="${!isEven ? 'text-align: right;' : ''}">
        <div class="timeline-card-date">${event.date}</div>
        <div class="timeline-card-title">${event.title}</div>
        <div class="timeline-card-desc">${event.desc}</div>
      </div>
      <div class="timeline-dot" title="${event.title}">
        <span class="timeline-emoji">${event.emoji}</span>
      </div>
      <div class="timeline-card glass" style="opacity: 0; pointer-events: none;"></div>
    `;

    // Add entrance animation
    item.style.transitionDelay = `${i * 0.1}s`;

    container.appendChild(item);
  });

  // Intersection observer to reveal items
  setupTimelineObserver();
}

function setupTimelineObserver() {
  const items = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Create a sparkle effect when item appears
        createTimelineSparkle(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
  });

  items.forEach(item => observer.observe(item));
}

function createTimelineSparkle(item) {
  const dot = item.querySelector('.timeline-dot');
  if (!dot) return;

  const rect = dot.getBoundingClientRect();
  const sparkles = ['✨', '⭐', '💫', '🌟'];

  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      const s = document.createElement('div');
      s.style.cssText = `
        position: fixed;
        font-size: ${Math.random() * 12 + 8}px;
        left: ${rect.left + rect.width / 2 + (Math.random() - 0.5) * 60}px;
        top: ${rect.top + rect.height / 2 + (Math.random() - 0.5) * 60}px;
        pointer-events: none;
        z-index: 5000;
        animation: sparkleFloat 1.2s ease-out forwards;
      `;
      s.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1300);
    }, i * 150);
  }

  // Add sparkle keyframes if not present
  if (!document.getElementById('sparkle-style')) {
    const style = document.createElement('style');
    style.id = 'sparkle-style';
    style.textContent = `
      @keyframes sparkleFloat {
        0% { transform: translate(0, 0) scale(0); opacity: 1; }
        100% { transform: translate(${(Math.random()-0.5)*80}px, -60px) scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// DEFAULT EVENTS (fallback if CONFIG missing)
// ============================================
function getDefaultEvents() {
  return [
    { emoji: '💬', date: 'The very beginning', title: 'First Talk', desc: 'The message that started it all.' },
    { emoji: '😊', date: 'Shortly after', title: 'First Smile', desc: 'That smile changed everything.' },
    { emoji: '📞', date: 'Growing closer', title: 'First Call', desc: 'We talked for hours.' },
    { emoji: '🌸', date: 'A beautiful day', title: 'First Meet', desc: 'You were even more beautiful in person.' },
    { emoji: '🤳', date: 'A precious moment', title: 'First Selfie', desc: 'A photo I will treasure forever.' },
    { emoji: '🌧️', date: 'A tough moment', title: 'First Fight', desc: 'We came back stronger.' },
    { emoji: '🎁', date: 'A celebration', title: 'First Gift', desc: 'Your smile was the real gift.' },
    { emoji: '⭐', date: 'Unforgettable', title: 'Favourite Memory', desc: 'I never want to be anywhere else.' },
    { emoji: '🎂', date: 'Today', title: 'Your Birthday', desc: 'Happy Birthday, my love!' },
  ];
}

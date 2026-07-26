/* ============================================
   effects.js – Rose Petals Canvas + Particles
============================================ */

'use strict';

// ============================================
// ROSE PETALS CANVAS
// ============================================
let petalCanvas, petalCtx;
let petals = [];
const MAX_PETALS = 60;

const PETAL_COLORS = [
  'rgba(220, 20, 60, 0.7)',
  'rgba(196, 30, 90, 0.6)',
  'rgba(255, 107, 157, 0.65)',
  'rgba(228, 62, 140, 0.6)',
  'rgba(255, 182, 193, 0.5)',
  'rgba(219, 112, 147, 0.7)',
];

function startPetalCanvas() {
  petalCanvas = document.getElementById('canvas-petals');
  if (!petalCanvas) return;

  petalCtx = petalCanvas.getContext('2d');
  resizePetalCanvas();
  window.addEventListener('resize', resizePetalCanvas);

  // Spawn initial petals
  for (let i = 0; i < MAX_PETALS; i++) {
    setTimeout(() => spawnPetal(true), i * 100);
  }

  requestAnimationFrame(animatePetals);
}

function resizePetalCanvas() {
  if (!petalCanvas) return;
  petalCanvas.width = window.innerWidth;
  petalCanvas.height = window.innerHeight;
}

function spawnPetal(fromTop = false) {
  const size = Math.random() * 12 + 6;
  petals.push({
    x: Math.random() * (petalCanvas ? petalCanvas.width : window.innerWidth),
    y: fromTop
      ? Math.random() * -200
      : -(size * 2),
    size,
    vy: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 1.2,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 3,
    opacity: Math.random() * 0.4 + 0.4,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    swing: Math.random() * Math.PI * 2,
    swingSpeed: Math.random() * 0.03 + 0.01,
    swingAmp: Math.random() * 40 + 20,
    type: Math.floor(Math.random() * 3), // 0=ellipse, 1=teardrop, 2=heart
  });
}

function animatePetals() {
  if (!petalCtx) { requestAnimationFrame(animatePetals); return; }

  petalCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);

  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i];
    p.y += p.vy;
    p.swing += p.swingSpeed;
    p.x += Math.sin(p.swing) * (p.swingAmp * 0.02) + p.vx;
    p.rotation += p.rotationSpeed;

    if (p.y > petalCanvas.height + 50) {
      petals.splice(i, 1);
      spawnPetal();
      continue;
    }

    petalCtx.save();
    petalCtx.translate(p.x, p.y);
    petalCtx.rotate((p.rotation * Math.PI) / 180);
    petalCtx.globalAlpha = p.opacity;

    drawPetal(petalCtx, p);

    petalCtx.restore();
  }

  petalCtx.globalAlpha = 1;
  requestAnimationFrame(animatePetals);
}

function drawPetal(ctx, p) {
  const s = p.size;

  switch (p.type) {
    case 0:
      // Ellipse petal
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.5, s, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Highlight
      ctx.beginPath();
      ctx.ellipse(-s * 0.12, -s * 0.3, s * 0.15, s * 0.35, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fill();
      break;

    case 1:
      // Teardrop petal
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.6, -s * 0.3, s * 0.6, s * 0.3, 0, s * 0.5);
      ctx.bezierCurveTo(-s * 0.6, s * 0.3, -s * 0.6, -s * 0.3, 0, -s);
      ctx.fillStyle = p.color;
      ctx.fill();
      break;

    case 2:
      // Mini heart
      ctx.beginPath();
      const hs = s * 0.35;
      ctx.moveTo(0, hs * 0.5);
      ctx.bezierCurveTo(-hs * 2.5, -hs, -hs * 2.5, -hs * 2.5, 0, -hs * 1.5);
      ctx.bezierCurveTo(hs * 2.5, -hs * 2.5, hs * 2.5, -hs, 0, hs * 0.5);
      ctx.fillStyle = p.color;
      ctx.fill();
      break;
  }
}

// ============================================
// BACKGROUND PARTICLE BURST
// (Used for various celebration moments)
// ============================================
function burstParticles(x, y, count = 20, colors = null) {
  if (!petalCtx) return;
  const defaultColors = ['#c41e5a', '#ffd700', '#9b59b6', '#ff6b9d', '#ffffff'];
  const cls = colors || defaultColors;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = Math.random() * 5 + 2;
    const color = cls[Math.floor(Math.random() * cls.length)];
    // Use heart trails from main.js if available
    if (window.heartTrails) {
      window.heartTrails.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 10 + 5,
        life: 1,
        char: '✨',
      });
    }
  }
}

// ============================================
// AMBIENT BACKGROUND GLOW PULSE
// ============================================
function createAmbientGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 20% 80%, rgba(196,30,90,0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(106,13,173,0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.03) 0%, transparent 70%);
    animation: ambientGlow 8s ease-in-out infinite alternate;
  `;
  document.body.appendChild(glow);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes ambientGlow {
      0% { opacity: 0.5; transform: scale(1); }
      100% { opacity: 1; transform: scale(1.05); }
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// PAGE LOAD PARTICLE EFFECT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Create ambient glow
  createAmbientGlow();
});

// ============================================
// SECTION TRANSITION EFFECTS (called by main.js)
// ============================================
function sectionTransitionEffect(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section || !window.gsap) return;

  gsap.from(section.querySelectorAll('.section-title, .section-subtitle, .section-divider'), {
    opacity: 0,
    y: 40,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out',
  });
}

// ============================================
// GSAP SCROLL TRIGGER (if available)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  // Animate section titles on scroll
  document.querySelectorAll('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });
  });

  // Animate countdown boxes
  document.querySelectorAll('.countdown-box').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      opacity: 0,
      scale: 0.5,
      duration: 0.7,
      delay: i * 0.15,
      ease: 'back.out(1.7)',
    });
  });

  // Animate counter items
  document.querySelectorAll('.counter-item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      opacity: 0,
      y: 40,
      scale: 0.8,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'back.out(1.7)',
    });
  });
});

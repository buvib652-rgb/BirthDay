/* ============================================
   countdown.js – Midnight Countdown Logic
============================================ */

'use strict';

// ============================================
// COUNTDOWN TO MIDNIGHT
// ============================================
function getMidnightTime() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // next midnight
  return midnight;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

let countdownInterval = null;
let midnightTriggeredFlag = false;

function startCountdown() {
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const display = document.getElementById('countdown-display');
  const done = document.getElementById('countdown-done');

  if (!hoursEl) return;

  function tick() {
    const now = new Date();
    const midnight = getMidnightTime();
    const diff = midnight - now;

    if (diff <= 0) {
      // It IS midnight!
      clearInterval(countdownInterval);

      // Hide countdown, show done msg
      if (display) display.style.display = 'none';
      if (done) done.style.display = 'block';

      // Trigger midnight celebration
      triggerMidnightCelebration();
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Animate number change
    animateCountdownNumber(hoursEl, pad2(hours));
    animateCountdownNumber(minutesEl, pad2(minutes));
    animateCountdownNumber(secondsEl, pad2(seconds));
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

function animateCountdownNumber(el, newVal) {
  if (!el) return;
  if (el.textContent === newVal) return;

  // Flip animation
  el.style.transform = 'translateY(-10px)';
  el.style.opacity = '0.3';
  el.style.transition = 'all 0.2s ease';

  setTimeout(() => {
    el.textContent = newVal;
    el.style.transform = 'translateY(0)';
    el.style.opacity = '1';
  }, 200);
}

// ============================================
// MIDNIGHT CELEBRATION
// ============================================
function triggerMidnightCelebration() {
  if (midnightTriggeredFlag) return;
  midnightTriggeredFlag = true;

  // Show midnight overlay
  const overlay = document.getElementById('midnight-overlay');
  if (overlay) {
    overlay.classList.add('active');
    createMidnightStars();
  }

  // Play voice recording
  if (typeof playVoiceMessage === 'function') {
    playVoiceMessage();
  }

  // Fireworks
  startFireworks();

  // Mega Confetti
  launchMegaConfetti();

  // Heart explosion (via canvas petals)
  launchHeartExplosion();

  // Balloons
  showBalloons();

  // Screen glow effect
  flashScreenGlow();

  // GSAP shake animation on overlay
  if (window.gsap && overlay) {
    gsap.fromTo(overlay, 
      { x: -10 },
      { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'none' }
    );
  }

  // Browser Notification
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    try {
      new Notification('🎂 HAPPY BIRTHDAY MY LOVE! ❤️', {
        body: 'The magical midnight moment is here! Open the surprise! 🎉',
        icon: 'assets/icons/icon-192.png',
      });
    } catch(e) {}
  }
}

function createMidnightStars() {
  const container = document.getElementById('midnight-overlay-stars');
  if (!container) return;
  container.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
  for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: white; border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: starTwinkle ${2 + Math.random() * 3}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
      opacity: 0.5;
    `;
    container.appendChild(star);
  }
}

// ============================================
// FIREWORKS CANVAS
// ============================================
let fireworksCanvas, fireworksCtx;
let fireworksParticles = [];
let fireworksRunning = false;

function startFireworks() {
  fireworksCanvas = document.getElementById('canvas-fireworks');
  if (!fireworksCanvas) return;
  fireworksCanvas.style.display = 'block';
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
  fireworksCtx = fireworksCanvas.getContext('2d');
  fireworksRunning = true;

  window.addEventListener('resize', () => {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  });

  // Launch fireworks for 10 seconds
  const launchInterval = setInterval(() => {
    if (!fireworksRunning) {
      clearInterval(launchInterval);
      return;
    }
    launchFirework();
    if (Math.random() > 0.5) launchFirework();
  }, 400);

  setTimeout(() => {
    fireworksRunning = false;
    clearInterval(launchInterval);
    setTimeout(() => {
      fireworksCanvas.style.display = 'none';
    }, 2000);
  }, 10000);

  animateFireworks();
}

function launchFirework() {
  const colors = [
    '#ff0000', '#ff6b9d', '#ffd700', '#c41e5a', '#9b59b6',
    '#00ffff', '#ff69b4', '#ffa500', '#ffffff', '#adff2f'
  ];

  const x = Math.random() * fireworksCanvas.width;
  const y = Math.random() * fireworksCanvas.height * 0.6;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = Math.floor(Math.random() * 40 + 60);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = Math.random() * 6 + 2;
    fireworksParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      life: 1,
      size: Math.random() * 4 + 2,
      gravity: 0.12,
      fade: Math.random() * 0.02 + 0.015,
    });
  }
}

function animateFireworks() {
  if (!fireworksCtx) return;
  fireworksCtx.fillStyle = 'rgba(0,0,0,0.15)';
  fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  for (let i = fireworksParticles.length - 1; i >= 0; i--) {
    const p = fireworksParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.99;
    p.life -= p.fade;

    if (p.life <= 0) {
      fireworksParticles.splice(i, 1);
      continue;
    }

    fireworksCtx.save();
    fireworksCtx.globalAlpha = p.life;
    fireworksCtx.beginPath();
    fireworksCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    fireworksCtx.fillStyle = p.color;
    fireworksCtx.shadowColor = p.color;
    fireworksCtx.shadowBlur = 8;
    fireworksCtx.fill();
    fireworksCtx.restore();
  }

  if (fireworksRunning || fireworksParticles.length > 0) {
    requestAnimationFrame(animateFireworks);
  }
}

// ============================================
// MEGA CONFETTI BURST
// ============================================
function launchMegaConfetti() {
  const colors = ['#c41e5a', '#ffd700', '#9b59b6', '#ff6b9d', '#ffffff', '#dc143c', '#ffa500'];
  const end = Date.now() + 5000;

  function burstConfetti() {
    confetti({
      particleCount: 25,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
      gravity: 0.8,
    });
    confetti({
      particleCount: 25,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
      gravity: 0.8,
    });
    confetti({
      particleCount: 15,
      angle: 90,
      spread: 70,
      origin: { x: 0.5, y: 0.3 },
      colors,
      scalar: 1.3,
    });

    if (Date.now() < end) requestAnimationFrame(burstConfetti);
  }

  burstConfetti();
}

// ============================================
// HEART EXPLOSION
// ============================================
function launchHeartExplosion() {
  // Big heart emojis burst from center
  const overlay = document.getElementById('midnight-overlay');
  if (!overlay) return;

  const hearts = ['❤️', '💖', '💝', '💕', '💗', '🌹', '✨'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.style.cssText = `
        position: fixed;
        font-size: ${Math.random() * 30 + 20}px;
        left: 50%; top: 50%;
        pointer-events: none;
        z-index: 20000;
        animation: explodeHeart 2s ease-out forwards;
        --tx: ${(Math.random() - 0.5) * 80}vw;
        --ty: ${(Math.random() - 0.5) * 80}vh;
      `;
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      document.body.appendChild(h);

      const style = document.createElement('style');
      style.textContent = `
        @keyframes explodeHeart {
          0% { transform: translate(-50%,-50%) scale(0); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);

      setTimeout(() => h.remove(), 2500);
    }, i * 80);
  }
}

// ============================================
// SCREEN GLOW
// ============================================
function flashScreenGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; inset: 0; z-index: 19000;
    pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(220,20,60,0.3), transparent 70%);
    animation: glowPulse 3s ease-in-out forwards;
  `;
  const s = document.createElement('style');
  s.textContent = `
    @keyframes glowPulse {
      0% { opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 0.5; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(s);
  document.body.appendChild(glow);
  setTimeout(() => glow.remove(), 3500);
}

// ============================================
// BALLOONS CANVAS
// ============================================
let balloonCanvas, balloonCtx;
let balloons = [];
let balloonsRunning = false;

const BALLOON_COLORS = ['#ff6b9d', '#c41e5a', '#9b59b6', '#ffd700', '#ff4444', '#ff8c00', '#00bfff'];

function showBalloons() {
  balloonCanvas = document.getElementById('canvas-balloons');
  if (!balloonCanvas) return;
  balloonCanvas.style.display = 'block';
  balloonCanvas.width = window.innerWidth;
  balloonCanvas.height = window.innerHeight;
  balloonCtx = balloonCanvas.getContext('2d');
  balloonsRunning = true;

  // Spawn balloons
  for (let i = 0; i < 20; i++) {
    setTimeout(() => spawnBalloon(), i * 200);
  }

  // Touch/click to pop
  balloonCanvas.addEventListener('click', popBalloon);
  balloonCanvas.addEventListener('touchstart', popBalloon, { passive: true });

  animateBalloons();

  // Hide after 12 seconds
  setTimeout(() => {
    balloonsRunning = false;
    balloonCanvas.style.display = 'none';
  }, 12000);
}

function spawnBalloon() {
  const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  balloons.push({
    x: Math.random() * (balloonCanvas.width - 60) + 30,
    y: balloonCanvas.height + 80,
    vy: -(Math.random() * 1.5 + 0.8),
    vx: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 25 + 35,
    color,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.03 + 0.01,
    popped: false,
    popLife: 0,
  });
}

function animateBalloons() {
  if (!balloonCtx) return;
  balloonCtx.clearRect(0, 0, balloonCanvas.width, balloonCanvas.height);

  for (let i = balloons.length - 1; i >= 0; i--) {
    const b = balloons[i];

    if (b.popped) {
      b.popLife -= 0.05;
      if (b.popLife <= 0) { balloons.splice(i, 1); continue; }
      // Draw pop particles (simple)
      balloonCtx.globalAlpha = b.popLife;
      balloonCtx.font = `${20 * b.popLife}px serif`;
      balloonCtx.fillText('✨', b.x - 10, b.y);
      balloonCtx.fillText('💥', b.x + 10, b.y - 10);
      balloonCtx.globalAlpha = 1;
      continue;
    }

    b.sway += b.swaySpeed;
    b.x += Math.sin(b.sway) * 0.8 + b.vx;
    b.y += b.vy;

    if (b.y < -100) { balloons.splice(i, 1); continue; }

    drawBalloon(b);
  }

  if (balloonsRunning || balloons.length > 0) {
    requestAnimationFrame(animateBalloons);
  }
}

function drawBalloon(b) {
  const ctx = balloonCtx;
  const r = b.size;

  // Balloon body
  ctx.save();
  ctx.translate(b.x, b.y);

  // Gradient fill
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, lightenColor(b.color, 60));
  grad.addColorStop(1, b.color);

  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 1.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Highlight
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, -r * 0.3, r * 0.2, r * 0.15, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fill();

  // Knot
  ctx.beginPath();
  ctx.arc(0, r * 1.2, 4, 0, Math.PI * 2);
  ctx.fillStyle = darkenColor(b.color, 30);
  ctx.fill();

  // String
  ctx.beginPath();
  ctx.moveTo(0, r * 1.25);
  for (let s = 0; s < 60; s++) {
    ctx.lineTo(
      Math.sin((s / 60) * Math.PI * 2 + b.sway) * 8,
      r * 1.25 + s
    );
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

function popBalloon(e) {
  const rect = balloonCanvas.getBoundingClientRect();
  const cx = (e.clientX || e.touches[0].clientX) - rect.left;
  const cy = (e.clientY || e.touches[0].clientY) - rect.top;

  for (let i = 0; i < balloons.length; i++) {
    const b = balloons[i];
    if (b.popped) continue;
    const dist = Math.hypot(cx - b.x, cy - b.y);
    if (dist < b.size * 1.3) {
      b.popped = true;
      b.popLife = 1;
      // Small confetti burst
      if (typeof confetti !== 'undefined') {
        confetti({
          particleCount: 20,
          spread: 50,
          origin: {
            x: (b.x / window.innerWidth),
            y: (b.y / window.innerHeight),
          },
          colors: [b.color, '#ffffff', '#ffd700'],
          scalar: 0.7,
        });
      }
      break;
    }
  }
}

function lightenColor(hex, amount) {
  return adjustColor(hex, amount);
}
function darkenColor(hex, amount) {
  return adjustColor(hex, -amount);
}
function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

// ============================================
// MIDNIGHT DETECTION (continuous check)
// ============================================
function startMidnightDetection() {
  // Start the countdown display
  startCountdown();

  // Check every second if it's midnight
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() < 5) {
      if (!midnightTriggeredFlag) {
        triggerMidnightCelebration();
      }
    }
  }, 1000);
}

// ============================================
// MIDNIGHT OVERLAY CLOSE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('midnight-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const overlay = document.getElementById('midnight-overlay');
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => overlay.classList.remove('active'),
        });
      }
    });
  }
});

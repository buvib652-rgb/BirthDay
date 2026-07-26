/* ============================================
   main.js – Core Application Logic
   Romantic Birthday Surprise Website
============================================ */

'use strict';

// ============================================
// CONFIGURATION — Edit these values!
// ============================================
const CONFIG = {
  // Her name (shown in various places)
  hername: 'My Love',

  // The date you started loving her: 'YYYY-MM-DD'
  loveStartDate: '2023-01-15',

  // Her birthday this year: 'YYYY-MM-DD' (used for countdown)
  birthdayDate: new Date().toISOString().slice(0,10), // defaults to today for demo

  // Reasons you love her (add as many as you want!)
  loveReasons: [
    { icon: '😊', text: 'Your smile lights up every room you walk into' },
    { icon: '💪', text: 'Your strength and courage inspire me every single day' },
    { icon: '🌸', text: 'The way you laugh makes the whole world feel brighter' },
    { icon: '🧠', text: 'Your intelligence and wit never cease to amaze me' },
    { icon: '💝', text: 'The kindness in your heart is unlike anything I have ever known' },
    { icon: '🌙', text: 'You make ordinary moments feel like magic' },
    { icon: '🎵', text: 'The way you sing when you think no one is listening' },
    { icon: '🌹', text: 'How deeply you care for the people you love' },
    { icon: '✨', text: 'Your eyes tell a thousand stories I never want to stop reading' },
    { icon: '🦋', text: 'The way you make me feel like home, no matter where we are' },
    { icon: '💫', text: 'You believe in me even when I doubt myself' },
    { icon: '❤️', text: 'Simply because you are you — and that is enough' },
  ],

  // Our story timeline events
  timelineEvents: [
    { emoji: '💬', date: 'The very beginning', title: 'First Talk', desc: 'The message that started it all — I had no idea my life was about to change forever.' },
    { emoji: '😊', date: 'Shortly after', title: 'First Smile', desc: 'You smiled and I forgot every word I had ever known.' },
    { emoji: '📞', date: 'Growing closer', title: 'First Call', desc: 'We talked for hours and I never wanted to hang up.' },
    { emoji: '🌸', date: 'A beautiful day', title: 'First Meet', desc: 'Seeing you in person for the first time — you were even more beautiful.' },
    { emoji: '🤳', date: 'A precious moment', title: 'First Selfie', desc: 'That photo still makes me smile every time I look at it.' },
    { emoji: '🌧️', date: 'A tough moment', title: 'First Fight', desc: 'Even through the storm, we came back stronger. That is when I knew.' },
    { emoji: '🎁', date: 'A celebration', title: 'First Gift', desc: 'Watching your eyes light up was the best gift I could have received.' },
    { emoji: '⭐', date: 'Unforgettable', title: 'Favourite Memory', desc: 'The moment I knew I never wanted to be anywhere else but with you.' },
    { emoji: '🎂', date: 'Today', title: 'Your Birthday', desc: 'Another year around the sun, and I love you more than ever. Happy Birthday!' },
  ],

  // Love letter text
  loveLetter: `Every single day, I find new reasons to be grateful that you exist in my world. Since the moment you came into my life, everything has felt more colourful, more meaningful, and more beautiful.

On this special day, I want you to know that you are not just my girlfriend — you are my best friend, my confidant, my safe place. The way you love is unlike anything I have ever experienced, and I am the luckiest person alive to be loved by you.

You deserve every good thing this world has to offer. You deserve laughter that echoes, adventures that steal your breath, and love that feels like coming home.

Today is YOUR day. Every moment of it. And I promise to spend the rest of my days making sure you feel as special as you are.

I love you. More than words. More than stars. More than time itself.`,

  // Gift message after opening
  giftMessage: 'You are my greatest gift ✨\nHappy Birthday, My Love! 🎂',

  // Gallery placeholder count (before you add real photos)
  galleryPlaceholderCount: 9,
};

// ============================================
// GLOBAL STATE
// ============================================
const state = {
  mainVisible: false,
  musicStarted: false,
  envelopeOpened: false,
  currentLoveReason: 0,
  loveReasonAnimating: false,
  giftOpened: false,
  midnightTriggered: false,
  activeSection: 0,
  sections: [],
  cursorX: 0,
  cursorY: 0,
};

// ============================================
// DOM HELPERS
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function show(el) { el.style.display = ''; }
function hide(el) { el.style.display = 'none'; }

// ============================================
// PRELOADER
// ============================================
function runPreloader() {
  const bar = $('#preloader-bar');
  const percent = $('#preloader-percent');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(finishPreloader, 400);
    }
    bar.style.width = `${progress}%`;
    percent.textContent = `${Math.round(progress)}%`;
  }, 150);
}

function finishPreloader() {
  gsap.to('#preloader', {
    opacity: 0,
    scale: 1.05,
    duration: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      $('#preloader').style.display = 'none';
      showWelcomeScreen();
    }
  });
}

// ============================================
// WELCOME SCREEN
// ============================================
function showWelcomeScreen() {
  createStars('welcome-stars', 120);
  createFloatingHearts('floating-hearts-bg');
  runWelcomeTyping();
}

function runWelcomeTyping() {
  // Big heading first
  const bigText = $('#welcome-big-text');
  bigText.style.opacity = '0';
  gsap.to(bigText, { opacity: 1, duration: 0.8, delay: 0.4 });
  bigText.textContent = `Happy Birthday ${CONFIG.hername}! ❤️`;

  // Then typed subtitle
  setTimeout(() => {
    new Typed('#typed-output', {
      strings: [
        'Someone very special has a birthday today...',
        `That someone is you, ${CONFIG.hername}...`,
        'This surprise was made just for you 💝'
      ],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 1800,
      loop: false,
      showCursor: true,
      onComplete: () => {
        gsap.to('#start-btn', { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' });
      }
    });
  }, 900);

  // Initially hide button
  gsap.set('#start-btn', { opacity: 0, y: 30 });
  $('#start-btn').style.opacity = '0';
}

// ============================================
// START BUTTON → Permission → Main
// ============================================
$('#start-btn').addEventListener('click', () => {
  // Unlock audio context on first interaction
  unlockAudio();

  // Fade out welcome, show permission modal
  gsap.to('#welcome-screen', {
    opacity: 0,
    scale: 1.05,
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: () => {
      $('#welcome-screen').style.display = 'none';
      showPermissionModal();
    }
  });
});

// ============================================
// PERMISSION MODAL
// ============================================
function showPermissionModal() {
  $('#permission-modal').classList.add('active');
}

function hidePermissionModal() {
  $('#permission-modal').classList.remove('active');
  launchMainContent();
}

$('#allow-notifications-btn').addEventListener('click', () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        scheduleNotification();
      }
    });
  }
  hidePermissionModal();
});

$('#skip-notifications-btn').addEventListener('click', hidePermissionModal);

function scheduleNotification() {
  // Schedule a notification if the browser supports it
  if (Notification.permission === 'granted') {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const delay = midnight - now;
    if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        new Notification(`🎂 Happy Birthday ${CONFIG.hername}! ❤️`, {
          body: 'Your special midnight surprise is here! Open the app now! 🎉',
          icon: 'assets/icons/icon-192.png',
        });
      }, delay);
    }
  }
}

// ============================================
// MAIN CONTENT LAUNCH
// ============================================
function launchMainContent() {
  const main = $('#main-content');
  main.style.display = 'block';
  main.style.opacity = '0';

  // Start background effects
  startPetalCanvas();
  initHeartCursorCanvas();
  buildNavDots();

  // Fade in
  gsap.to(main, { opacity: 1, duration: 1, ease: 'power2.out' });

  // Show music player
  setTimeout(() => {
    $('#music-player').classList.add('visible');
    autoStartMusic();
  }, 500);

  // AOS
  AOS.init({
    duration: 900,
    once: true,
    easing: 'ease-out-cubic',
    offset: 80,
  });

  // Build sections
  buildTimeline();
  buildGallery();
  buildLoveReasons();

  // Start love counter
  startLoveCounter();

  // Love meter
  setupLoveMeter();

  // Section observer
  setupSectionObserver();

  // Love letter
  setupEnvelope();

  // Gift
  setupGift();

  // Final question
  setupFinalQuestion();

  // Ending section
  createStars('ending-stars', 100);
  createFloatingHearts('ending-hearts-bg');

  // Midnight detection
  startMidnightDetection();

  state.mainVisible = true;
}

// ============================================
// STAR CREATION
// ============================================
function createStars(containerId, count) {
  const container = $(`#${containerId}`);
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --dur: ${2 + Math.random() * 4}s;
      --delay: ${Math.random() * 5}s;
    `;
    container.appendChild(star);
  }
}

// ============================================
// FLOATING HEARTS
// ============================================
function createFloatingHearts(containerId) {
  const container = $(`#${containerId}`);
  if (!container) return;
  container.innerHTML = '';
  const hearts = ['❤️', '💕', '💖', '💗', '💝', '🌹', '💫', '✨'];
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.className = 'float-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.cssText = `
      left: ${Math.random() * 100}%;
      --size: ${0.8 + Math.random() * 1.5}rem;
      --dur: ${6 + Math.random() * 8}s;
      --delay: ${Math.random() * 10}s;
      --drift: ${(Math.random() - 0.5) * 80}px;
    `;
    container.appendChild(heart);
  }
}

// ============================================
// NAVIGATION DOTS
// ============================================
const NAV_SECTIONS = [
  { id: 'countdown-section', label: 'Countdown' },
  { id: 'our-story', label: 'Our Story' },
  { id: 'photo-gallery', label: 'Gallery' },
  { id: 'video-section', label: 'Video' },
  { id: 'love-letter', label: 'Letter' },
  { id: 'why-i-love-you', label: 'Love' },
  { id: 'love-counter', label: 'Counter' },
  { id: 'love-meter', label: 'Meter' },
  { id: 'heart-rain-section', label: 'Hearts' },
  { id: 'surprise-gift', label: 'Gift' },
  { id: 'final-message', label: 'Message' },
  { id: 'final-question', label: 'Question' },
  { id: 'ending-section', label: 'Ending' },
];

function buildNavDots() {
  const nav = $('#nav-dots');
  if (!nav) return;
  nav.innerHTML = '';
  NAV_SECTIONS.forEach((sec, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', sec.label);
    dot.setAttribute('title', sec.label);
    dot.addEventListener('click', () => {
      const target = $(`#${sec.id}`);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
    nav.appendChild(dot);
  });
}

function setupSectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const idx = NAV_SECTIONS.findIndex(s => s.id === id);
        if (idx !== -1) {
          $$('.nav-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
          // Trigger section-specific animations
          onSectionEnter(id);
        }
      }
    });
  }, { threshold: 0.4 });

  NAV_SECTIONS.forEach(sec => {
    const el = $(`#${sec.id}`);
    if (el) observer.observe(el);
  });

  // Also observe timeline items
  const tiObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  $$('.timeline-item').forEach(el => tiObserver.observe(el));
}

function onSectionEnter(id) {
  switch (id) {
    case 'love-meter':
      triggerLoveMeter();
      break;
    case 'heart-rain-section':
      startHeartRain();
      break;
  }
}

// ============================================
// CURSOR
// ============================================
const cursor = $('#cursor');
const cursorDot = $('#cursorDot');

document.addEventListener('mousemove', (e) => {
  state.cursorX = e.clientX;
  state.cursorY = e.clientY;
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
});

document.addEventListener('mousedown', () => {
  cursor.style.transform = 'translate(-50%,-50%) scale(0.8)';
  cursor.style.background = 'rgba(228,62,140,0.3)';
});
document.addEventListener('mouseup', () => {
  cursor.style.transform = 'translate(-50%,-50%) scale(1)';
  cursor.style.background = 'transparent';
});

// Hover effect on interactive elements
document.addEventListener('mouseover', (e) => {
  if (e.target.closest('button, a, [role="button"], input')) {
    cursor.style.width = '40px';
    cursor.style.height = '40px';
    cursor.style.borderColor = 'var(--gold)';
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest('button, a, [role="button"], input')) {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderColor = 'var(--pink)';
  }
});

// ============================================
// HEART CURSOR CANVAS (trails)
// ============================================
let heartCursorCtx, heartCursorCanvas;
const heartTrails = [];

function initHeartCursorCanvas() {
  heartCursorCanvas = $('#heart-cursor-canvas');
  heartCursorCtx = heartCursorCanvas.getContext('2d');
  resizeHeartCanvas();
  window.addEventListener('resize', resizeHeartCanvas);

  document.addEventListener('mousemove', spawnCursorHeart);
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    spawnCursorHeart({ clientX: t.clientX, clientY: t.clientY });
  }, { passive: true });

  requestAnimationFrame(animateHeartTrails);
}

function resizeHeartCanvas() {
  if (!heartCursorCanvas) return;
  heartCursorCanvas.width = window.innerWidth;
  heartCursorCanvas.height = window.innerHeight;
}

function spawnCursorHeart(e) {
  if (Math.random() > 0.25) return; // throttle
  const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '✨'];
  heartTrails.push({
    x: e.clientX,
    y: e.clientY,
    size: Math.random() * 16 + 10,
    opacity: 0.9,
    vy: -(Math.random() * 2 + 0.5),
    vx: (Math.random() - 0.5) * 1.5,
    char: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
    life: 1,
  });
}

function animateHeartTrails() {
  if (!heartCursorCtx) return;
  heartCursorCtx.clearRect(0, 0, heartCursorCanvas.width, heartCursorCanvas.height);

  for (let i = heartTrails.length - 1; i >= 0; i--) {
    const h = heartTrails[i];
    h.x += h.vx;
    h.y += h.vy;
    h.life -= 0.02;
    h.vy -= 0.05; // float up faster

    if (h.life <= 0) {
      heartTrails.splice(i, 1);
      continue;
    }

    heartCursorCtx.globalAlpha = h.life;
    heartCursorCtx.font = `${h.size * h.life + 5}px serif`;
    heartCursorCtx.fillText(h.char, h.x, h.y);
  }
  heartCursorCtx.globalAlpha = 1;
  requestAnimationFrame(animateHeartTrails);
}

// ============================================
// HEART RAIN (interactive section)
// ============================================
let heartRainActive = false;
let heartRainHearts = [];
let heartRainSection;

function startHeartRain() {
  if (heartRainActive) return;
  heartRainActive = true;
  heartRainSection = $('#heart-rain-section');

  heartRainSection.addEventListener('mousemove', rainOnMove);
  heartRainSection.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    rainOnMove({ clientX: t.clientX, clientY: t.clientY });
  }, { passive: true });
}

function rainOnMove(e) {
  for (let i = 0; i < 3; i++) {
    spawnCursorHeart(e);
  }
}

// ============================================
// LOVE LETTER / ENVELOPE
// ============================================
function setupEnvelope() {
  const container = $('#envelope-container');
  const envelope = $('#envelope');
  const letterContent = $('#letter-content');
  const hint = $('#envelope-hint');

  function openEnvelope() {
    if (state.envelopeOpened) return;
    state.envelopeOpened = true;
    envelope.classList.add('open');
    hint.style.display = 'none';
    setTimeout(() => {
      letterContent.classList.add('revealed');
      // Type the letter
      typeLetterContent();
    }, 1000);
  }

  container.addEventListener('click', openEnvelope);
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openEnvelope();
  });
}

function typeLetterContent() {
  const el = $('#letter-typed');
  el.innerHTML = '';
  const paragraphs = CONFIG.loveLetter.trim().split('\n\n');
  let pIdx = 0;

  function typeParagraph(paraText, callback) {
    const p = document.createElement('p');
    p.style.marginBottom = '15px';
    el.appendChild(p);
    let i = 0;
    const interval = setInterval(() => {
      p.textContent = paraText.slice(0, ++i);
      if (i >= paraText.length) {
        clearInterval(interval);
        setTimeout(callback, 300);
      }
    }, 18);
  }

  function nextPara() {
    if (pIdx < paragraphs.length) {
      typeParagraph(paragraphs[pIdx++], nextPara);
    }
  }
  nextPara();
}

// ============================================
// WHY I LOVE YOU — REVEAL CARDS
// ============================================
function buildLoveReasons() {
  const container = $('#love-reason-cards');
  const counter = $('#love-reason-counter');
  if (!container) return;

  CONFIG.loveReasons.forEach((reason, i) => {
    const card = document.createElement('div');
    card.className = `love-reason-card glass ${i === 0 ? 'active' : ''}`;
    card.style.background = i % 2 === 0
      ? 'rgba(196,30,90,0.1)'
      : 'rgba(106,13,173,0.1)';
    card.innerHTML = `
      <div class="love-reason-number">${String(i + 1).padStart(2, '0')}</div>
      <div class="love-reason-icon">${reason.icon}</div>
      <div class="love-reason-text">${reason.text}</div>
    `;
    container.appendChild(card);
  });

  const cards = $$('.love-reason-card');

  function showReason(idx) {
    if (state.loveReasonAnimating) return;
    state.loveReasonAnimating = true;

    cards.forEach(c => c.classList.remove('active'));

    setTimeout(() => {
      state.currentLoveReason = (idx + CONFIG.loveReasons.length) % CONFIG.loveReasons.length;
      cards[state.currentLoveReason].classList.add('active');
      counter.textContent = `${state.currentLoveReason + 1} / ${CONFIG.loveReasons.length}`;
      state.loveReasonAnimating = false;
      createLocalConfetti();
    }, 300);
  }

  container.addEventListener('click', () => {
    showReason(state.currentLoveReason + 1);
  });
}

function createLocalConfetti() {
  confetti({
    particleCount: 30,
    spread: 60,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#c41e5a', '#ffd700', '#9b59b6', '#ff6b9d'],
    scalar: 0.8,
    gravity: 1.5,
    drift: 0,
  });
}

// ============================================
// LOVE COUNTER
// ============================================
function startLoveCounter() {
  const start = new Date(CONFIG.loveStartDate);

  function update() {
    const now = new Date();
    const diff = now - start;
    if (diff < 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = $('#love-days');
    const hEl = $('#love-hours');
    const mEl = $('#love-minutes');
    const sEl = $('#love-seconds');

    if (dEl) dEl.textContent = days.toLocaleString();
    if (hEl) hEl.textContent = hours;
    if (mEl) mEl.textContent = minutes;
    if (sEl) sEl.textContent = seconds;
  }

  update();
  setInterval(update, 1000);
}

// ============================================
// LOVE METER
// ============================================
let loveMeterStarted = false;

function setupLoveMeter() {
  // Triggered when section enters viewport
}

function triggerLoveMeter() {
  if (loveMeterStarted) return;
  loveMeterStarted = true;

  const bar = $('#love-meter-bar');
  const percent = $('#love-meter-percent');
  const label = $('#love-meter-label');
  if (!bar) return;

  const steps = [0, 10, 30, 50, 80, 100];
  const labels = ['Measuring...', 'Growing...', 'Warming up...', 'Getting serious...', 'Almost infinite...', '∞'];
  let step = 0;

  function nextStep() {
    if (step >= steps.length) {
      bar.style.width = '100%';
      percent.textContent = '∞';
      label.classList.add('show');
      // Final confetti burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#c41e5a', '#ffd700', '#9b59b6', '#ff6b9d', '#ffffff'],
        });
      }, 500);
      return;
    }
    const target = steps[step];
    bar.style.width = `${target}%`;
    percent.textContent = step < steps.length - 1 ? `${target}%` : '∞';
    step++;
    setTimeout(nextStep, 1000);
  }

  setTimeout(nextStep, 600);
}

// ============================================
// SURPRISE GIFT
// ============================================
function setupGift() {
  const giftBox = $('#gift-box');
  const giftHint = $('#gift-hint');
  const giftMessage = $('#gift-message');
  if (!giftBox) return;

  function openGift() {
    if (state.giftOpened) return;
    state.giftOpened = true;

    giftBox.classList.add('exploded');
    giftHint.style.display = 'none';

    // Confetti explosion
    const end = Date.now() + 2000;
    const colors = ['#c41e5a', '#ffd700', '#9b59b6', '#ff6b9d', '#ffffff', '#dc143c'];

    (function burst() {
      confetti({
        particleCount: 15,
        angle: Math.random() * 360,
        spread: 60,
        origin: { x: 0.5, y: 0.5 },
        colors,
        scalar: 1.2,
      });
      if (Date.now() < end) requestAnimationFrame(burst);
    })();

    setTimeout(() => {
      giftMessage.classList.add('show');
    }, 800);
  }

  giftBox.addEventListener('click', openGift);
  giftBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openGift();
  });
}

// ============================================
// FINAL QUESTION (No button runs away)
// ============================================
function setupFinalQuestion() {
  const btnYes = $('#btn-yes');
  const btnNo = $('#btn-no');
  const result = $('#question-result');
  const buttonsWrap = $('#question-buttons');
  if (!btnYes || !btnNo) return;

  // Position the NO button
  const section = $('#final-question');
  let noMoves = 0;

  function moveNoButton() {
    noMoves++;
    const w = section ? section.clientWidth : window.innerWidth;
    const h = section ? section.clientHeight : window.innerHeight;
    const rx = (Math.random() - 0.5) * Math.min(w * 0.7, 400);
    const ry = (Math.random() - 0.5) * Math.min(h * 0.5, 250);
    btnNo.style.position = 'fixed';
    btnNo.style.left = `${50 + (Math.random() - 0.5) * 70}vw`;
    btnNo.style.top = `${30 + (Math.random() - 0.5) * 40}vh`;
    btnNo.style.zIndex = '9999';

    if (noMoves > 5) {
      // Make it very tiny and hide
      btnNo.style.transform = 'scale(0.2)';
      btnNo.style.opacity = '0.2';
    }
  }

  btnNo.addEventListener('mouseover', moveNoButton);
  btnNo.addEventListener('touchstart', moveNoButton, { passive: true });

  btnYes.addEventListener('click', () => {
    btnNo.style.display = 'none';
    btnYes.style.display = 'none';

    result.classList.add('show');

    // Mega celebration
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ['#c41e5a', '#ffd700', '#9b59b6', '#ff6b9d', '#ffffff', '#dc143c'];

    (function celebrationBurst() {
      confetti({ particleCount: 20, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
      confetti({ particleCount: 20, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
      if (Date.now() < end) requestAnimationFrame(celebrationBurst);
    })();
  });
}

// ============================================
// VIDEO SECTION
// ============================================
const videoPlaceholder = $('#video-placeholder');
const ourVideo = $('#our-video');

if (videoPlaceholder && ourVideo) {
  videoPlaceholder.addEventListener('click', () => {
    // Try to load the actual video
    ourVideo.style.display = 'block';
    videoPlaceholder.style.display = 'none';
    ourVideo.play().catch(() => {});
  });

  ourVideo.addEventListener('play', () => {
    window.dispatchEvent(new CustomEvent('videoplaying', { detail: true }));
  });

  ourVideo.addEventListener('pause', () => {
    window.dispatchEvent(new CustomEvent('videoplaying', { detail: false }));
  });

  ourVideo.addEventListener('ended', () => {
    window.dispatchEvent(new CustomEvent('videoplaying', { detail: false }));
  });
}

// ============================================
// AUDIO UNLOCK
// ============================================
function unlockAudio() {
  // Create a silent audio context unlock
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) {
    const ctx = new AudioContext();
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
    ctx.resume().catch(() => {});
  }
}

// ============================================
// AUTO-START MUSIC (after interaction)
// ============================================
function autoStartMusic() {
  if (!state.musicStarted) {
    // Don't auto-play without user gesture; music.js handles it
  }
}

// ============================================
// INIT ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Start preloader immediately
  runPreloader();
  // Check backend status
  checkBackendStatus();
  // Setup reply form submit listener
  setupReplyForm();
});

// ============================================
// BACKEND API INTEGRATION
// ============================================
const API_BASE = 'https://birthday-swue.onrender.com';
let API_ONLINE = false;

async function checkBackendStatus() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      API_ONLINE = true;
      console.log('✅ Connected to backend API!');
      await loadLiveBackendData();
      trackVisitor();
    }
  } catch (err) {
    console.log('ℹ️ Server offline. Using local static CONFIG.');
  }
}

async function loadLiveBackendData() {
  try {
    // 1. Load settings
    const settingsRes = await fetch(`${API_BASE}/api/settings`);
    if (settingsRes.ok) {
      const data = await settingsRes.json();
      if (data.settings) {
        const s = data.settings;
        if (s.hername) CONFIG.hername = s.hername;
        if (s.loveStartDate) CONFIG.loveStartDate = s.loveStartDate;
        if (s.birthdayDate) {
          CONFIG.birthdayDate = s.birthdayDate;
        }
      }
    }

    // 2. Load love letter
    const letterRes = await fetch(`${API_BASE}/api/letter`);
    if (letterRes.ok) {
      const data = await letterRes.json();
      if (data.letter) {
        if (data.letter.title) {
          const titleEl = document.querySelector('#love-letter .section-title');
          if (titleEl) titleEl.textContent = data.letter.title;
        }
        if (data.letter.message) CONFIG.loveLetter = data.letter.message;
      }
    }

    // 3. Load timeline events
    const timelineRes = await fetch(`${API_BASE}/api/timeline`);
    if (timelineRes.ok) {
      const data = await timelineRes.json();
      if (data.events && data.events.length > 0) {
        CONFIG.timelineEvents = data.events.map(ev => ({
          emoji: ev.emoji || '❤️',
          date: ev.date || '',
          title: ev.title,
          desc: ev.description,
          imageUrl: ev.imageUrl || ''
        }));
      }
    }

    // 4. Load gallery photos
    const galleryRes = await fetch(`${API_BASE}/api/gallery?limit=100`);
    if (galleryRes.ok) {
      const data = await galleryRes.json();
      if (data.data && data.data.length > 0) {
        GALLERY_PHOTOS.length = 0;
        data.data.forEach(item => {
          GALLERY_PHOTOS.push({
            src: item.imageUrl,
            caption: item.caption || ''
          });
        });
      }
    }

    // 5. Load custom background music
    const musicRes = await fetch(`${API_BASE}/api/music`);
    if (musicRes.ok) {
      const data = await musicRes.json();
      if (data.music && data.music.musicUrl) {
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) {
          bgMusic.src = data.music.musicUrl;
          if (data.music.title) {
            const titleEl = document.getElementById('music-title');
            if (titleEl) titleEl.textContent = data.music.title;
          }
        }
      }
    }

    // 6. Load custom voice message
    const voiceRes = await fetch(`${API_BASE}/api/voice`);
    if (voiceRes.ok) {
      const data = await voiceRes.json();
      if (data.voice && data.voice.audioUrl) {
        const voiceAudio = document.getElementById('voice-audio');
        if (voiceAudio) {
          voiceAudio.src = data.voice.audioUrl;
        }
      }
    }

    // 7. Load custom video
    const videoRes = await fetch(`${API_BASE}/api/videos`);
    if (videoRes.ok) {
      const data = await videoRes.json();
      if (data.videos && data.videos.length > 0) {
        const ourVideo = document.getElementById('our-video');
        if (ourVideo) {
          ourVideo.src = data.videos[0].videoUrl;
        }
      }
    }
  } catch (err) {
    console.error('Error loading live data from backend:', err);
  }
}

async function trackVisitor() {
  try {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const referrer = document.referrer;
    const browser = getBrowserName();
    const os = getOSName();
    const device = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

    await fetch(`${API_BASE}/api/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device,
        browser,
        os,
        screenWidth,
        screenHeight,
        referrer,
        sessionId: getSessionId()
      })
    });
  } catch (e) {
    console.log('Visitor tracking error:', e);
  }
}

function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('MSIE') || ua.includes('Trident')) return 'IE';
  return 'Unknown';
}

function getOSName() {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Linux';
}

function getSessionId() {
  let id = sessionStorage.getItem('visitor_session');
  if (!id) {
    id = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('visitor_session', id);
  }
  return id;
}

function setupReplyForm() {
  const form = document.getElementById('reply-form');
  const statusEl = document.getElementById('reply-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reply-name').value;
    const message = document.getElementById('reply-message').value;

    statusEl.textContent = '⏳ Sending with love...';
    statusEl.className = 'text-xs text-yellow-400 text-center mt-3';
    statusEl.classList.remove('hidden');

    try {
      const res = await fetch(`${API_BASE}/api/email/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromName: name,
          message: message,
          subject: `❤️ Birthday Reply from ${name}`
        })
      });
      const data = await res.json();
      if (data.success) {
        statusEl.textContent = '✅ Sent successfully! Thank you my love ❤️';
        statusEl.className = 'text-xs text-green-400 text-center mt-3';
        form.reset();
        
        // Trigger a sweet burst of heart confetti on success!
        if (typeof confetti !== 'undefined') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#c41e5a', '#ff69b4', '#ff1493', '#ffd700']
          });
        }
      } else {
        statusEl.textContent = data.message || 'Failed to send. Try again.';
        statusEl.className = 'text-xs text-red-400 text-center mt-3';
      }
    } catch (err) {
      statusEl.textContent = 'Connection error. Check SMTP settings.';
      statusEl.className = 'text-xs text-red-400 text-center mt-3';
    }
    setTimeout(() => statusEl.classList.add('hidden'), 5000);
  });
}

import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// Detect mobile/low-end device once at module level
const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  || window.innerWidth < 768;

// Cap device pixel ratio to avoid massive canvas on hi-DPI screens
const DPR = Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1 : 2);

export default function CanvasLayers({ fireworksActive = false, balloonsActive = false }) {
  const fireworksIntervalRef = useRef(null);

  // ── PETALS CANVAS ────────────────────────────────────────────────────
  useEffect(() => {
    const petalCanvas = document.getElementById('canvas-petals');
    if (!petalCanvas) return;
    const petalCtx = petalCanvas.getContext('2d');

    // Fewer petals on mobile to keep frame-time low
    const MAX_PETALS = IS_MOBILE ? 25 : 45;

    const PETAL_COLORS = [
      'rgba(220, 20, 60, 0.7)',
      'rgba(196, 30, 90, 0.6)',
      'rgba(255, 107, 157, 0.65)',
      'rgba(228, 62, 140, 0.6)',
      'rgba(255, 182, 193, 0.5)',
      'rgba(219, 112, 147, 0.7)',
    ];

    let petals = [];
    let petalAnimId = null;
    let resizeTimer = null;

    const setCanvasSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Physical pixels with DPR cap — avoids needlessly large canvas on Retina
      petalCanvas.width  = w * DPR;
      petalCanvas.height = h * DPR;
      // CSS size stays 100vw / 100vh (via style.css)
      petalCtx.scale(DPR, DPR);
    };

    setCanvasSize();

    // Debounce resize so it doesn't thrash every pixel
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setCanvasSize, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const spawnPetal = (fromTop = false) => {
      const w = petalCanvas.width / DPR;
      const h = petalCanvas.height / DPR;
      const size = Math.random() * 10 + 5;
      petals.push({
        x:             Math.random() * w,
        y:             fromTop ? Math.random() * -200 : -size * 2,
        size,
        vy:            Math.random() * 1.2 + 0.4,
        vx:            (Math.random() - 0.5) * 0.9,
        rotation:      Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2.5,
        opacity:       Math.random() * 0.4 + 0.4,
        color:         PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        swing:         Math.random() * Math.PI * 2,
        swingSpeed:    Math.random() * 0.025 + 0.008,
        swingAmp:      Math.random() * 35 + 15,
        type:          Math.floor(Math.random() * 3),
      });
    };

    // Stagger initial spawn over 3s (100ms × MAX_PETALS) to avoid frame spike
    for (let i = 0; i < MAX_PETALS; i++) {
      setTimeout(() => spawnPetal(true), i * (IS_MOBILE ? 180 : 100));
    }

    // Pre-allocate a reusable Path2D per petal type? No — they have dynamic sizes.
    // Instead, batch save/restore calls and avoid redundant state changes.
    const drawPetal = (ctx, p) => {
      const s = p.size;
      ctx.beginPath();
      if (p.type === 0) {
        ctx.ellipse(0, 0, s * 0.5, s, 0, 0, Math.PI * 2);
      } else if (p.type === 1) {
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.6, -s * 0.3, s * 0.6, s * 0.3, 0, s * 0.5);
        ctx.bezierCurveTo(-s * 0.6, s * 0.3, -s * 0.6, -s * 0.3, 0, -s);
      } else {
        const hs = s * 0.35;
        ctx.moveTo(0, hs * 0.5);
        ctx.bezierCurveTo(-hs * 2.5, -hs, -hs * 2.5, -hs * 2.5, 0, -hs * 1.5);
        ctx.bezierCurveTo(hs * 2.5, -hs * 2.5, hs * 2.5, -hs, 0, hs * 0.5);
      }
      ctx.fillStyle = p.color;
      ctx.fill();
    };

    const W = () => petalCanvas.width  / DPR;
    const H = () => petalCanvas.height / DPR;

    const animatePetals = () => {
      const w = W(), h = H();
      petalCtx.clearRect(0, 0, w, h);

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.y    += p.vy;
        p.swing += p.swingSpeed;
        p.x    += Math.sin(p.swing) * (p.swingAmp * 0.018) + p.vx;
        p.rotation += p.rotationSpeed;

        if (p.y > h + 50) {
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
      petalAnimId = requestAnimationFrame(animatePetals);
    };

    animatePetals();

    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      if (petalAnimId) cancelAnimationFrame(petalAnimId);
    };
  }, []); // ← runs once, never re-created

  // ── HEART CURSOR CANVAS ───────────────────────────────────────────────
  useEffect(() => {
    const heartCanvas = document.getElementById('heart-cursor-canvas');
    if (!heartCanvas) return;
    const hCtx = heartCanvas.getContext('2d');

    let heartAnimId = null;
    let resizeTimer = null;

    const setCanvasSize = () => {
      heartCanvas.width  = window.innerWidth  * DPR;
      heartCanvas.height = window.innerHeight * DPR;
      hCtx.scale(DPR, DPR);
    };
    setCanvasSize();

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setCanvasSize, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    let hearts = [];
    // Fewer heart emoji types to reduce glyph cache misses
    const HEART_CHARS = ['♥', '♡', '✿', '❀', '✦'];
    // Mobile: longer spawn interval → fewer particles in flight
    const SPAWN_INTERVAL = IS_MOBILE ? 150 : 90;
    let lastSpawnTime = 0;

    const spawnHeart = (x, y) => {
      if (hearts.length > (IS_MOBILE ? 18 : 35)) return; // hard cap
      hearts.push({
        x,
        y,
        char:  HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
        size:  Math.random() * 14 + 10,
        life:  1,
        decay: Math.random() * 0.025 + 0.018,
        vy:    -(Math.random() * 1.8 + 0.8),
        vx:    (Math.random() - 0.5) * 1.5,
      });
    };

    const onMouseMove = (e) => {
      const now = Date.now();
      if (now - lastSpawnTime > SPAWN_INTERVAL) {
        spawnHeart(e.clientX, e.clientY);
        lastSpawnTime = now;
      }
    };

    const onTouch = (e) => {
      const now = Date.now();
      if (now - lastSpawnTime > SPAWN_INTERVAL) {
        const touch = e.touches[0];
        if (touch) spawnHeart(touch.clientX, touch.clientY);
        lastSpawnTime = now;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouch,     { passive: true });

    const W = () => heartCanvas.width  / DPR;
    const H = () => heartCanvas.height / DPR;

    // Cache font string to avoid string concat every frame per particle
    const animateHearts = () => {
      hCtx.clearRect(0, 0, W(), H());

      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y    += h.vy;
        h.x    += h.vx;
        h.life -= h.decay;

        if (h.life <= 0) { hearts.splice(i, 1); continue; }

        // Set font once per particle (not repeated redundantly)
        hCtx.globalAlpha = h.life;
        hCtx.font = `${h.size}px serif`;
        hCtx.fillStyle = `hsl(${340 + Math.random() * 30}, 80%, 70%)`;
        hCtx.fillText(h.char, h.x - h.size / 2, h.y);
      }
      hCtx.globalAlpha = 1;
      heartAnimId = requestAnimationFrame(animateHearts);
    };

    animateHearts();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouch);
      clearTimeout(resizeTimer);
      if (heartAnimId) cancelAnimationFrame(heartAnimId);
    };
  }, []); // ← runs once

  // ── FIREWORKS ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!fireworksActive) {
      if (fireworksIntervalRef.current) {
        clearInterval(fireworksIntervalRef.current);
        fireworksIntervalRef.current = null;
      }
      return;
    }

    const colors = ['#c41e5a', '#ffd700', '#6a0dad', '#ff6b9d', '#dc143c', '#ffe55c'];

    confetti({ particleCount: 120, spread: 120, origin: { y: 0.6 }, colors, startVelocity: 45 });

    // Slightly longer interval to reduce CPU during peak animation
    fireworksIntervalRef.current = setInterval(() => {
      confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0, y: 0.7 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
    }, 700);

    return () => {
      if (fireworksIntervalRef.current) {
        clearInterval(fireworksIntervalRef.current);
        fireworksIntervalRef.current = null;
      }
    };
  }, [fireworksActive]);

  // ── BALLOONS CANVAS ───────────────────────────────────────────────────
  useEffect(() => {
    const balloonCanvas = document.getElementById('canvas-balloons');
    if (!balloonCanvas || !balloonsActive) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    balloonCanvas.width  = w * DPR;
    balloonCanvas.height = h * DPR;
    const bCtx = balloonCanvas.getContext('2d');
    bCtx.scale(DPR, DPR);

    const BALLOON_COLORS = ['#c41e5a', '#ffd700', '#6a0dad', '#ff6b9d', '#dc143c'];
    const BALLOON_COUNT  = IS_MOBILE ? 8 : 15;

    let balloons = Array.from({ length: BALLOON_COUNT }, () => ({
      x:         Math.random() * w,
      y:         h + Math.random() * 200,
      vy:        -(Math.random() * 1.2 + 0.4),
      sway:      Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.018 + 0.008,
      swayAmp:   Math.random() * 28 + 12,
      radius:    Math.random() * 18 + 20,
      color:     BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      opacity:   Math.random() * 0.35 + 0.6,
    }));

    let balloonAnimId = null;
    const cW = () => balloonCanvas.width  / DPR;
    const cH = () => balloonCanvas.height / DPR;

    const animateBalloons = () => {
      const bw = cW(), bh = cH();
      bCtx.clearRect(0, 0, bw, bh);

      for (const b of balloons) {
        b.y    += b.vy;
        b.sway += b.swaySpeed;
        b.x    += Math.sin(b.sway) * (b.swayAmp * 0.025);

        if (b.y < -100) {
          b.y = bh + 50;
          b.x = Math.random() * bw;
        }

        bCtx.save();
        bCtx.globalAlpha = b.opacity;
        bCtx.beginPath();
        bCtx.ellipse(b.x, b.y, b.radius * 0.8, b.radius, 0, 0, Math.PI * 2);
        bCtx.fillStyle = b.color;
        bCtx.fill();

        // String
        bCtx.beginPath();
        bCtx.moveTo(b.x, b.y + b.radius);
        bCtx.lineTo(b.x + Math.sin(b.sway * 2) * 8, b.y + b.radius + 35);
        bCtx.strokeStyle = 'rgba(255,255,255,0.4)';
        bCtx.lineWidth = 1;
        bCtx.stroke();

        bCtx.restore();
      }

      balloonAnimId = requestAnimationFrame(animateBalloons);
    };

    animateBalloons();

    return () => { if (balloonAnimId) cancelAnimationFrame(balloonAnimId); };
  }, [balloonsActive]);

  return (
    <>
      <canvas id="canvas-petals" />
      <canvas id="canvas-fireworks" style={{ display: fireworksActive ? 'block' : 'none' }} />
      <canvas id="canvas-balloons" style={{ display: balloonsActive ? 'block' : 'none' }} />
      <canvas id="heart-cursor-canvas" />
    </>
  );
}

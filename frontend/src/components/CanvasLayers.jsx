import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function CanvasLayers({ fireworksActive = false, balloonsActive = false }) {
  const fireworksIntervalRef = useRef(null);

  // ── PETALS CANVAS ────────────────────────────────────────────────────
  useEffect(() => {
    const petalCanvas = document.getElementById('canvas-petals');
    if (!petalCanvas) return;
    const petalCtx = petalCanvas.getContext('2d');

    const PETAL_COLORS = [
      'rgba(220, 20, 60, 0.7)',
      'rgba(196, 30, 90, 0.6)',
      'rgba(255, 107, 157, 0.65)',
      'rgba(228, 62, 140, 0.6)',
      'rgba(255, 182, 193, 0.5)',
      'rgba(219, 112, 147, 0.7)',
    ];

    let petals = [];
    const MAX_PETALS = 60;

    const resizePetals = () => {
      petalCanvas.width = window.innerWidth;
      petalCanvas.height = window.innerHeight;
    };
    resizePetals();
    window.addEventListener('resize', resizePetals);

    const spawnPetal = (fromTop = false) => {
      const size = Math.random() * 12 + 6;
      petals.push({
        x: Math.random() * petalCanvas.width,
        y: fromTop ? Math.random() * -200 : -size * 2,
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
        type: Math.floor(Math.random() * 3),
      });
    };

    for (let i = 0; i < MAX_PETALS; i++) {
      setTimeout(() => spawnPetal(true), i * 100);
    }

    let petalAnimId;
    const drawPetal = (ctx, p) => {
      const s = p.size;
      switch (p.type) {
        case 0:
          ctx.beginPath();
          ctx.ellipse(0, 0, s * 0.5, s, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(-s * 0.12, -s * 0.3, s * 0.15, s * 0.35, -0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fill();
          break;
        case 1:
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.bezierCurveTo(s * 0.6, -s * 0.3, s * 0.6, s * 0.3, 0, s * 0.5);
          ctx.bezierCurveTo(-s * 0.6, s * 0.3, -s * 0.6, -s * 0.3, 0, -s);
          ctx.fillStyle = p.color;
          ctx.fill();
          break;
        case 2: {
          ctx.beginPath();
          const hs = s * 0.35;
          ctx.moveTo(0, hs * 0.5);
          ctx.bezierCurveTo(-hs * 2.5, -hs, -hs * 2.5, -hs * 2.5, 0, -hs * 1.5);
          ctx.bezierCurveTo(hs * 2.5, -hs * 2.5, hs * 2.5, -hs, 0, hs * 0.5);
          ctx.fillStyle = p.color;
          ctx.fill();
          break;
        }
        default:
          break;
      }
    };

    const animatePetals = () => {
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
      petalAnimId = requestAnimationFrame(animatePetals);
    };

    animatePetals();

    return () => {
      window.removeEventListener('resize', resizePetals);
      cancelAnimationFrame(petalAnimId);
    };
  }, []);

  // ── HEART CURSOR CANVAS ───────────────────────────────────────────────
  useEffect(() => {
    const heartCanvas = document.getElementById('heart-cursor-canvas');
    if (!heartCanvas) return;
    const hCtx = heartCanvas.getContext('2d');

    const resize = () => {
      heartCanvas.width = window.innerWidth;
      heartCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let hearts = [];
    const HEART_EMOJIS = ['❤️', '💕', '💖', '💗', '💝', '💓', '🌹'];

    const spawnHeart = (x, y) => {
      const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
      hearts.push({
        x,
        y,
        emoji,
        size: Math.random() * 20 + 15,
        opacity: 1,
        vy: -(Math.random() * 2 + 1),
        vx: (Math.random() - 0.5) * 2,
        life: 1,
        decay: Math.random() * 0.02 + 0.015,
        rotation: (Math.random() - 0.5) * 30,
      });
    };

    let lastSpawnTime = 0;
    const SPAWN_INTERVAL = 80; // ms between hearts on mouse move

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

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouch, { passive: true });

    let heartAnimId;
    const animateHearts = () => {
      hCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y += h.vy;
        h.x += h.vx;
        h.life -= h.decay;
        h.opacity = h.life;

        if (h.life <= 0) {
          hearts.splice(i, 1);
          continue;
        }

        hCtx.save();
        hCtx.globalAlpha = h.opacity;
        hCtx.font = `${h.size}px Arial`;
        hCtx.fillText(h.emoji, h.x - h.size / 2, h.y);
        hCtx.restore();
      }

      heartAnimId = requestAnimationFrame(animateHearts);
    };

    animateHearts();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouch);
      cancelAnimationFrame(heartAnimId);
    };
  }, []);

  // ── FIREWORKS (Confetti burst on midnight) ───────────────────────────
  useEffect(() => {
    if (!fireworksActive) {
      if (fireworksIntervalRef.current) {
        clearInterval(fireworksIntervalRef.current);
        fireworksIntervalRef.current = null;
      }
      return;
    }

    const colors = ['#c41e5a', '#ffd700', '#6a0dad', '#ff6b9d', '#dc143c', '#ffe55c'];

    // Initial burst
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.6 },
      colors,
    });

    // Continuous side cannons
    fireworksIntervalRef.current = setInterval(() => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
    }, 500);

    return () => {
      if (fireworksIntervalRef.current) {
        clearInterval(fireworksIntervalRef.current);
        fireworksIntervalRef.current = null;
      }
    };
  }, [fireworksActive]);

  // ── BALLOONS canvas (render floating balloons) ───────────────────────
  useEffect(() => {
    const balloonCanvas = document.getElementById('canvas-balloons');
    if (!balloonCanvas || !balloonsActive) return;

    balloonCanvas.width = window.innerWidth;
    balloonCanvas.height = window.innerHeight;
    const bCtx = balloonCanvas.getContext('2d');

    const BALLOON_COLORS = ['#c41e5a', '#ffd700', '#6a0dad', '#ff6b9d', '#dc143c'];
    let balloons = Array.from({ length: 15 }, () => ({
      x: Math.random() * balloonCanvas.width,
      y: balloonCanvas.height + Math.random() * 200,
      vy: -(Math.random() * 1.5 + 0.5),
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayAmp: Math.random() * 30 + 15,
      radius: Math.random() * 20 + 25,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      opacity: Math.random() * 0.4 + 0.6,
    }));

    let balloonAnimId;
    const animateBalloons = () => {
      bCtx.clearRect(0, 0, balloonCanvas.width, balloonCanvas.height);

      balloons.forEach((b) => {
        b.y += b.vy;
        b.sway += b.swaySpeed;
        b.x += Math.sin(b.sway) * (b.swayAmp * 0.03);

        if (b.y < -100) {
          b.y = balloonCanvas.height + 50;
          b.x = Math.random() * balloonCanvas.width;
        }

        bCtx.save();
        bCtx.globalAlpha = b.opacity;

        // Balloon body
        bCtx.beginPath();
        bCtx.ellipse(b.x, b.y, b.radius * 0.8, b.radius, 0, 0, Math.PI * 2);
        bCtx.fillStyle = b.color;
        bCtx.fill();

        // String
        bCtx.beginPath();
        bCtx.moveTo(b.x, b.y + b.radius);
        bCtx.lineTo(b.x + Math.sin(b.sway * 2) * 10, b.y + b.radius + 40);
        bCtx.strokeStyle = 'rgba(255,255,255,0.4)';
        bCtx.lineWidth = 1;
        bCtx.stroke();

        bCtx.restore();
      });

      balloonAnimId = requestAnimationFrame(animateBalloons);
    };

    animateBalloons();

    return () => cancelAnimationFrame(balloonAnimId);
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

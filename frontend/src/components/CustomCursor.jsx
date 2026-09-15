import React, { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const cursor    = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');

    if (!cursor || !cursorDot) return;

    // Use transform: translate3d() instead of left/top to keep on the
    // compositor thread and avoid triggering layout on every frame.
    // Prime both elements at origin so they're composited immediately.
    cursor.style.left    = '0px';
    cursor.style.top     = '0px';
    cursorDot.style.left = '0px';
    cursorDot.style.top  = '0px';

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let dotX   = mouseX;
    let dotY   = mouseY;
    let ringX  = mouseX;
    let ringY  = mouseY;

    // Track mouse position — stored in vars, not React state (no re-renders)
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let animationFrameId;
    const animate = () => {
      // Lerp the dot quickly (0.8), ring slowly (0.12) for trailing effect
      dotX  += (mouseX - dotX)  * 0.8;
      dotY  += (mouseY - dotY)  * 0.8;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      // translate3d → GPU composited, triggers NO layout recalculation
      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      cursor.style.transform    = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // runs exactly once — no re-creation on re-render

  return (
    <>
      <div className="cursor"     id="cursor"    />
      <div className="cursor-dot" id="cursorDot" />
    </>
  );
}

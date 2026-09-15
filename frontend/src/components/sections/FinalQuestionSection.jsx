import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function FinalQuestionSection() {
  const [answered, setAnswered] = useState(false);
  const [noPos, setNoPos] = useState({ top: null, left: null });

  const moveNoButton = () => {
    const maxX = Math.min(200, window.innerWidth / 4);
    const maxY = Math.min(200, window.innerHeight / 5);
    const randomX = Math.floor(Math.random() * maxX * 2) - maxX;
    const randomY = Math.floor(Math.random() * maxY * 2) - maxY;
    setNoPos({ top: `${randomY}px`, left: `${randomX}px` });
  };

  const handleYes = () => {
    setAnswered(true);

    // Celebrate with confetti!
    const end = Date.now() + 2000;
    const colors = ['#c41e5a', '#ffd700', '#6a0dad', '#ff6b9d', '#dc143c'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <section id="final-question" className="section" data-section="question" aria-label="Final Question">
      <div data-aos="fade-up" style={{ textAlign: 'center', width: '100%', padding: '20px', position: 'relative' }}>
        <div className="question-text">Will you stay with me forever?</div>
        <p className="question-subtitle">~ This is the only question that matters ~</p>

        {!answered ? (
          <div className="question-buttons" id="question-buttons">
            <button className="btn-yes" id="btn-yes" aria-label="Yes, I will stay with you forever" onClick={handleYes}>
              YES ❤️
            </button>
            <button
              className="btn-no"
              id="btn-no"
              aria-label="No (try to click it!)"
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              style={{
                top: noPos.top ? noPos.top : 'auto',
                left: noPos.left ? noPos.left : 'auto',
                position: noPos.top ? 'absolute' : 'relative',
              }}
            >
              Maybe... 😅
            </button>
          </div>
        ) : null}

        <div className={`question-result ${answered ? 'show' : ''}`} id="question-result">
          <div className="question-result-text">
            I knew it! 💍<br />Together Forever! ❤️
          </div>
        </div>
      </div>
    </section>
  );
}

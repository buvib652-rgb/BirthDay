import React, { useState, useEffect } from 'react';

export default function LoveLetterSection({ letterText = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedParagraphs, setDisplayedParagraphs] = useState([]);

  const toggleEnvelope = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    let openTimer;
    let charInterval;
    let paraTimer;

    if (isOpen) {
      setDisplayedParagraphs([]);
      openTimer = setTimeout(() => {
        const paragraphs = letterText.trim().split('\n\n');
        let pIdx = 0;

        function typeNextParagraph() {
          if (pIdx >= paragraphs.length) return;

          const currentFullText = paragraphs[pIdx];
          let cIdx = 0;

          charInterval = setInterval(() => {
            cIdx++;
            const currentSub = currentFullText.slice(0, cIdx);

            setDisplayedParagraphs((prev) => {
              const updated = [...prev];
              updated[pIdx] = currentSub;
              return updated;
            });

            if (cIdx >= currentFullText.length) {
              clearInterval(charInterval);
              pIdx++;
              paraTimer = setTimeout(typeNextParagraph, 300);
            }
          }, 18);
        }

        typeNextParagraph();
      }, 1000);
    } else {
      setDisplayedParagraphs([]);
    }

    return () => {
      clearTimeout(openTimer);
      clearInterval(charInterval);
      clearTimeout(paraTimer);
    };
  }, [isOpen, letterText]);

  return (
    <section id="love-letter" className="section" data-section="letter" aria-label="Love Letter">
      <h2 className="section-title" data-aos="fade-up">A Letter From My Heart</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">Click the envelope to read your letter 💌</p>

      <div
        className="envelope-container"
        data-aos="zoom-in"
        data-aos-delay="200"
        id="envelope-container"
        role="button"
        tabIndex={0}
        aria-label="Open your love letter"
        onClick={toggleEnvelope}
      >
        <div className={`envelope ${isOpen ? 'open' : ''}`} id="envelope">
          <div className="envelope-body"></div>
          <div className="envelope-flap"></div>
          <div className="envelope-left"></div>
          <div className="envelope-right"></div>
          <div className="envelope-seal">💝</div>

          <div className={`letter-content ${isOpen ? 'revealed' : ''}`} id="letter-content">
            <div className="letter-heading">My Dearest Love,</div>
            <div className="letter-body" id="letter-typed">
              {displayedParagraphs.map((para, idx) => (
                <p key={idx} style={{ marginBottom: '15px' }}>
                  {para}
                </p>
              ))}
            </div>
            <div className="letter-closing">Forever yours, ❤️</div>
          </div>
        </div>
      </div>
      <p className="envelope-hint" id="envelope-hint">
        {isOpen ? '~ tap envelope to close ~' : '~ tap to open ~'}
      </p>
    </section>
  );
}

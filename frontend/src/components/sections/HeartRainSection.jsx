import React from 'react';
import LoveHeartsIcon from '../icons/LoveHeartsIcon';

export default function HeartRainSection() {
  return (
    <section id="heart-rain-section" className="section" data-section="hearts" aria-label="Heart Rain">
      <h2 className="section-title" data-aos="fade-up">Heart Rain</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="50"></div>
      <p className="heart-rain-instruction" data-aos="fade-up" data-aos-delay="50">Move your mouse or touch the screen <LoveHeartsIcon size="1.1em" /></p>
    </section>
  );
}


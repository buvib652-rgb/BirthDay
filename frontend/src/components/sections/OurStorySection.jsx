import React, { useEffect, useRef } from 'react';
import SparkleIcon from '../icons/SparkleIcon';
import DynamicIcon from '../icons/DynamicIcon';

export default function OurStorySection({ events = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px',
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [events]);

  return (
    <section id="our-story" className="section" data-section="our-story" aria-label="Our Love Story">
      <h2 className="section-title" data-aos="fade-up">Our Love Story</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">Every chapter, written with love <SparkleIcon size="1em" /></p>

      <div className="timeline-container" id="timeline-container" ref={containerRef}>
        <div className="timeline-line"></div>

        {events.map((ev, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-card glass">
              <div className="timeline-card-date">{ev.date}</div>
              <div className="timeline-card-title">{ev.title}</div>
              <div className="timeline-card-desc">{ev.desc}</div>
            </div>
            <div className="timeline-dot">
              <span className="timeline-emoji"><DynamicIcon name={ev.emoji} size="1.3em" /></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


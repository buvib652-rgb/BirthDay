import React, { useRef, useState } from 'react';
import SparkleIcon from '../icons/SparkleIcon';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <section id="video-memory" className="section" data-section="video" aria-label="Video Memory">
      <h2 className="section-title" data-aos="fade-up">Our Video Memory</h2>
      <div className="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">A moment captured just for us <SparkleIcon size="1em" /></p>

      <div className="video-wrapper" data-aos="zoom-in" data-aos-delay="200">
        {!isPlaying ? (
          <div
            className="video-placeholder"
            id="video-placeholder"
            role="button"
            tabIndex={0}
            aria-label="Play video memory"
            onClick={handlePlayClick}
          >
            <div className="video-play-icon">
              <i className="fas fa-play"></i>
            </div>
            <p style={{ fontFamily: 'var(--font-elegant)', fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textAlign: 'center', padding: '0 20px' }}>
              Add your video to <strong>assets/videos/</strong> and update the src below
            </p>
          </div>
        ) : null}

        <video
          ref={videoRef}
          id="our-video"
          controls
          style={{ display: isPlaying ? 'block' : 'none', borderRadius: '20px' }}
          preload="none"
          aria-label="Our video memory"
        >
          <source src="/assets/videos/our-memory.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

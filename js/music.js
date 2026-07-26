/* ============================================
   music.js – Background Music Player
============================================ */

'use strict';

const musicState = {
  playing: false,
  volume: 0.5,
  pausedByVideo: false,
};

// ============================================
// INIT MUSIC PLAYER
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('music-toggle-btn');
  const musicIcon = document.getElementById('music-icon');
  const progressBar = document.getElementById('music-progress-bar');
  const volumeSlider = document.getElementById('music-volume');
  const progressWrap = document.getElementById('music-progress-wrap');

  if (!audio) return;

  // Set initial volume
  audio.volume = musicState.volume;

  // ============================================
  // PLAY / PAUSE
  // ============================================
  function playMusic() {
    audio.play().then(() => {
      musicState.playing = true;
      if (musicIcon) {
        musicIcon.classList.remove('fa-play');
        musicIcon.classList.add('fa-pause');
      }
      startVisualizerPulse();
    }).catch(err => {
      // Autoplay blocked — wait for interaction
    });
  }

  function pauseMusic() {
    audio.pause();
    musicState.playing = false;
    if (musicIcon) {
      musicIcon.classList.remove('fa-pause');
      musicIcon.classList.add('fa-play');
    }
  }

  // ============================================
  // TOGGLE BUTTON
  // ============================================
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (musicState.playing) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  // ============================================
  // AUTO-PLAY after start button
  // ============================================
  document.addEventListener('startMusicEvent', () => {
    playMusic();
  });

  // Try to play when main content loads
  window.addEventListener('mainContentLoaded', () => {
    setTimeout(playMusic, 800);
  });

  // ============================================
  // PROGRESS BAR UPDATE
  // ============================================
  audio.addEventListener('timeupdate', () => {
    if (!progressBar || !audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${pct}%`;
  });

  // Click on progress bar to seek
  if (progressWrap) {
    progressWrap.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = progressWrap.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });
  }

  // ============================================
  // VOLUME CONTROL
  // ============================================
  if (volumeSlider) {
    volumeSlider.value = musicState.volume;
    volumeSlider.addEventListener('input', () => {
      const vol = parseFloat(volumeSlider.value);
      audio.volume = vol;
      musicState.volume = vol;
    });
  }

  // ============================================
  // PAUSE WHEN VIDEO PLAYS
  // ============================================
  window.addEventListener('videoplaying', (e) => {
    if (e.detail) {
      // Video started — pause music
      if (musicState.playing) {
        pauseMusic();
        musicState.pausedByVideo = true;
      }
    } else {
      // Video ended/paused — resume music if we paused for video
      if (musicState.pausedByVideo) {
        musicState.pausedByVideo = false;
        playMusic();
      }
    }
  });

  // ============================================
  // DUCK VOLUME DURING VOICE
  // ============================================
  window.addEventListener('voicePlaying', (e) => {
    if (e.detail) {
      // Voice playing — reduce volume
      gsap.to({ vol: audio.volume }, {
        vol: 0.08,
        duration: 1,
        onUpdate: function() {
          audio.volume = this.targets()[0].vol;
        }
      });
    } else {
      // Voice ended — restore volume
      gsap.to({ vol: audio.volume }, {
        vol: musicState.volume,
        duration: 1.5,
        onUpdate: function() {
          audio.volume = this.targets()[0].vol;
        }
      });
    }
  });

  // ============================================
  // MUSIC PLAYER ICON PULSE (visualizer effect)
  // ============================================
  function startVisualizerPulse() {
    const icon = document.querySelector('.music-icon');
    if (!icon || !window.anime) return;

    anime({
      targets: icon,
      scale: [1, 1.15, 1],
      duration: 800,
      loop: true,
      easing: 'easeInOutSine',
    });
  }

  // ============================================
  // EXPOSE play/pause globally
  // ============================================
  window.musicPlayer = {
    play: playMusic,
    pause: pauseMusic,
    getAudio: () => audio,
    isPlaying: () => musicState.playing,
  };

  // ============================================
  // AUTO-ATTEMPT after first click anywhere
  // ============================================
  let autoPlayAttempted = false;
  const autoPlayHandler = () => {
    if (!autoPlayAttempted && !musicState.playing) {
      autoPlayAttempted = true;
      playMusic();
    }
    // Remove after first attempt
    document.removeEventListener('click', autoPlayHandler);
    document.removeEventListener('touchend', autoPlayHandler);
  };

  document.addEventListener('click', autoPlayHandler);
  document.addEventListener('touchend', autoPlayHandler);
});

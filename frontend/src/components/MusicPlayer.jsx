import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { fetchMusicTrack, getFullImageUrl } from '../services/api';

/**
 * MusicPlayer
 *
 * Exposes an imperative `play()` method via ref so the parent (SurpriseHome)
 * can call it synchronously inside a user-gesture click handler, satisfying
 * the browser's autoplay policy without relying on async callbacks.
 *
 * Props:
 *   isVisible  — controls CSS visibility class (does NOT start/stop audio)
 *   musicUrl   — optional pre-fetched audio URL from parent
 *   musicTitle — optional pre-fetched title from parent
 */
const MusicPlayer = forwardRef(function MusicPlayer(
  { isVisible = true, musicUrl = null, musicTitle = null },
  ref
) {
  const audioRef = useRef(null);
  const voiceRef = useRef(null);
  const srcLoadedRef = useRef(''); // track which src is currently loaded

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [musicData, setMusicData] = useState({
    title: musicTitle || 'Our Song ♡',
    url: musicUrl || '',
  });

  // ── Expose play() imperatively so parent can call it from a click handler ──
  useImperativeHandle(ref, () => ({
    play: () => {
      const audio = audioRef.current;
      if (!audio) return;

      // If a URL is already set and loaded, play directly
      const target = musicData.url || musicUrl || '';
      if (audio.src !== target && target) {
        audio.src = target;
        audio.load();
        srcLoadedRef.current = target;
      }

      audio
        .play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.warn('MusicPlayer.play() failed:', err);
          setPlaying(false);
        });
    },
  }));

  // ── When parent passes a pre-fetched URL, apply it immediately ──
  useEffect(() => {
    if (musicUrl && musicUrl !== musicData.url) {
      setMusicData({
        title: musicTitle || 'Our Song ♡',
        url: musicUrl,
      });
    }
  }, [musicUrl, musicTitle]); // eslint-disable-line

  // ── Fetch music from backend only if parent did NOT supply a URL ──
  useEffect(() => {
    if (musicUrl) return; // parent already fetched it
    fetchMusicTrack()
      .then((data) => {
        if (data && data.success && data.music && data.music.musicUrl) {
          setMusicData({
            title: data.music.title || 'Our Song ♡',
            url: getFullImageUrl(data.music.musicUrl),
          });
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line

  // ── Sync audio element src when musicData.url changes ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicData.url) return;
    if (srcLoadedRef.current === musicData.url) return; // already loaded

    audio.src = musicData.url;
    audio.load();
    srcLoadedRef.current = musicData.url;
    // Do NOT auto-play here — wait for explicit play() call from parent gesture
  }, [musicData.url]);

  // ── Sync volume ──
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // ── Toggle Play / Pause ──
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  }, [playing]);

  // ── Loaded Metadata ──
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration) && audio.duration > 0 && isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  }, []);

  // ── Time Update ──
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = duration || audio.duration;
    const cur = audio.currentTime;

    if (dur && !isNaN(dur) && dur > 0 && isFinite(dur)) {
      const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
      setProgress(pct);
    }
  }, [duration]);

  // ── Seek Bar ──
  const handleSeek = useCallback(
    (e) => {
      const audio = audioRef.current;
      const dur = duration || (audio ? audio.duration : 0);
      if (!audio || !dur || isNaN(dur) || dur <= 0) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * dur;
      setProgress(pct * 100);
    },
    [duration]
  );

  // ── Volume Change ──
  const handleVolumeChange = useCallback((e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  }, []);

  // ── Track Ended ──
  const handleSongEnded = useCallback(() => {
    // loop attribute on <audio> handles restart automatically;
    // this handler only fires when loop=false
    setPlaying(false);
    setProgress(100);
  }, []);

  return (
    <div
      id="music-player"
      role="complementary"
      aria-label="Music Player"
      className={isVisible ? 'visible' : ''}
    >
      <div className="music-icon">🎵</div>
      <div className="music-info">
        <div className="music-title" id="music-title">
          {musicData.title}
        </div>
        <div
          className="music-progress-container"
          id="music-progress-wrap"
          role="slider"
          aria-label="Song progress"
          onClick={handleSeek}
        >
          <div
            className="music-progress-bar"
            id="music-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="music-controls">
        <button
          className="music-btn"
          id="music-toggle-btn"
          aria-label="Play/Pause music"
          onClick={togglePlay}
        >
          <i className={`fas ${playing ? 'fa-pause' : 'fa-play'}`} id="music-icon" />
        </button>
        <input
          type="range"
          className="music-volume-slider"
          id="music-volume"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
        />
      </div>

      {/* Persistent HTML5 Audio — loop handles full-duration repeat, no key= to prevent DOM destruction */}
      <audio
        ref={audioRef}
        id="bg-music"
        loop
        preload="auto"
        crossOrigin="anonymous"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnded}
      />

      <audio ref={voiceRef} id="voice-audio" preload="none" crossOrigin="anonymous">
        <source src="/assets/voice/happybirthday.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
});

export default MusicPlayer;

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Preloader       from '../components/Preloader';
import CustomCursor    from '../components/CustomCursor';
import CanvasLayers    from '../components/CanvasLayers';
import NavbarDots      from '../components/NavbarDots';
import MusicPlayer     from '../components/MusicPlayer';
import LightboxModal   from '../components/LightboxModal';
import PermissionModal from '../components/PermissionModal';
import MidnightOverlay from '../components/MidnightOverlay';

import WelcomeScreen        from '../components/sections/WelcomeScreen';
import CountdownSection     from '../components/sections/CountdownSection';
import OurStorySection      from '../components/sections/OurStorySection';
import GallerySection       from '../components/sections/GallerySection';
import VideoSection         from '../components/sections/VideoSection';
import LoveLetterSection    from '../components/sections/LoveLetterSection';
import WhyILoveYouSection   from '../components/sections/WhyILoveYouSection';
import LoveCounterSection   from '../components/sections/LoveCounterSection';
import LoveMeterSection     from '../components/sections/LoveMeterSection';
import HeartRainSection     from '../components/sections/HeartRainSection';
import SurpriseGiftSection  from '../components/sections/SurpriseGiftSection';
import FinalMessageSection  from '../components/sections/FinalMessageSection';
import FinalQuestionSection from '../components/sections/FinalQuestionSection';
import EndingSection        from '../components/sections/EndingSection';
import ReplySection         from '../components/sections/ReplySection';

import { defaultConfig } from '../config/defaultConfig';
import { fetchSettings, fetchGalleryPhotos, fetchMusicTrack, getFullImageUrl, fetchLoveLetter } from '../services/api';

// ── Memoised static/infrastructure components ────────────────────────────────
// These have no state-driven re-render requirements — wrap once so they never
// re-render when SurpriseHome state changes (lightbox, music, etc.)
const MemoCanvasLayers    = React.memo(CanvasLayers);
const MemoCustomCursor    = React.memo(CustomCursor);
const MemoNavbarDots      = React.memo(NavbarDots);
const MemoHeartRain       = React.memo(HeartRainSection);
const MemoFinalMessage    = React.memo(FinalMessageSection);
const MemoFinalQuestion   = React.memo(FinalQuestionSection);
const MemoVideoSection    = React.memo(VideoSection);
const MemoReplySection    = React.memo(ReplySection);

export default function SurpriseHome() {
  const [config, setConfig]                   = useState(defaultConfig);
  const [galleryPhotos, setGalleryPhotos]     = useState([]);
  const [preloaderDone, setPreloaderDone]     = useState(false);
  const [welcomeVisible, setWelcomeVisible]   = useState(true);
  const [showPermModal, setShowPermModal]     = useState(false);
  const [showMidnight, setShowMidnight]       = useState(false);
  const [mainContentVisible, setMainContentVisible] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc,  setLightboxSrc]  = useState('');

  const [fireworksActive, setFireworksActive] = useState(false);
  const [balloonsActive,  setBalloonsActive]  = useState(false);

  const [musicUrl,   setMusicUrl]   = useState('');
  const [musicTitle, setMusicTitle] = useState('');

  const musicPlayerRef = useRef(null);

  // ── Fetch all remote data on mount ──────────────────────────────────────
  useEffect(() => {
    fetchSettings()
      .then((data) => {
        if (data?.settings) setConfig((prev) => ({ ...prev, ...data.settings }));
      })
      .catch(() => {});

    fetchGalleryPhotos()
      .then((res) => {
        if (Array.isArray(res))             setGalleryPhotos(res);
        else if (res?.data || res?.photos)  setGalleryPhotos(res.data || res.photos || []);
      })
      .catch(() => {});

    fetchMusicTrack()
      .then((data) => {
        if (data?.success && data?.music?.musicUrl) {
          setMusicUrl(getFullImageUrl(data.music.musicUrl));
          setMusicTitle(data.music.title || 'Our Song ♡');
        }
      })
      .catch(() => {});

    fetchLoveLetter()
      .then((data) => {
        if (data?.success && data?.letter?.message) {
          setConfig((prev) => ({ ...prev, loveLetter: data.letter.message }));
        }
      })
      .catch(() => {});
  }, []);

  // ── AOS: initialise ONCE when main content becomes visible ───────────────
  useEffect(() => {
    if (!mainContentVisible) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    const t = setTimeout(() => {
      AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic', offset: 40 });
      AOS.refresh();
    }, 100);
    return () => clearTimeout(t);
  }, [mainContentVisible]); // mainContentVisible only flips once → AOS inits once

  // ── Stable callback refs (don't change on re-render) ────────────────────
  // These are passed as props — stable refs prevent child re-renders.

  const handlePreloaderDone = useCallback(() => setPreloaderDone(true),     []);
  const handleStartSurprise = useCallback(() => {
    setWelcomeVisible(false);
    setShowPermModal(true);
  }, []);

  const handleAllowNotifications = useCallback(() => {
    if (musicPlayerRef.current) musicPlayerRef.current.play();
    if ('Notification' in window) Notification.requestPermission().catch(() => {});
    setShowPermModal(false);
    setMainContentVisible(true);
  }, []);

  const handleSkipNotifications = useCallback(() => {
    if (musicPlayerRef.current) musicPlayerRef.current.play();
    setShowPermModal(false);
    setMainContentVisible(true);
  }, []);

  // Stable ref — onMidnight won't change → CountdownSection won't restart interval
  const handleMidnightTrigger = useCallback(() => {
    setShowMidnight(true);
    setFireworksActive(true);
    setBalloonsActive(true);
  }, []);

  const handleSelectImage = useCallback((src) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
  }, []);

  const handleCloseLightbox  = useCallback(() => setLightboxOpen(false), []);
  const handleCloseMidnight  = useCallback(() => setShowMidnight(false), []);

  // ── Memoised props that don't change between renders ────────────────────
  const timelineEvents = useMemo(() => config.timelineEvents,  [config.timelineEvents]);
  const loveReasons    = useMemo(() => config.loveReasons,     [config.loveReasons]);
  const loveStartDate  = useMemo(() => config.loveStartDate,   [config.loveStartDate]);
  const loveLetter     = useMemo(() => config.loveLetter,      [config.loveLetter]);
  const hername        = useMemo(() => config.hername,         [config.hername]);
  const giftMessage    = useMemo(() => config.giftMessage,     [config.giftMessage]);

  return (
    <>
      <Preloader onFinish={handlePreloaderDone} />
      <MemoCustomCursor />
      {/* CanvasLayers only re-renders when fireworks/balloons flags change */}
      <MemoCanvasLayers fireworksActive={fireworksActive} balloonsActive={balloonsActive} />

      {preloaderDone && welcomeVisible && (
        <WelcomeScreen config={config} onStart={handleStartSurprise} />
      )}

      <PermissionModal
        isOpen={showPermModal}
        onAllow={handleAllowNotifications}
        onSkip={handleSkipNotifications}
      />

      <MidnightOverlay
        isOpen={showMidnight}
        name={hername}
        onClose={handleCloseMidnight}
      />

      <MusicPlayer
        ref={musicPlayerRef}
        isVisible={mainContentVisible}
        musicUrl={musicUrl}
        musicTitle={musicTitle}
      />

      {mainContentVisible && (
        <>
          <MemoNavbarDots />
          <main id="main-content" style={{ display: 'block', minHeight: '100vh' }}>
            <CountdownSection onMidnight={handleMidnightTrigger} />
            <OurStorySection  events={timelineEvents} />
            <GallerySection
              photos={galleryPhotos}
              placeholderCount={config.galleryPlaceholderCount}
              onSelectImage={handleSelectImage}
            />
            <MemoVideoSection />
            <LoveLetterSection letterText={loveLetter} />
            <WhyILoveYouSection reasons={loveReasons} />
            <LoveCounterSection startDate={loveStartDate} />
            <LoveMeterSection />
            <MemoHeartRain />
            <SurpriseGiftSection giftMessage={giftMessage} />
            <MemoFinalMessage />
            <MemoFinalQuestion />
            <EndingSection name={hername} />
            <MemoReplySection />
          </main>
        </>
      )}

      <LightboxModal
        isOpen={lightboxOpen}
        imageSrc={lightboxSrc}
        onClose={handleCloseLightbox}
      />
    </>
  );
}

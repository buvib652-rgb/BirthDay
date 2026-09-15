import React, { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Preloader from '../components/Preloader';
import CustomCursor from '../components/CustomCursor';
import CanvasLayers from '../components/CanvasLayers';
import NavbarDots from '../components/NavbarDots';
import MusicPlayer from '../components/MusicPlayer';
import LightboxModal from '../components/LightboxModal';
import PermissionModal from '../components/PermissionModal';
import MidnightOverlay from '../components/MidnightOverlay';

import WelcomeScreen from '../components/sections/WelcomeScreen';
import CountdownSection from '../components/sections/CountdownSection';
import OurStorySection from '../components/sections/OurStorySection';
import GallerySection from '../components/sections/GallerySection';
import VideoSection from '../components/sections/VideoSection';
import LoveLetterSection from '../components/sections/LoveLetterSection';
import WhyILoveYouSection from '../components/sections/WhyILoveYouSection';
import LoveCounterSection from '../components/sections/LoveCounterSection';
import LoveMeterSection from '../components/sections/LoveMeterSection';
import HeartRainSection from '../components/sections/HeartRainSection';
import SurpriseGiftSection from '../components/sections/SurpriseGiftSection';
import FinalMessageSection from '../components/sections/FinalMessageSection';
import FinalQuestionSection from '../components/sections/FinalQuestionSection';
import EndingSection from '../components/sections/EndingSection';
import ReplySection from '../components/sections/ReplySection';

import { defaultConfig } from '../config/defaultConfig';
import { fetchSettings, fetchGalleryPhotos, fetchMusicTrack, getFullImageUrl, fetchLoveLetter } from '../services/api';

export default function SurpriseHome() {
  const [config, setConfig] = useState(defaultConfig);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [showPermModal, setShowPermModal] = useState(false);
  const [showMidnight, setShowMidnight] = useState(false);
  const [mainContentVisible, setMainContentVisible] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');

  const [fireworksActive, setFireworksActive] = useState(false);
  const [balloonsActive, setBalloonsActive] = useState(false);

  // Pre-fetched music data — populated on mount so it is ready by the time
  // the user clicks "Allow Notifications"
  const [musicUrl, setMusicUrl] = useState('');
  const [musicTitle, setMusicTitle] = useState('');

  // Ref to MusicPlayer — lets us call play() synchronously from a click handler
  const musicPlayerRef = useRef(null);

  // ── Fetch all remote data on mount ──────────────────────────────────────
  useEffect(() => {
    fetchSettings()
      .then((data) => {
        if (data && data.settings) {
          setConfig((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});

    fetchGalleryPhotos()
      .then((res) => {
        if (Array.isArray(res)) {
          setGalleryPhotos(res);
        } else if (res && (res.data || res.photos)) {
          setGalleryPhotos(res.data || res.photos || []);
        }
      })
      .catch(() => {});

    // Eagerly fetch music so URL is ready before the user clicks anything
    fetchMusicTrack()
      .then((data) => {
        if (data && data.success && data.music && data.music.musicUrl) {
          setMusicUrl(getFullImageUrl(data.music.musicUrl));
          setMusicTitle(data.music.title || 'Our Song ♡');
        }
      })
      .catch(() => {});

    // Fetch live love letter text
    fetchLoveLetter()
      .then((data) => {
        if (data && data.success && data.letter && data.letter.message) {
          setConfig((prev) => ({ ...prev, loveLetter: data.letter.message }));
        }
      })
      .catch(() => {});
  }, []);

  // ── AOS: initialise when main content becomes visible ───────────────────
  useEffect(() => {
    if (mainContentVisible) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => {
        AOS.init({
          duration: 900,
          once: true,
          easing: 'ease-out-cubic',
          offset: 40,
        });
        AOS.refresh();
      }, 100);
    }
  }, [mainContentVisible]);

  // ── PAGE 1: "Open Your Surprise" ─────────────────────────────────────────
  const handleStartSurprise = () => {
    setWelcomeVisible(false);
    setShowPermModal(true);
    // Do NOT start audio here — wait for the notification click gesture
  };

  // ── PAGE 2: "Allow Notifications" ────────────────────────────────────────
  //
  // CRITICAL: audio.play() MUST be called synchronously inside this handler
  // before any await/async call, so the browser treats it as a direct result
  // of the user gesture.  Notification.requestPermission() is called AFTER
  // play() is triggered.
  //
  const handleAllowNotifications = () => {
    // ① Trigger music FIRST — still inside the synchronous click event
    if (musicPlayerRef.current) {
      musicPlayerRef.current.play();
    }

    // ② Then handle notification permission (async — does not affect audio)
    if ('Notification' in window) {
      Notification.requestPermission().catch(() => {});
    }

    // ③ Show main content
    setShowPermModal(false);
    setMainContentVisible(true);
  };

  const handleSkipNotifications = () => {
    // When user skips we still attempt to play — the skip click IS a user gesture
    if (musicPlayerRef.current) {
      musicPlayerRef.current.play();
    }
    setShowPermModal(false);
    setMainContentVisible(true);
  };

  const handleMidnightTrigger = () => {
    setShowMidnight(true);
    setFireworksActive(true);
    setBalloonsActive(true);
  };

  const handleSelectImage = (src) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
  };

  return (
    <>
      <Preloader onFinish={() => setPreloaderDone(true)} />
      <CustomCursor />
      <CanvasLayers fireworksActive={fireworksActive} balloonsActive={balloonsActive} />

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
        name={config.hername}
        onClose={() => setShowMidnight(false)}
      />

      {/*
        MusicPlayer is always mounted so the <audio> element persists.
        ref lets us call play() synchronously from the click handler above.
        musicUrl / musicTitle are pre-fetched so they're ready before click.
      */}
      <MusicPlayer
        ref={musicPlayerRef}
        isVisible={mainContentVisible}
        musicUrl={musicUrl}
        musicTitle={musicTitle}
      />

      {mainContentVisible && (
        <>
          <NavbarDots />
          <main id="main-content" style={{ display: 'block', minHeight: '100vh' }}>
            <CountdownSection onMidnight={handleMidnightTrigger} />
            <OurStorySection events={config.timelineEvents} />
            <GallerySection
              photos={galleryPhotos}
              placeholderCount={config.galleryPlaceholderCount}
              onSelectImage={handleSelectImage}
            />
            <VideoSection />
            <LoveLetterSection letterText={config.loveLetter} />
            <WhyILoveYouSection reasons={config.loveReasons} />
            <LoveCounterSection startDate={config.loveStartDate} />
            <LoveMeterSection />
            <HeartRainSection />
            <SurpriseGiftSection giftMessage={config.giftMessage} />
            <FinalMessageSection />
            <FinalQuestionSection />
            <EndingSection name={config.hername} />
            <ReplySection />
          </main>
        </>
      )}

      <LightboxModal
        isOpen={lightboxOpen}
        imageSrc={lightboxSrc}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

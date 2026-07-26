/* ============================================
   voice.js – Voice Recording Playback
============================================ */

'use strict';

// ============================================
// VOICE MESSAGE PLAYBACK
// Plays assets/voice/happybirthday.mp3 at midnight
// After it ends, resumes background music
// ============================================

let voicePlaying = false;

function playVoiceMessage() {
  const voiceAudio = document.getElementById('voice-audio');
  if (!voiceAudio) return;

  // Notify music.js to duck volume
  window.dispatchEvent(new CustomEvent('voicePlaying', { detail: true }));

  // Small delay before voice starts
  setTimeout(() => {
    voiceAudio.volume = 1.0;
    voiceAudio.play().then(() => {
      voicePlaying = true;
    }).catch(err => {
      // If autoplay blocked, try again
      console.warn('Voice playback blocked:', err);
      // Resume music since voice failed
      window.dispatchEvent(new CustomEvent('voicePlaying', { detail: false }));
    });

    voiceAudio.addEventListener('ended', onVoiceEnded, { once: true });
    voiceAudio.addEventListener('error', onVoiceError, { once: true });
  }, 1500);
}

function onVoiceEnded() {
  voicePlaying = false;
  // Restore music
  window.dispatchEvent(new CustomEvent('voicePlaying', { detail: false }));
}

function onVoiceError() {
  voicePlaying = false;
  // Restore music even if voice fails
  window.dispatchEvent(new CustomEvent('voicePlaying', { detail: false }));
}

// ============================================
// EXPOSE globally
// ============================================
window.playVoiceMessage = playVoiceMessage;

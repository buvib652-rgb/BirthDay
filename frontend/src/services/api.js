/* ============================================
   frontend/src/services/api.js
   Centralized API Service Configuration
============================================ */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return { success: false, message: 'Backend unreachable' };
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};
export const getFullImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Fetch website settings (nickname, dates, etc.)
 */
export async function fetchSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('API fetchSettings error:', err);
    return null;
  }
}

/**
 * Fetch gallery photos from database
 */
export async function fetchGalleryPhotos() {
  try {
    const res = await fetch(`${API_BASE_URL}/gallery?limit=100`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data && data.success) {
      return data.data || data.photos || [];
    }
    return [];
  } catch (err) {
    console.warn('API fetchGalleryPhotos error:', err);
    return [];
  }
}

/**
 * Upload photo from Admin Dashboard
 */
export async function uploadGalleryPhoto(formData, token) {
  const res = await fetch(`${API_BASE_URL}/gallery`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return await res.json();
}

/**
 * Save Website Configurations from Admin Dashboard
 */
export async function saveSettings(settings, token) {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });
  return await res.json();
}

/**
 * Fetch Love Letter
 */
export async function fetchLoveLetter() {
  try {
    const res = await fetch(`${API_BASE_URL}/letter`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('API fetchLoveLetter error:', err);
    return null;
  }
}

/**
 * Save Love Letter from Admin Dashboard
 */
export async function saveLoveLetter(title, messageText, token) {
  const res = await fetch(`${API_BASE_URL}/letter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, message: messageText }),
  });
  return await res.json();
}

/**
 * Admin Login
 */
export async function loginAdmin(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return await res.json();
}

/**
 * Send Reply Message
 */
export async function sendReplyEmail(name, message) {
  const res = await fetch(`${API_BASE_URL}/email/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, message }),
  });
  return await res.json();
}

/**
 * Fetch Current Background Music
 */
export async function fetchMusicTrack() {
  try {
    const res = await fetch(`${API_BASE_URL}/music`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('API fetchMusicTrack error:', err);
    return null;
  }
}

/**
 * Upload Background Music from Admin Dashboard
 */
export async function uploadMusicTrack(formData, token) {
  const res = await fetch(`${API_BASE_URL}/music`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return await res.json();
}

/**
 * Delete Background Music from Admin Dashboard
 */
export async function deleteMusicTrack(id, token) {
  const res = await fetch(`${API_BASE_URL}/music/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}

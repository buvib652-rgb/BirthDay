/* ============================================
   service-worker.js – PWA Offline Support
============================================ */

const CACHE_NAME = 'birthday-surprise-v1';

const CACHED_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/countdown.js',
  '/js/music.js',
  '/js/gallery.js',
  '/js/timeline.js',
  '/js/effects.js',
  '/js/voice.js',
  '/manifest.json',
  // External CDNs are NOT cached here (they need internet first load)
];

// ============================================
// INSTALL — Cache core assets
// ============================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHED_ASSETS).catch((err) => {
        // Some assets may not exist yet (music/voice files)
        // That's fine — they'll be cached on first fetch
        console.log('SW: Some assets skipped:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ============================================
// ACTIVATE — Clean old caches
// ============================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ============================================
// FETCH — Serve from cache, fallback to network
// ============================================
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Chrome extensions and cross-origin CDN requests
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && !url.href.includes('fonts.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cache successful responses for local assets
        if (response && response.status === 200 && url.origin === location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => {
        // Offline fallback — return cached index for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ============================================
// PUSH NOTIFICATION (for midnight alert)
// ============================================
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(
      data.title || '🎂 Happy Birthday My Love! ❤️',
      {
        body: data.body || 'The midnight surprise is here! Open the app now! 🎉',
        icon: '/assets/icons/icon-192.png',
        badge: '/assets/icons/icon-192.png',
        vibrate: [200, 100, 200, 100, 400],
        tag: 'birthday-notification',
        requireInteraction: true,
      }
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// DisasterGuard JP Service Worker - Offline-First Engine
const CACHE_NAME = 'disasterguard-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets for offline readiness');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Removing stale cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation fallback for SPA or API offline responses
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Cache First for static resources, Network First with Cache Fallback for APIs
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Offline mode active */});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // Return custom offline JSON response if API call fails
        if (event.request.url.includes('/api/')) {
          return new Response(
            JSON.stringify({
              offline: true,
              message: '현재 오프라인 상태입니다. 로컬 저장된 데이터로 동작 중입니다.',
              timestamp: new Date().toISOString()
            }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }
      });
    })
  );
});

// Web Push Event Listener
self.addEventListener('push', (event) => {
  let data = { title: 'DisasterGuard JP 긴급 알림', body: '일본 지역 긴급 재난 정보가 업데이트되었습니다.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [300, 100, 300, 100, 500],
    tag: 'jma-disaster-alert',
    renotify: true,
    data: data
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

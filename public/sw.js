// public/sw.js
// LumaBooth Progressive Web App Service Worker
const CACHE_NAME = 'lumabooth-pwa-v1.0.0';

// Essential App Shell resources to precache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/assets/lumabooth-logo.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon.svg'
];

// Domains/patterns that must NEVER be cached (AI generations, streaming APIs, dynamic data)
const BYPASS_PATTERNS = [
  '/api/',
  'replicate.delivery',
  'api.replicate.com',
  'generativelanguage.googleapis.com',
  'api.openai.com',
  'blob:',
  'data:'
];

// INSTALL: Precache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[LumaBooth SW] Precache non-critical item failed:', err);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// ACTIVATE: Clean up outdated caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name.startsWith('lumabooth-')) {
            console.log('[LumaBooth SW] Removing old cache:', name);
            return caches.delete(name);
          }
          return null;
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// FETCH: Smart Caching Strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 1. Only handle GET requests; never touch POST/PUT/DELETE/etc.
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 2. Ignore non-HTTP/HTTPS schemes (e.g. chrome-extension:, data:, blob:)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 3. Bypass APIs, AI inference, and dynamic camera/streaming requests completely
  const shouldBypass = BYPASS_PATTERNS.some((pattern) => {
    return request.url.includes(pattern) || url.pathname.startsWith(pattern);
  });

  if (shouldBypass) {
    return; // Let browser perform direct network fetch
  }

  // 4. Navigation requests (HTML pages): Network-first with Cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Fallback to cached index.html if offline
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 5. Static assets (JS, CSS, Web Fonts, Images, Audio): Stale-While-Revalidate
  const isStaticAsset = 
    url.origin === self.location.origin && (
      url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/icons/') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.mp3') ||
      url.pathname.endsWith('.mp4') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.woff')
    ) ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Silently swallow fetch errors if network is unavailable
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 6. Default: Network with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle update triggers
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

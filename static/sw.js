const CACHE_NAME = 'risk-agent-v1.2.1';

const CORE_ASSETS = [
  '/',
  '/static/css/style.css',
  '/static/js/app.js',
  '/manifest.json',
  '/static/icons/icon-192.png',
  '/static/icons/icon-512.png',
  '/static/icons/apple-touch-icon.png'
];

const EXTERNAL_CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install Event - Resilient individual item pre-caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[ServiceWorker] Pre-caching core shell assets');
      
      const corePromises = CORE_ASSETS.map((asset) => {
        return cache.add(asset).catch((err) => {
          console.warn(`[ServiceWorker] Could not pre-cache core asset ${asset}:`, err);
        });
      });

      const cdnPromises = EXTERNAL_CDN_ASSETS.map((url) => {
        const req = new Request(url, { mode: 'cors' });
        return fetch(req)
          .then((res) => {
            if (res.status === 200 || res.type === 'opaque') {
              return cache.put(req, res);
            }
          })
          .catch((err) => {
            console.warn(`[ServiceWorker] Could not pre-cache CDN asset ${url}:`, err);
          });
      });

      return Promise.all([...corePromises, ...cdnPromises]);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network-First for HTML/CSS/JS/API (Auto-update on Vercel/Railway), Cache-First for static icons/CDNs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;

  // 1. API Requests: Network-First with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 2. App Shell & Code Files (HTML, JS, CSS): Network-First (Ensures instant deployment updates without manual reinstall/cache clearing)
  const isCodeFile = url.pathname === '/' || 
                     url.pathname.endsWith('.html') || 
                     url.pathname.endsWith('.js') || 
                     url.pathname.endsWith('.css') ||
                     url.pathname === '/manifest.json';

  if (isCodeFile) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Static Assets (Icons, Images, Fonts, CDNs): Cache-First with Network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});

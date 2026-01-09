const CACHE_NAME = 'hpc-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/images/Logo.png',
  '/images/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Some assets might not exist yet, that's okay
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only cache GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Cache images, CSS, JS, fonts, and other static assets
  if (
    url.pathname.includes('/images/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.eot') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          // Return cached version if available
          if (response) {
            return response;
          }

          // Otherwise fetch from network
          return fetch(request).then((networkResponse) => {
            // Cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      }).catch(() => {
        // Fallback for images if offline and not in cache
        if (url.pathname.includes('/images/') || 
            url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
          return caches.match(request).catch(() => {
            // Return a placeholder if image is not cached
            return new Response(
              '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f0f0f0"/></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
        }
      })
    );
  }
});

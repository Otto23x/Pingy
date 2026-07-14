// Service Worker di Pingy — OBBLIGATORIO per l'installazione su Chrome Android.
// Deve stare nella STESSA cartella di index.html sul repository (accanto ad esso).
const CACHE = 'pingy-v1';

self.addEventListener('install', (e) => { self.skipWaiting(); });

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// L'handler 'fetch' è ciò che Chrome Android controlla per considerare l'app installabile.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request)
        .then((res) => {
          try { const clone = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, clone)); } catch (err) {}
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

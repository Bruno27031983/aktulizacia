var CACHE_NAME = 'brunos-calculator-cache-v3';
var urlsToCache = ['./', './index.html', './app.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/favicon.svg'];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(urlsToCache); }));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) { return response || fetch(event.request); }));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.map(function(cacheName) {
      if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
    }));
  }));
});

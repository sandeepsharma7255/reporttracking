const CACHE_NAME = 'sandeep-erp-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                if(event.request.url.startsWith(self.location.origin)) {
                    cache.put(event.request, responseToCache);
                }
              });
            return response;
          }
        );
      }).catch(() => {
          if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
          }
      })
  );
});

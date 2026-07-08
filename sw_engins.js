var CACHE = 'cauris-engins-v1';
self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    }).then(function(){ return clients.claim(); })
  );
});
self.addEventListener('fetch', function(e) {
  var u = e.request.url;
  if (u.includes('script.google.com') || u.includes('googleapis') || u.includes('cdnjs') || u.includes('jsdelivr')) return;
  e.respondWith(
    fetch(e.request).then(function(r) {
      var c = r.clone();
      caches.open(CACHE).then(function(cache){ cache.put(e.request, c); });
      return r;
    }).catch(function(){ return caches.match(e.request); })
  );
});

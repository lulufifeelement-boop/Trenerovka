/* Offline cache for the loader and compressed application bundle. */
const CACHE = 'forma-app-2.0.0-becedc9597';
const FILES = ['./',
  './payload/part-00.txt','./payload/part-01.txt','./payload/part-02.txt',
  './payload/part-03.txt','./payload/part-04.txt','./payload/part-05.txt',
  './payload/part-06.txt','./payload/part-07.txt','./payload/part-08.txt'
];
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(FILES.map(async (path) => {
      try {
        const request = new Request(new URL(path, self.registration.scope), { cache: 'reload' });
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response);
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('forma-app-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const isAppFile = request.mode === 'navigate' || url.pathname.includes('/payload/');
  if (!isAppFile) return;
  event.respondWith((async () => {
    try {
      const fresh = await fetch(request);
      if (fresh && fresh.ok) {
        const copy = fresh.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
      }
      return fresh;
    } catch (_) {
      return (await caches.match(request)) || (await caches.match(new URL('./', scope)));
    }
  })());
});

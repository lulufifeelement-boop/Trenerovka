const CACHE='my-workouts-v1-1-5';
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  for(const key of await caches.keys()) if(key.startsWith('my-workouts-')) await caches.delete(key);
  await self.clients.claim();
})()));
// Deliberately do not cache the loader or payload chunks: a partial mobile cache
// can leave the app stuck on its loading screen. Network requests pass through.

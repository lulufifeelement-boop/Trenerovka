const CACHE='my-workouts-v1-1-4';
const APP='./index.html';
const PARTS=["./payload/part-00.txt","./payload/part-01.txt","./payload/part-02.txt","./payload/part-03.txt","./payload/part-04.txt","./payload/part-05.txt","./payload/part-06.txt","./payload/part-07.txt","./payload/part-08.txt","./payload/part-09.txt","./payload/part-10a.txt","./payload/part-10b.txt","./payload/part-11.txt","./payload/part-12.txt","./payload/part-13.txt"];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll([APP,'./manifest.webmanifest','./icon.svg',...PARTS]);await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;e.respondWith((async()=>{const c=await caches.open(CACHE);const hit=await c.match(e.request);if(hit)return hit;try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}catch(err){return hit||Response.error()}})())});

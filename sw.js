const VERSION="2.2.0";
const STATIC_CACHE="braz-static-"+VERSION;
const RUNTIME_CACHE="braz-runtime-"+VERSION;
const CORE=["/offline.html","/manifest.webmanifest","/icons/icon-192.png","/icons/icon-512.png","/icons/apple-touch-icon.png"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(STATIC_CACHE).then(cache=>cache.addAll(CORE)))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>!key.endsWith(VERSION)).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener("message",event=>{if(event.data&&event.data.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("fetch",event=>{const req=event.request;if(req.method!=="GET")return;const url=new URL(req.url);if(url.origin!==self.location.origin||url.pathname.includes("supabase"))return;
 if(req.mode==="navigate"){event.respondWith(fetch(req,{cache:"no-store"}).then(response=>{const copy=response.clone();caches.open(RUNTIME_CACHE).then(cache=>cache.put(req,copy));return response}).catch(()=>caches.match(req).then(hit=>hit||caches.match("/offline.html"))));return}
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(RUNTIME_CACHE).then(cache=>cache.put(req,copy))}return response})))
});
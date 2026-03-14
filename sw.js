const CACHE = 'era-esi-v1';
const PAGES = ['/', '/index.html', '/about.html', '/services.html', '/process.html', '/careers.html', '/contact.html', '/offline.html', '/manifest.json', '/css/style.css', '/css/index.css', '/css/about.css', '/css/services.css', '/css/process.css', '/css/careers.css', '/css/contact.css', '/js/app.js', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PAGES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.protocol === 'chrome-extension:') return;
  if (url.hostname.includes('fonts.g')) { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { caches.open(CACHE).then(c => c.put(e.request, res.clone())); return res; }))); return; }
  if (e.request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(fetch(e.request).then(r => { caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('/offline.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => { const f = fetch(e.request).then(res => { caches.open(CACHE).then(c => c.put(e.request, res.clone())); return res; }).catch(() => null); return r || f; }));
});

// SW solo para notificaciones push. La versión anterior ('xpeak-v2')
// interceptaba todos los GET y cacheaba cada respuesta sin límite ni
// limpieza entre deploys — la caché crecía sin tope y ralentizaba
// cada carga en los navegadores con push activado. Sin fetch handler
// el SW no toca la red; el activate borra todas las cachés heredadas.
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('push', e => {
  if (!e.data) return;
  let p;
  try { p = e.data.json(); } catch { p = { title: 'XPEAK', body: e.data.text() }; }
  e.waitUntil(self.registration.showNotification(p.title ?? 'XPEAK', {
    body: p.body ?? '',
    icon: '/favicon.png',
    badge: '/favicon.png',
    tag: p.tag ?? 'xpeak-default',
    data: { url: p.url ?? '/dashboard' },
    requireInteraction: p.requireInteraction ?? false,
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const u = e.notification.data?.url ?? '/dashboard';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(c => {
    const w = c.find(x => x.url.includes(self.location.origin));
    if (w) { w.focus(); w.navigate(u); } else self.clients.openWindow(u);
  }));
});

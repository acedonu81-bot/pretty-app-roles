// XPEAK Service Worker — Web Push Notifications
const CACHE_NAME = 'xpeak-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  if (!e.data) return;
  let payload;
  try { payload = e.data.json(); } catch { payload = { title: 'XPEAK', body: e.data.text() }; }

  const title = payload.title ?? 'XPEAK';
  const options = {
    body: payload.body ?? '',
    icon: '/favicon.png',
    badge: '/favicon.png',
    tag: payload.tag ?? 'xpeak-default',
    data: { url: payload.url ?? '/dashboard' },
    requireInteraction: payload.requireInteraction ?? false,
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url ?? '/dashboard';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const existing = clients.find(c => c.url.includes(self.location.origin));
      if (existing) { existing.focus(); existing.navigate(url); }
      else self.clients.openWindow(url);
    })
  );
});

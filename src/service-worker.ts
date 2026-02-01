
/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

// 1. Standard PWA Caching
self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

// 2. Native Push Listeners (New)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'Nearby Dora Quran';
  const options = {
    body: data.body || 'New update available!',
    icon: '/pwa-192x192.png', // Main Icon (Sender Avatar)
    badge: '/pwa-192x192.png', // Small Status Bar Icon (Should ideally be monochrome)
    image: data.image || 'https://crm.pcirealestate.site/wp-content/uploads/2026/01/BG-Image-DTQ.png', // Big Picture
    vibrate: [100, 50, 100],
    data: data.url || '/',
    actions: [
        {
            action: 'explore',
            title: 'View Details'
        }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow(event.notification.data);
    })
  );
});

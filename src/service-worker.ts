
/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

// 1. Standard PWA Caching
self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST || []); // Fallback to empty array if manifest is missing

// 2. Native Push Listeners (FIXED)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'Nearby Dora Quran';
  
  // Define options with required Badge/Icon for Android
  const options = {
    body: data.body || 'New update available!',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png', // Small icon for notification bar
    image: data.image || 'https://crm.pcirealestate.site/wp-content/uploads/2026/01/BG-Image-DTQ.png',
    tag: data.title || 'notification-tag', // Group notifications
    renotify: true,
    data: data.url || '/',
    vibrate: [100, 50, 100],
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
      // If a window is already open, focus it
      if (clientList.length > 0) {
        let client = clientList[0];
        // Prefer looking for a focused one
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
            break;
          }
        }
        // Focus the client and navigate if needed (optional)
        return client.focus();
      }
      // Otherwise open a new window
      return clients.openWindow(event.notification.data);
    })
  );
});

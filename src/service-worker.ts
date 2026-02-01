
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

// 1. Regular PWA Caching
declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

// 2. Import OneSignal SDK Worker
// This ensures OneSignal runs INSIDE the main SW
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

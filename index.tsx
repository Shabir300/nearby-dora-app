
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { registerSW } from 'virtual:pwa-register';

// Register Service Worker with Auto-Update Logic
const updateSW = registerSW({
  onNeedRefresh() {
    console.log("New version detected. Refreshing app...");
    // The true parameter forces the new service worker to take over immediately
    updateSW(true);
  },
  onOfflineReady() {
    console.log("App is ready for offline usage.");
  },
});

// Periodic update check (every 60 minutes)
setInterval(() => {
  console.log("Checking for updates...");
  updateSW();
}, 60 * 60 * 1000);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

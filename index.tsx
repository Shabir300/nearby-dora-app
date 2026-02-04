
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { registerSW } from 'virtual:pwa-register';

// Register Service Worker with Auto-Update Logic
const updateSW = registerSW({
  onNeedRefresh() {
    console.log("New version detected. Refreshing app...");
    updateSW(true);
  },
  onOfflineReady() {
    console.log("App is ready for offline usage.");
  },
});

// Ensure page reloads when the new service worker takes control
let refreshing = false;
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (!refreshing) {
    refreshing = true;
    window.location.reload();
  }
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

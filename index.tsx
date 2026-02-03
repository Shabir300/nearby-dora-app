
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { registerSW } from 'virtual:pwa-register';

// Register Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Automatically update without prompting
    console.log("New content available, auto-updating...");
    updateSW(true);
  },
  onOfflineReady() {
    console.log("App is ready for offline usage.");
  },
});

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

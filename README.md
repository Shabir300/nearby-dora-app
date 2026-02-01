# Nearby Dora Quran (Ramadan 2026)

A location-based progressive web application (PWA) designed to help users find nearby *Dora Quran* programs and religious events during Ramadan. Built for speed, accessibility, and a premium mobile-first experience.

## Key Features

-   **Smart Geolocation**: Live tracking with intelligent debouncing (50m threshold) to prevent battery drain and data loops.
-   **Interactive Map**: Powered by Google Maps API with premium SVG vector markers and smooth camera automation.
-   **Minimalist UI**: Clean, tab-style program cards that expand into immersive, poster-like detail views.
-   **Robust Notifications**: "Alert Me" system with OneSignal and native browser permission fallback for reliable delivery.
-   **Location Search**: Autocomplete search to find programs in other areas (powered by Google Places).
-   **Cross-Platform PWA**: Optimized for iOS (Notch support), Android, and Desktop with offline caching and local assets.
-   **Haptic Feedback**: Subtle tactile response on interactions for a native app feel.

## Tech Stack

-   **Frontend**: React (v19), TypeScript, Vite
-   **Styling**: Tailwind CSS, PostCSS
-   **Maps**: `@vis.gl/react-google-maps` (Google Maps JavaScript API)
-   **Backend / DB**: Supabase (PostgreSQL + Edge Functions)
-   **Notifications**: OneSignal SDK
-   **PWA**: `vite-plugin-pwa` (Workbox)

## Architecture Notes 🛠️

-   **Unified Service Worker**: The app uses a custom `service-worker.ts` (via `injectManifest`) to merge PWA offline caching with the OneSignal Push SDK. This prevents conflicts where push notifications might be blocked.
-   **SPA Routing**: Includes `vercel.json` to handle client-side routing on Vercel deployments.
-   **Data Consistency**: The database is seeded with a verified list of ~30 locations (`supabase/seed.sql`) to ensure accuracy over "probable" search results.

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   NPM
-   Supabase Project (for database)
-   Google Maps API Key (Maps JavaScript, Places API, Geocoding)
-   OneSignal App ID

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/nearby-dora-quran.git
    cd nearby-dora-quran
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory:
    ```env
    VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Build & Deploy

To create a production build:

```bash
npm run build
```

This generates a `dist` folder ready for deployment on platforms like **Vercel**, **Netlify**, or **Cloudflare Pages**.

## Mobile Optimization

The app is fully responsive with specific optimizations for mobile users:
-   **Bottom sheet** interactions for ease of access.
-   **Touch-friendly** buttons and hit targets.
-   **Adaptive layouts** (Stacking on mobile vs Sidebar on Desktop).

## License

Proprietary software developed for Tanzeem-e-Islami. All rights reserved.

# Nearby Dora Quran (Ramadan 2026)

A location-based progressive web application (PWA) designed to help users find nearby *Dora Quran* programs and religious events during Ramadan. Built for speed, accessibility, and a premium mobile-first experience.

## Key Features

-   **Live Geolocation**: Instantly finds programs near your current location.
-   **Interactive Map**: Powered by Google Maps API with custom markers and clusters.
-   **Program Details**: Elegant, poster-style details view with time, facilities, and contact info.
-   **Push Notifications**: Integrated OneSignal for "Alert Me" reminders on specific programs.
-   **Location Search**: Autocomplete search to find programs in other areas (powered by Google Places).
-   **Installable PWA**: Works offline-first and can be installed on iOS/Android home screens.
-   **Premium UI**: Deep Green & Gold aesthetic, featuring glassmorphism and smooth animations.

## Tech Stack

-   **Frontend**: React (v19), TypeScript, Vite
-   **Styling**: Tailwind CSS, PostCSS
-   **Maps**: `@vis.gl/react-google-maps` (Google Maps JavaScript API)
-   **Backend / DB**: Supabase (PostgreSQL + Edge Functions)
-   **Notifications**: OneSignal SDK
-   **PWA**: `vite-plugin-pwa` (Workbox)

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

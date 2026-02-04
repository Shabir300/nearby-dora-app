# Nearby Dora Quran (Ramadan 2026)

A location-based web application built to help users find Dora Quran programs and religious events during Ramadan. This tool is designed for a premium mobile-first experience, focusing on speed and ease of use.

## Core Features

-   Location Tracking: Smart geolocation that identifies programs near you without excessive battery drain.
-   Interactive Maps: Built with Google Maps, featuring custom vector markers and automated camera movement for easy navigation.
-   Design & Typography: Standardized with DM Sans for English and Gulzar for Urdu to ensure a professional and readable experience.
-   Integrated Notifications: Uses OneSignal for reliable alerts, with a backup system for browsers that require manual permission checks.
-   Area Search: Search for programs in specific cities or areas using Google Places autocomplete.
-   PWA Support: Works as a native app on iOS and Android with offline caching and support for notch displays.
-   Navigation Overhaul: High-contrast bottom navigation and an auto-hiding search panel that clears the view when you open a location card.

## Technical Details

The project is built on a modern stack for performance and reliability:

-   Frontend: React 19 with TypeScript and Vite.
-   Styling: Tailwind CSS using a unified brand color palette (Emerald #064e3b and Gold #d4af37).
-   Maps: React-integrated Google Maps API with Places and Geocoding.
-   Backend: Supabase for the PostgreSQL database and Edge Functions.
-   PWA Engine: Vite PWA plugin with custom service worker logic to handle both caching and notifications.

## Development Setup

To get the project running locally, follow these steps:

1.  Clone the project and enter the directory.
2.  Run `npm install` to set up dependencies.
3.  Add a `.env.local` file with your credentials (Google Maps Key, Supabase URL, and Anon Key).
4.  Launch the development server with `npm run dev`.

## Deployment

The application is structured for easy deployment on Vercel or similar platforms. Run `npm run build` to generate the production-ready dist folder. The configuration includes Vercel-specific routing to handle client-side paths.

## Mobile Design

The app is optimized for touch interaction:
-   Bottom-sheet UI for quick access to location details.
-   Tactile feedback on key buttons.
-   Vertical centering and larger hit targets for thumb-friendly use.

## License

This software is proprietary and developed for Tanzeem-e-Islami. All rights reserved.

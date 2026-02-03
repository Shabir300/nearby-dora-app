
import React from 'react';

export const CATEGORIES = ['All', 'Religious', 'Community', 'Iftar', 'Taraweeh', 'Charity'];

export const CITIES = [
  { name: 'Rawalpindi', lat: 33.5651, lng: 73.0169 },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { name: 'Multan', lat: 30.1575, lng: 71.5249 },
  { name: 'Faisalabad', lat: 31.4187, lng: 73.0791 },
  { name: 'Wah Cantt', lat: 33.7715, lng: 72.7511 },
  { name: 'Murree', lat: 33.9070, lng: 73.3943 },
  { name: 'Kot Addu', lat: 30.4761, lng: 70.9644 },
  { name: 'Abbottabad', lat: 34.1688, lng: 73.2215 },
];

// Using High-Quality Solid/Filled Icons (Heroicons Solid Style) for a more mature/premium feel
export const Icons = {
  // A clean, solid lantern/lamp symbol
  Lantern: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M12 2a1 1 0 011 1v1.323a8.955 8.955 0 015.636 5.636H19a1 1 0 110 2h-.105a8.96 8.96 0 01-1.395 4.04l.707.707a1 1 0 01-1.414 1.414l-.707-.707A8.96 8.96 0 0112 18.95V21a1 1 0 11-2 0v-2.05a8.96 8.96 0 01-4.089-1.954l-.707.707a1 1 0 01-1.414-1.414l.707-.707A8.96 8.96 0 013.105 12H3a1 1 0 110-2h.364A8.955 8.955 0 019 4.323V3a1 1 0 011-1zM6.164 12a6.963 6.963 0 001.993 4.076l.286-1.572a1 1 0 011.968.358l-.513 2.822A6.974 6.974 0 0012 16.95a6.974 6.974 0 002.102-.766l-.513-2.822a1 1 0 011.968-.358l.286 1.572A6.963 6.963 0 0017.836 12H6.164z" clipRule="evenodd" />
    </svg>
  ),
  // Solid Moon
  Crescent: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
    </svg>
  ),
  Navigation: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A1.5 1.5 0 019.861 20.224v-4.25c0-.417-.161-.814-.447-1.108L3.233 8.745A3 3 0 012.354 6.624V5.636a1.857 1.857 0 011.438-1.808zM9 5.25a.75.75 0 100 1.5h6a.75.75 0 000-1.5H9z" clipRule="evenodd" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  ),
  Crosshairs: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M11.5 2a.5.5 0 01.5.5v1.517a8.487 8.487 0 016.983 6.983h1.517a.5.5 0 010 1h-1.517a8.487 8.487 0 01-6.983 6.983v1.517a.5.5 0 01-1 0v-1.517A8.487 8.487 0 014.017 12H2.5a.5.5 0 010-1h1.517A8.487 8.487 0 0111 4.017V2.5a.5.5 0 01.5-.5zm6.5 10a7.5 7.5 0 10-15 0 7.5 7.5 0 0015 0z" clipRule="evenodd" />
      <path d="M12 12.5a.5.5 0 100-1 .5.5 0 000 1z" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
  ),
  Coffee: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      {/* Simplified Cup */}
      <path fillRule="evenodd" d="M11.957 2.053a.75.75 0 01.59.888l-.72 4.048a14.71 14.71 0 014.545 2.196 2.001 2.001 0 01.328 3.102c-.082.083-.17.159-.263.228V12.75a6.002 6.002 0 01-11.37 2.593l-.478-2.678h.002a7.481 7.481 0 01-.397-2.39V10a.75.75 0 01.75-.75h.334l.32-1.796a.75.75 0 111.474.263l-.224 1.258a14.81 14.81 0 013.064-.99l.758-4.264a.75.75 0 01.889-.59zM14.5 9.75a.25.25 0 00-.25-.25h-5a.25.25 0 00-.25.25v.503c0 .265.006.528.019.789l.487 2.735a4.502 4.502 0 008.312-1.754 4.53 4.53 0 00-.07-.78L17.5 9.75zm1.75.25a.25.25 0 01.25-.25.5.5 0 01.293.094c.123 0 .237.05.328.14a.5.5 0 01-.383.844.25.25 0 01-.25-.25v-.328h-.238z" clipRule="evenodd" />
    </svg>
  ),
  Child: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12.75 6.75a.75.75 0 01.75.75v5.004l1.205 1.606a.75.75 0 11-1.2 .9l-1.38-1.84a.75.75 0 01-.125-.45h-.001V7.5a.75.75 0 01.75-.75z" />
      <path fillRule="evenodd" d="M12 21a9 9 0 100-18 9 9 0 000 18zM9 11a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm-5.5 3.5a3.501 3.501 0 015.731-.059.75.75 0 101.124-.966 5.002 5.002 0 00-8.084 0 .75.75 0 001.129.966.75.75 0 00.1-.059z" clipRule="evenodd" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  )
};

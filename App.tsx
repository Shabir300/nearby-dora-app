
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Program, UserLocation } from './types';
import { Icons, CATEGORIES } from './constants';
import { Map as GoogleMap } from './components/Map';
import { ProgramCard } from './components/ProgramCard';
import { ProgramDetail } from './components/ProgramDetail';
import { InstallPrompt } from './components/InstallPrompt';
import { LocationSearch } from './components/LocationSearch';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const [searchCenter, setSearchCenter] = useState<UserLocation | null>(null); // For manual location search
  const [searchAddress, setSearchAddress] = useState<string>(''); // To display "Searching near..."
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed searchQuery state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [radiusKm, setRadiusKm] = useState(1000); // Increased to 1000km to show country-wide events by default
  const [showFilters, setShowFilters] = useState(false);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const LOGO_URL = "https://crm.pcirealestate.site/wp-content/uploads/2026/01/Logo-DTQ-app.png";

  // Helper to calculate distance
  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    // geolocation init (Live Tracking)
    if (navigator.geolocation) {
      // Quick initial fetch
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.warn("Initial location fetch failed, using fallback/waiting for watch.", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;

          setUserLocation(prev => {
            if (!prev) {
              return { lat: newLat, lng: newLng, accuracy: position.coords.accuracy };
            }
            // Only update if moved more than 30 meters (reduced from 50) to be more responsive but prevent jitter
            const dist = getDistance(prev.lat, prev.lng, newLat, newLng);
            if (dist > 30) {
              return { lat: newLat, lng: newLng, accuracy: position.coords.accuracy };
            }
            return prev;
          });
        },
        (error) => {
          console.error("Location watch error:", error);
          // Do not forcefully reset to default if we already had a location, just log error
          if (!userLocation) {
            // Only use fallback if we strictly have no location yet
            // setUserLocation({ lat: 33.6844, lng: 73.0479 }); 
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000, // Increased timeout 
          maximumAge: 1000 // Accept slightly older cached positions for speed
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleLocationSelect = useCallback((location: { lat: number; lng: number, address: string }) => {
    setSearchCenter({
      lat: location.lat,
      lng: location.lng,
      accuracy: 0 // Not relevant for manual search
    });
    setSearchAddress(location.address);
    // Removed clearing searchQuery
    // Maybe show a toast "Location set to ..."
  }, []);

  // Fetch programs from Supabase
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      // Simulate network delay for effect
      await new Promise(resolve => setTimeout(resolve, 500));

      const { STATIC_PROGRAMS } = await import('./src/data/staticPrograms');

      // Calculate distances for sorting
      const effectiveLocation = searchCenter || userLocation || { lat: 33.6844, lng: 73.0479 };
      const mappedPrograms = STATIC_PROGRAMS.map(p => ({
        ...p,
        distance: getDistance(effectiveLocation.lat, effectiveLocation.lng, p.location.lat, p.location.lng) / 1000 // meters to km
      }));

      console.log("Loaded", mappedPrograms.length, "static programs");
      setPrograms(mappedPrograms);
      setLoading(false);
    };

    fetchPrograms();
  }, [userLocation, searchCenter]);

  const filteredPrograms = useMemo(() => {
    return programs
      .filter(p => {
        // Removed matchesSearch
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesRadius = !p.distance || p.distance <= radiusKm;
        return matchesCategory && matchesRadius;
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [selectedCategory, radiusKm, programs]);

  const handleMarkerClick = useCallback((program: Program) => setSelectedProgram(program), []);
  const handleViewOnMap = useCallback((program: Program) => {
    setSelectedProgram(program);
    setIsListView(false);
  }, []);


  // --- Swipe Logic ---
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY.current - touchEndY;

    // Swipe Up (Open)
    if (diffY > 50) {
      setIsListView(true);
    }
    // Swipe Down (Close)
    else if (diffY < -50) {
      setIsListView(false);
    }

    touchStartY.current = null;
  };

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="relative h-screen w-full bg-[#fdfcf6] flex flex-col md:flex-row overflow-hidden">

        {/* Sidebar Controls (Desktop) & Top Controls (Mobile) */}
        <div className="absolute top-0 left-0 right-0 z-[1001] p-4 pointer-events-none md:max-w-md md:relative md:bg-white md:shadow-2xl md:z-10 md:pointer-events-auto md:p-8 md:h-full md:flex md:flex-col md:border-r md:border-slate-100">

          {/* Brand Logo - Desktop Header */}
          <div className="hidden md:flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top duration-700">
            <img src={LOGO_URL} alt="Dora Quran Logo" className="w-48 h-auto object-contain mb-2 drop-shadow-sm" />
            <div className="w-12 h-1 bg-[#d4af37] rounded-full"></div>
          </div>

          {/* Search Bar Container */}
          <div className="pointer-events-auto glass-midnight rounded-xl p-3 mb-6 shadow-sm md:bg-white md:shadow-none md:p-0 md:border-none">
            {/* Mobile Logo Branding */}
            <div className="md:hidden flex justify-center py-2 mb-2">
              <img src={LOGO_URL} alt="Logo" className="h-10 w-auto brightness-0 invert opacity-90" />
            </div>

            <div className="mb-3 px-1">
              <LocationSearch onLocationSelect={handleLocationSelect} />
            </div>

          </div>

          {/* Scrollable Programs List (Desktop Only Layout) */}
          <div className="hidden md:flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-2xl font-black text-[#0f172a]">Nearby Events</h2>
              <div className="flex items-center gap-2">
                <Icons.Crescent />
                <span className="text-xs font-bold text-[#065f46] px-3 py-1 bg-[#065f46]/10 rounded-full">{loading ? '...' : filteredPrograms.length} active</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-3 space-y-1 custom-scroll">
              {loading ? (
                // Skeleton Loader
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex gap-4">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPrograms.length > 0 ? (
                filteredPrograms.map((p, index) => (
                  <div key={p.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: `${index * 100}ms` }}>
                    <ProgramCard
                      program={p}
                      isActive={selectedProgram?.id === p.id}
                      onViewOnMap={handleViewOnMap}
                      onOpenDetails={setSelectedProgram}
                    />
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">No programs in this area.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Map View */}
        <div className="flex-1 relative h-full">
          <GoogleMap
            programs={filteredPrograms}
            userLocation={userLocation}
            selectedProgram={selectedProgram}
            onMarkerClick={handleMarkerClick}
            searchLocation={searchCenter}
            onClearSearch={() => setSearchCenter(null)}
          />

          {/* Floating View Toggle (Mobile) */}
          <div className="absolute bottom-32 left-0 right-0 z-[1001] flex justify-center md:hidden pointer-events-none">
            <button
              onClick={() => setIsListView(!isListView)}
              className="pointer-events-auto flex items-center gap-3 bg-[#0f172a] text-white px-6 py-3 rounded-full shadow-lg font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform border border-white/20"
            >
              {isListView ? (
                <><Icons.Navigation /> Open Map</>
              ) : (
                <><Icons.Crescent /> Discover List</>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Sheet for Mobile Discovery - WITH SWIPE */}
        <div
          className={`fixed inset-x-0 bottom-0 z-[1002] bg-[#fdfcf6] rounded-t-2xl shadow-[0_-10px_40px_-15px_rgba(15,23,42,0.2)] transition-all duration-500 md:hidden touch-none ${isListView ? 'translate-y-0 h-[82%]' : 'translate-y-[calc(100%-90px)] h-[82%]'}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto my-6 cursor-pointer hover:bg-[#d4af37] transition-colors"
            onClick={() => setIsListView(!isListView)}
          ></div>
          <div className="px-8 pb-4">
            <div className="flex flex-col mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0f172a]">Nearby Tonight</h2>
                <div className="p-2 bg-[#065f46]/10 rounded-lg text-[#065f46]"><Icons.Lantern /></div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <img src={LOGO_URL} alt="Logo" className="h-6 w-auto opacity-70" />
                <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Discover Programs</span>
              </div>
            </div>

            {/* Scrollable Content inside Sheet - Stop propagation so swipe doesn't conflict with scroll if needed, though simple setup usually fine */}
            <div
              className="overflow-y-auto h-[calc(100vh*0.82-160px)] space-y-4 pb-24 custom-scroll"
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex gap-4">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPrograms.length > 0 ? (
                filteredPrograms.map((p, index) => (
                  <div key={p.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: `${index * 100}ms` }}>
                    <ProgramCard
                      program={p}
                      isActive={selectedProgram?.id === p.id}
                      onViewOnMap={handleViewOnMap}
                      onOpenDetails={setSelectedProgram}
                    />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-slate-100">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6"><Icons.Crescent /></div>
                  <p className="text-[#0f172a] font-black text-xl mb-2">Finding light...</p>
                  <p className="text-slate-400 text-sm max-w-[240px]">We couldn't find programs within your current filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Detail Overlay */}
        {selectedProgram && (
          <ProgramDetail
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
          />
        )}

        {/* Onboarding & Install Prompt */}
        <InstallPrompt />
      </div>
    </APIProvider >
  );
};

export default App;

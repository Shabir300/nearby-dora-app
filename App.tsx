
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Program, UserLocation } from './types';
import { Icons, CATEGORIES } from './constants';
import { Map as GoogleMap } from './components/Map';
import { ProgramCard } from './components/ProgramCard';
import { ProgramDetail } from './components/ProgramDetail';
import { InstallPrompt } from './components/InstallPrompt';
import { LocationSearch } from './components/LocationSearch';
import { supabase } from './services/supabase';
import { initOneSignal } from './services/notifications';

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
  const [radiusKm, setRadiusKm] = useState(15);
  const [showFilters, setShowFilters] = useState(false);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const LOGO_URL = "https://crm.pcirealestate.site/wp-content/uploads/2026/01/Logo-DTQ-app.png";

  useEffect(() => {
    // geolocation init (Live Tracking)
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          // Only update if moved significantly to avoid re-renders (optional optimization, but simple set is fine for now)
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error("Location error:", error);
          // If detailed error handling needed, can add toast here
          // Fallback only if no location ever found? 
          // Better to keep existing if available, or set default only on init failure.
          if (!userLocation) {
            setUserLocation({ lat: 33.6844, lng: 73.0479 });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }

    // OneSignal init
    initOneSignal();
    // OneSignal init
    initOneSignal();
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
      // Use searchCenter if active, otherwise userLocation, otherwise default
      const effectiveLocation = searchCenter || userLocation || { lat: 33.6844, lng: 73.0479 };
      const { lat, lng } = effectiveLocation;

      const { data, error } = await supabase
        .rpc('nearby_programs', {
          user_lat: lat,
          user_lng: lng,
          radius_km: 10000 // Huge radius to ensure we get data, relying on local filtering for specific view
        });

      if (data === null || (Array.isArray(data) && data.length === 0)) {
        console.log("No data returned from RPC near", lat, lng);
      } else {
        console.log("Fetched", data.length, "programs");
      }

      if (error) {
        console.error('Error fetching programs:', error);
        // Fallback? No, just show empty or error
      } else if (data) {
        // Map Supabase result to Program type
        // Map Supabase result to Program type and Deduplicate
        const uniquePrograms = new Map();

        data.forEach((item: any) => {
          // Normalize name: remove "Dora Quran" and whitespace
          const cleanName = (item.name || '').replace(/dora\s*quran/gi, '').replace(/^[-\s]+/, '').trim() || item.venue;
          const cleanVenue = (item.venue || '').trim();

          // Create a unique key based on venue and rough location to filter duplicates
          const uniqueKey = `${cleanVenue.toLowerCase()}-${item.lat.toFixed(4)}-${item.lng.toFixed(4)}`;

          if (!uniquePrograms.has(uniqueKey)) {
            uniquePrograms.set(uniqueKey, {
              id: item.id,
              name: cleanName, // Use cleaned name globally
              venue: item.venue,
              address: item.address,
              location: { lat: item.lat, lng: item.lng },
              contact: item.contact,
              organizer: item.organizer,
              timing: item.timing,
              category: item.category,
              googleMapsLink: item.google_maps_link,
              distance: item.dist_km
            });
          }
        });

        const mappedPrograms: Program[] = Array.from(uniquePrograms.values());

        setPrograms(mappedPrograms);
      }
      setLoading(false);
    };

    fetchPrograms();
  }, [userLocation, searchCenter]); // Re-fetch if user moves or searches new location

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

        {/* Bottom Sheet for Mobile Discovery */}
        <div className={`fixed inset-x-0 bottom-0 z-[1002] bg-[#fdfcf6] rounded-t-2xl shadow-[0_-10px_40px_-15px_rgba(15,23,42,0.2)] transition-all duration-500 md:hidden ${isListView ? 'translate-y-0 h-[82%]' : 'translate-y-[calc(100%-90px)] h-[82%]'}`}>
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
            <div className="overflow-y-auto h-[calc(100vh*0.82-160px)] space-y-4 pb-24 custom-scroll">
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

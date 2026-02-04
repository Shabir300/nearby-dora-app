
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Program, UserLocation } from './types';
import { Icons, CATEGORIES, CITIES } from './constants';
import { Map as GoogleMap } from './components/Map';
import { ProgramCard } from './components/ProgramCard';
import { ProgramDetail } from './components/ProgramDetail';
import { InstallPrompt } from './components/InstallPrompt';
import { LocationSearch } from './components/LocationSearch';
import { PrayerTimes } from './components/PrayerTimes';
import { QuranIndex } from './components/Quran/QuranIndex';
import { QuranReader } from './components/Quran/QuranReader';
import { supabase } from './services/supabase';
import { AboutPage } from './components/AboutPage';

// Forced reload timestamp: 9

// Simple Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center">
          <h2 className="text-red-500 font-bold mb-2">Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl"
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const [searchCenter, setSearchCenter] = useState<UserLocation | null>(null); // For manual location search
  const [searchAddress, setSearchAddress] = useState<string>(''); // To display "Searching near..."
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [radiusKm, setRadiusKm] = useState(15);
  const [showFilters, setShowFilters] = useState(false);

  const [activeTab, setActiveTab] = useState<'events' | 'prayers' | 'quran' | 'about'>(() => {
    return (localStorage.getItem('activeTab') as 'events' | 'prayers' | 'quran' | 'about') || 'events';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const [quranView, setQuranView] = useState<{ mode: 'juz' | 'surah', id: number } | null>(null);

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
            // Only update if moved more than 30 meters to be more responsive but prevent jitter
            const dist = getDistance(prev.lat, prev.lng, newLat, newLng);
            if (dist > 30) {
              return { lat: newLat, lng: newLng, accuracy: position.coords.accuracy };
            }
            return prev;
          });
        },
        (error) => {
          console.error("Location watch error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleLocationSelect = useCallback((location: { lat: number; lng: number, address: string }) => {
    setSearchCenter({
      lat: location.lat,
      lng: location.lng,
      accuracy: 0
    });
    setSearchAddress(location.address);
  }, []);

  // Fetch programs from Supabase
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const { STATIC_PROGRAMS } = await import('./src/data/staticPrograms');

      const effectiveLocation = searchCenter || userLocation || { lat: 33.6844, lng: 73.0479 };
      const mappedPrograms = STATIC_PROGRAMS.map(p => ({
        ...p,
        distance: getDistance(effectiveLocation.lat, effectiveLocation.lng, p.location.lat, p.location.lng) / 1000 // meters to km
      }));

      setPrograms(mappedPrograms);
      setLoading(false);
    };

    fetchPrograms();
  }, [userLocation, searchCenter]);

  const filteredPrograms = useMemo(() => {
    return programs
      .filter(p => {
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

    if (diffY > 50) {
      setIsListView(true);
    } else if (diffY < -50) {
      setIsListView(false);
    }

    touchStartY.current = null;
  };

  const effectiveLocationForPrayers = searchCenter || userLocation || { lat: 33.6844, lng: 73.0479, name: 'Islamabad' };
  const prayerLocation = {
    ...effectiveLocationForPrayers,
    name: searchAddress || (userLocation ? 'Current Location' : 'Islamabad')
  };

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="relative h-screen w-full bg-[#fdfcf6] flex flex-col md:flex-row overflow-hidden pb-20 md:pb-0">

        {/* --- BOTTOM NAVIGATION BAR (Mobile Only) --- */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-100 flex items-center justify-between px-4 z-[3000] pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex flex-col items-center gap-1 flex-1 transition-all duration-300 ${activeTab === 'events' ? 'text-[#064e3b]' : 'text-slate-400'}`}
          >
            <div className={`w-12 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${activeTab === 'events' ? 'bg-[#064e3b]/10 scale-105' : 'hover:bg-slate-50'}`}>
              <Icons.MapPin className={activeTab === 'events' ? 'w-6 h-6' : 'w-5 h-5 opacity-70'} />
            </div>
            <span className={`text-[10px] ${activeTab === 'events' ? 'font-black' : 'font-bold'} uppercase tracking-[0.15em]`}>Map</span>
          </button>
          <button
            onClick={() => setActiveTab('prayers')}
            className={`flex flex-col items-center gap-1 flex-1 transition-all duration-300 ${activeTab === 'prayers' ? 'text-[#064e3b]' : 'text-slate-400'}`}
          >
            <div className={`w-12 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${activeTab === 'prayers' ? 'bg-[#064e3b]/10 scale-105' : 'hover:bg-slate-50'}`}>
              <Icons.Clock className={activeTab === 'prayers' ? 'w-6 h-6' : 'w-5 h-5 opacity-70'} />
            </div>
            <span className={`text-[10px] ${activeTab === 'prayers' ? 'font-black' : 'font-bold'} uppercase tracking-[0.15em]`}>Prayers</span>
          </button>
          <button
            onClick={() => setActiveTab('quran')}
            className={`flex flex-col items-center gap-1 flex-1 transition-all duration-300 ${activeTab === 'quran' ? 'text-[#064e3b]' : 'text-slate-400'}`}
          >
            <div className={`w-12 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${activeTab === 'quran' ? 'bg-[#064e3b]/10 scale-105' : 'hover:bg-slate-50'}`}>
              <Icons.BookOpen className={activeTab === 'quran' ? 'w-6 h-6' : 'w-5 h-5 opacity-70'} />
            </div>
            <span className={`text-[10px] ${activeTab === 'quran' ? 'font-black' : 'font-bold'} uppercase tracking-[0.15em]`}>Quran</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center gap-1 flex-1 transition-all duration-300 ${activeTab === 'about' ? 'text-[#064e3b]' : 'text-slate-400'}`}
          >
            <div className={`w-12 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${activeTab === 'about' ? 'bg-[#064e3b]/10 scale-105' : 'hover:bg-slate-50'}`}>
              <Icons.Info className={activeTab === 'about' ? 'w-6 h-6' : 'w-5 h-5 opacity-70'} />
            </div>
            <span className={`text-[10px] ${activeTab === 'about' ? 'font-black' : 'font-bold'} uppercase tracking-[0.15em]`}>About</span>
          </button>
        </div>


        {/* --- CONTENT AREA --- */}
        {activeTab === 'events' && (
          <>
            <div className={`absolute left-0 right-0 z-[5001] p-4 pointer-events-none md:max-w-md md:relative md:bg-white md:shadow-2xl md:z-10 md:pointer-events-auto md:p-8 md:h-full md:flex md:flex-col md:border-r md:border-slate-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isListView ? 'bottom-[65%] top-auto' : 'bottom-24 top-auto md:top-0 md:bottom-auto'}`}>

              <div className="hidden md:flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top duration-700">
                <img src={LOGO_URL} alt="Dora Quran Logo" className="w-48 h-auto object-contain mb-2 drop-shadow-sm" />
                <div className="w-12 h-1 bg-[#d4af37] rounded-full"></div>

                <div className="flex gap-4 mt-6">
                  <button onClick={() => setActiveTab('events')} className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-[#064e3b] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Events Map</button>
                  <button onClick={() => setActiveTab('prayers')} className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'prayers' ? 'bg-[#064e3b] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Prayer Times</button>
                  <button onClick={() => setActiveTab('quran')} className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'quran' ? 'bg-[#064e3b] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Quran</button>
                  <button onClick={() => setActiveTab('about')} className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'about' ? 'bg-[#064e3b] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-2">
                      <Icons.Info />
                      <span>About</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className={`pointer-events-auto glass-midnight rounded-[1.5rem] p-4 shadow-2xl md:bg-white md:shadow-none md:p-0 md:border-none duration-500 transition-all ${selectedProgram ? 'opacity-0 scale-95 pointer-events-none translate-y-[-20px]' : 'opacity-100 scale-100'}`}>
                <div className="md:hidden flex justify-between items-center py-2 mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <img src={LOGO_URL} alt="Logo" className="h-8 w-auto brightness-0 invert opacity-90" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em] leading-none">Nearby</span>
                      <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">Live View</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsListView(true)}
                    className="px-5 py-2.5 bg-[#d4af37] text-[#0f172a] rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-[0_4px_20px_-5px_rgba(212,175,55,0.5)] active:scale-95 transition-all hover:brightness-110"
                  >
                    Discover List
                  </button>
                </div>

                <div className="mb-3 px-1">
                  <LocationSearch onLocationSelect={handleLocationSelect} />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 px-1 custom-scroll snap-x">
                  <button
                    onClick={() => {
                      setSearchCenter(null);
                      setSearchAddress('');
                    }}
                    className={`snap-center flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${!searchCenter
                      ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-[#0f172a]'
                      }`}
                  >
                    <div className="flex items-center gap-1">
                      <Icons.Crosshairs />
                      Current Location
                    </div>
                  </button>

                  {CITIES.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        setSearchCenter({ lat: city.lat, lng: city.lng, accuracy: 0 });
                        setSearchAddress(city.name);
                      }}
                      className={`snap-center flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${searchAddress === city.name
                        ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#0f172a]'
                        }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

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

            <div className="flex-1 relative h-full">
              <GoogleMap
                programs={filteredPrograms}
                userLocation={userLocation}
                selectedProgram={selectedProgram}
                onMarkerClick={handleMarkerClick}
                searchLocation={searchCenter}
                onClearSearch={() => setSearchCenter(null)}
              />
            </div>

            <div
              className={`fixed inset-x-0 bottom-0 z-[1002] bg-[#fdfcf6] rounded-t-2xl shadow-[0_-20px_60px_-15px_rgba(15,23,42,0.3)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden touch-none pb-20 ${isListView ? 'translate-y-0 h-[65%]' : 'translate-y-[120%] h-[65%]'} pointer-events-auto`}
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
                    <button onClick={() => setIsListView(false)} className="p-2 bg-slate-100 rounded-full"><Icons.Close /></button>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <img src={LOGO_URL} alt="Logo" className="h-6 w-auto opacity-70" />
                    <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Discover Programs</span>
                  </div>
                </div>

                <div
                  className="overflow-y-auto h-[calc(100vh*0.65-160px)] space-y-4 pb-24 custom-scroll"
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

            {selectedProgram && (
              <ProgramDetail
                program={selectedProgram}
                onClose={() => setSelectedProgram(null)}
              />
            )}
          </>
        )}

        {activeTab === 'prayers' && (
          <div className="flex-1 h-full w-full">
            <div className="h-full bg-[#fdfcf6] md:flex">
              <div className="hidden md:flex flex-col w-full md:max-w-md bg-white border-r border-slate-100 p-8">
                <div className="flex flex-col items-center mb-10">
                  <img src={LOGO_URL} alt="Dora Quran Logo" className="w-48 h-auto object-contain mb-2 drop-shadow-sm" />
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setActiveTab('events')} className={`px-4 py-2 rounded-full font-bold text-sm ${activeTab === 'events' ? 'bg-[#004d33] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Events Map</button>
                    <button onClick={() => setActiveTab('prayers')} className={`px-4 py-2 rounded-full font-bold text-sm ${activeTab === 'prayers' ? 'bg-[#004d33] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Prayer Times</button>
                    <button onClick={() => setActiveTab('quran')} className={`px-4 py-2 rounded-full font-bold text-sm ${activeTab === 'quran' ? 'bg-[#004d33] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Quran</button>
                    <button onClick={() => setActiveTab('about')} className={`px-4 py-2 rounded-full font-bold text-sm ${activeTab === 'about' ? 'bg-[#004d33] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-2">
                        <Icons.Info />
                        <span>About</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-700 mb-2">Location Settings</h3>
                  <p className="text-xs text-slate-500 mb-4">Prayer times are calculated based on your selected city or current location.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setSearchCenter(null); setSearchAddress(''); }} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs hover:border-slate-800 transition-colors">Current Location</button>
                    {CITIES.slice(0, 5).map(c => (
                      <button key={c.name} onClick={() => { setSearchCenter({ lat: c.lat, lng: c.lng, accuracy: 0 }); setSearchAddress(c.name); }} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs hover:border-slate-800 transition-colors">{c.name}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 h-full overflow-y-auto">
                <PrayerTimes location={prayerLocation} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quran' && (
          <div className="flex-1 h-full w-full bg-[#fdfcf6]">
            <ErrorBoundary>
              {quranView ? (
                <QuranReader
                  mode={quranView.mode}
                  id={quranView.id}
                  onBack={() => setQuranView(null)}
                  onNavigate={(mode, id) => setQuranView({ mode, id })}
                />
              ) : (
                <QuranIndex onSelect={(mode, id) => setQuranView({ mode, id })} onClose={() => setActiveTab('events')} />
              )}
            </ErrorBoundary>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="flex-1 h-full w-full bg-[#fdfcf6]">
            <div className="h-full bg-[#fdfcf6] md:flex">
              <div className="hidden md:flex flex-col w-full md:max-w-md bg-white border-r border-slate-100 p-8">
                <div className="flex flex-col items-center mb-10">
                  <img src={LOGO_URL} alt="Dora Quran Logo" className="w-48 h-auto object-contain mb-2 drop-shadow-sm" />
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    <button onClick={() => setActiveTab('events')} className={`px-4 py-2 rounded-full font-bold text-sm ${activeTab === 'events' ? 'bg-[#004d33] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Events Map</button>
                    <button onClick={() => setActiveTab('prayers')} className={`px-4 py-2 rounded-full font-bold text-sm ${activeTab === 'prayers' ? 'bg-[#004d33] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Prayer Times</button>
                    <button onClick={() => setActiveTab('quran')} className={`px-4 py-2 rounded-full font-bold text-sm ${activeTab === 'quran' ? 'bg-[#004d33] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Quran</button>
                    <button onClick={() => setActiveTab('about')} className={`px-4 py-2 rounded-full font-bold text-sm ${activeTab === 'about' ? 'bg-[#004d33] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-2">
                        <Icons.Info />
                        <span>About</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full overflow-hidden">
                <AboutPage />
              </div>
            </div>
          </div>
        )}

        <InstallPrompt />
      </div>
    </APIProvider>
  );
};

export default App;

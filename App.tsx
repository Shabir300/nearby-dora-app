
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Program, UserLocation } from './types';
import { Icons, CATEGORIES } from './constants';
import { Map } from './components/Map';
import { ProgramCard } from './components/ProgramCard';
import { ProgramDetail } from './components/ProgramDetail';
import { InstallPrompt } from './components/InstallPrompt';
import { supabase } from './services/supabase';
import { initOneSignal } from './services/notifications';

const App: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [radiusKm, setRadiusKm] = useState(15);
  const [showFilters, setShowFilters] = useState(false);

  const LOGO_URL = "https://crm.pcirealestate.site/wp-content/uploads/2026/01/Logo-DTQ-app.png";

  useEffect(() => {
    // geolocation init
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        }),
        () => setUserLocation({ lat: 33.6844, lng: 73.0479 })
      );
    }

    // OneSignal init
    initOneSignal();
  }, []);

  // Fetch programs from Supabase
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      const { lat, lng } = userLocation || { lat: 33.6844, lng: 73.0479 };

      const { data, error } = await supabase
        .rpc('nearby_programs', {
          user_lat: lat,
          user_lng: lng,
          radius_km: 5000 // Fetch a large area initially, filter locally for speed or use dynamic radius
        });

      if (error) {
        console.error('Error fetching programs:', error);
        // Fallback? No, just show empty or error
      } else if (data) {
        // Map Supabase result to Program type
        const mappedPrograms: Program[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          venue: item.venue,
          address: item.address,
          location: { lat: item.lat, lng: item.lng },
          contact: item.contact,
          organizer: item.organizer,
          timing: item.timing,
          category: item.category,
          googleMapsLink: item.google_maps_link,
          distance: item.dist_km // The RPC returns this directly
        }));

        setPrograms(mappedPrograms);
      }
      setLoading(false);
    };

    fetchPrograms();
  }, [userLocation]); // Re-fetch if user moves drastically, usually just once on load

  const filteredPrograms = useMemo(() => {
    return programs
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.venue.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesRadius = !p.distance || p.distance <= radiusKm;
        return matchesSearch && matchesCategory && matchesRadius;
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [searchQuery, selectedCategory, radiusKm, programs]);

  const handleMarkerClick = useCallback((program: Program) => setSelectedProgram(program), []);
  const handleViewOnMap = useCallback((program: Program) => {
    setSelectedProgram(program);
    setIsListView(false);
  }, []);

  return (
    <div className="relative h-screen w-full bg-[#fdfcf6] flex flex-col md:flex-row overflow-hidden">

      {/* Sidebar Controls (Desktop) & Top Controls (Mobile) */}
      <div className="absolute top-0 left-0 right-0 z-[1001] p-4 pointer-events-none md:max-w-md md:relative md:bg-white md:shadow-2xl md:z-10 md:pointer-events-auto md:p-8 md:h-full md:flex md:flex-col md:border-r md:border-slate-100">

        {/* Brand Logo - Desktop Header */}
        <div className="hidden md:flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top duration-700">
          <img src={LOGO_URL} alt="Dora Quran Logo" className="w-48 h-auto object-contain mb-2 drop-shadow-sm" />
          <div className="w-12 h-1 bg-[#d4af37] rounded-full"></div>
        </div>

        {/* Search Bar Container */}
        <div className="pointer-events-auto glass-midnight rounded-[32px] p-2 mb-6 border border-white/20 shadow-2xl md:bg-white md:shadow-none md:p-0 md:border-none">
          {/* Mobile Logo Branding */}
          <div className="md:hidden flex justify-center py-2 mb-2">
            <img src={LOGO_URL} alt="Logo" className="h-10 w-auto brightness-0 invert opacity-90" />
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="flex-1 flex items-center bg-white/10 md:bg-slate-50 rounded-2xl px-5 py-3 border border-white/10 md:border-slate-100 transition-all focus-within:ring-2 focus-within:ring-[#065f46]">
              <span className="text-[#d4af37]"><Icons.Search /></span>
              <input
                type="text"
                placeholder="Find a program..."
                className="bg-transparent border-none outline-none w-full text-white md:text-slate-700 text-sm font-semibold ml-3 placeholder:text-white/40 md:placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4 rounded-2xl transition-all duration-300 ${showFilters ? 'bg-[#d4af37] text-white' : 'bg-white/10 md:bg-white text-white md:text-slate-600 border border-white/10 md:border-slate-200'}`}
            >
              <Icons.Filter />
            </button>
          </div>

          {showFilters && (
            <div className="p-6 bg-[#0f172a] md:bg-slate-50 rounded-[28px] mt-2 space-y-5 animate-in slide-in-from-top duration-300">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] font-black text-white/40 md:text-slate-400 uppercase tracking-widest">Search Radius</p>
                  <span className="text-xs font-bold text-[#d4af37]">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 md:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                />
              </div>

              <div>
                <p className="text-[10px] font-black text-white/40 md:text-slate-400 uppercase tracking-widest mb-3">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${selectedCategory === cat ? 'bg-[#d4af37] text-white shadow-lg' : 'bg-white/5 md:bg-white text-white/60 md:text-slate-500 border border-white/10 md:border-slate-200 hover:border-[#d4af37]'}`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Programs List (Desktop Only Layout) */}
        <div className="hidden md:flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-2xl font-black text-[#0f172a]">Nearby Events</h2>
            <div className="flex items-center gap-2">
              <Icons.Crescent />
              <span className="text-xs font-bold text-[#065f46] px-3 py-1 bg-[#065f46]/10 rounded-full">{filteredPrograms.length} active</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-3 space-y-1 custom-scroll">
            {loading ? (
              <div className="py-20 text-center"><p className="text-slate-400">Loading programs...</p></div>
            ) : filteredPrograms.length > 0 ? (
              filteredPrograms.map(p => (
                <ProgramCard
                  key={p.id}
                  program={p}
                  isActive={selectedProgram?.id === p.id}
                  onViewOnMap={handleViewOnMap}
                  onOpenDetails={setSelectedProgram}
                />
              ))
            ) : (
              <div className="py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No programs in this area.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Map View */}
      <div className="flex-1 relative h-full">
        <Map
          programs={filteredPrograms}
          userLocation={userLocation}
          selectedProgram={selectedProgram}
          onMarkerClick={handleMarkerClick}
        />

        {/* Floating View Toggle (Mobile) */}
        <div className="absolute bottom-32 left-0 right-0 z-[1001] flex justify-center md:hidden pointer-events-none">
          <button
            onClick={() => setIsListView(!isListView)}
            className="pointer-events-auto flex items-center gap-3 bg-[#0f172a] text-white px-8 py-4 rounded-full shadow-2xl font-black text-xs uppercase tracking-widest active:scale-90 transition-transform border border-white/20"
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
      <div className={`fixed inset-x-0 bottom-0 z-[1002] bg-[#fdfcf6] rounded-t-[48px] shadow-[0_-20px_60px_-15px_rgba(15,23,42,0.3)] transition-all duration-500 md:hidden ${isListView ? 'translate-y-0 h-[82%]' : 'translate-y-[calc(100%-100px)] h-[82%]'}`}>
        <div
          className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto my-6 cursor-pointer hover:bg-[#d4af37] transition-colors"
          onClick={() => setIsListView(!isListView)}
        ></div>
        <div className="px-8 pb-4">
          <div className="flex flex-col mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#0f172a]">Nearby Tonight</h2>
              <div className="p-3 bg-[#065f46]/10 rounded-2xl text-[#065f46]"><Icons.Lantern /></div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <img src={LOGO_URL} alt="Logo" className="h-6 w-auto opacity-70" />
              <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Discover Programs</span>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh*0.82-160px)] space-y-4 pb-24 custom-scroll">
            {loading ? (
              <div className="py-10 text-center text-slate-400">Loading...</div>
            ) : filteredPrograms.length > 0 ? (
              filteredPrograms.map(p => (
                <ProgramCard
                  key={p.id}
                  program={p}
                  isActive={selectedProgram?.id === p.id}
                  onViewOnMap={handleViewOnMap}
                  onOpenDetails={setSelectedProgram}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[40px] border border-slate-100">
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
  );
};

export default App;

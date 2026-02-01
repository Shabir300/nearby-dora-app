
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  InfoWindow,
  useMap,
  Pin
} from '@vis.gl/react-google-maps';
import { Program, UserLocation } from '../types';
import { Icons } from '../constants';

interface MapProps {
  programs: Program[];
  userLocation: UserLocation | null;
  selectedProgram: Program | null;
  onMarkerClick: (program: Program) => void;
  searchLocation?: UserLocation | null;
  onClearSearch?: () => void;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''; // Still kept if needed for other things, or remove if unused. Actually Map uses it for APIProvider which we are removing.
// Actually, let's just remove the provider usage.
// We can remove API_KEY definition if not used elsewhere.
// MapController is below.

const MapController: React.FC<{ center: google.maps.LatLngLiteral; zoom: number; actionTrigger?: number }> = ({ center, zoom, actionTrigger }) => {
  const map = useMap();

  // Initial center setting
  useEffect(() => {
    if (map && !actionTrigger) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map]); // Run once on mount/map ready (or minimal deps) - actually we want to respect props but allow user interaction.

  // Triggered movements (e.g. from clicks)
  useEffect(() => {
    if (map && actionTrigger) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [actionTrigger, center, zoom, map]);

  return null;
};

export const Map: React.FC<MapProps> = ({ programs, userLocation, selectedProgram, onMarkerClick, searchLocation, onClearSearch }) => {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 33.6844, lng: 73.0479 });
  const [zoom, setZoom] = useState(13);
  const [actionTrigger, setActionTrigger] = useState(0); // Increment to force map moves
  const [hoveredProgram, setHoveredProgram] = useState<Program | null>(null);

  // Default Map Options
  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    mapId: '8d5cd3706be21a8f88c7c939', // Replace with your actual Map ID if you have one, or use a demo one
    disableDefaultUI: true,
    zoomControl: false,
    clickableIcons: false,
    gestureHandling: 'greedy', // improved mobile experience
  }), []);

  const [hasCenteredOnUser, setHasCenteredOnUser] = useState(false);

  useEffect(() => {
    if (selectedProgram) {
      setCenter({ lat: selectedProgram.location.lat, lng: selectedProgram.location.lng });
      setZoom(15);
      setActionTrigger(prev => prev + 1);
    } else if (searchLocation && !selectedProgram) {
      setCenter({ lat: searchLocation.lat, lng: searchLocation.lng });
      setZoom(14);
      setActionTrigger(prev => prev + 1);
    } else if (userLocation && !selectedProgram && !searchLocation && !hasCenteredOnUser) {
      // Auto-pan to user ONLY on the first location fix
      setCenter({ lat: userLocation.lat, lng: userLocation.lng });
      setZoom(14); // Good zoom level to see nearby programs
      setActionTrigger(prev => prev + 1);
      setHasCenteredOnUser(true);
    }
  }, [selectedProgram, searchLocation, userLocation, hasCenteredOnUser]);

  const handleLocateMe = useCallback(() => {
    if (userLocation) {
      if (onClearSearch) onClearSearch(); // Clear search to return to "Locate Me" mode
      setCenter({ lat: userLocation.lat, lng: userLocation.lng });
      setZoom(15);
      setActionTrigger(prev => prev + 1);
    } else {
      alert("Location not available yet. Please check permissions.");
    }
  }, [userLocation]);

  return (
    <div className="h-full w-full">
      <GoogleMap
        defaultCenter={center}
        defaultZoom={zoom}
        options={mapOptions}
        className="h-full w-full"
      >
        <MapController center={center} zoom={zoom} actionTrigger={actionTrigger} />

        {/* Controls Overlay */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-50">
          <button
            onClick={handleLocateMe}
            className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-700 hover:text-[#065f46] hover:bg-slate-50 transition-all active:scale-95 border border-slate-100"
            title="Locate Me"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <circle cx="12" cy="12" r="10" />
              <line x1="22" y1="12" x2="18" y2="12" />
              <line x1="6" y1="12" x2="2" y2="12" />
              <line x1="12" y1="6" x2="12" y2="2" />
              <line x1="12" y1="22" x2="12" y2="18" />
              <circle cx="12" cy="12" r="3" className="fill-current" />
            </svg>
          </button>
        </div>

        {userLocation && (
          <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }}>
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-black bg-[#0f172a] text-white px-2 py-0.5 rounded-full shadow-lg mb-1 tracking-widest uppercase border border-white/20 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-700">
                You are Here
              </div>
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-[#3b82f6] opacity-30 rounded-full animate-ping"></div>
                <div className="w-8 h-8 bg-[#3b82f6] border-4 border-white rounded-full shadow-2xl relative z-10 box-content"></div>
              </div>
            </div>
          </AdvancedMarker>
        )}

        {searchLocation && (
          <AdvancedMarker position={{ lat: searchLocation.lat, lng: searchLocation.lng }}>
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold bg-white px-2 py-1 rounded-md shadow-sm mb-1 text-slate-700">Searched Location</div>
              <div className="w-8 h-8 text-red-500 drop-shadow-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
            </div>
          </AdvancedMarker>
        )}

        {programs.map(program => {
          const isActive = selectedProgram?.id === program.id;

          return (
            <AdvancedMarker
              key={program.id}
              position={{ lat: program.location.lat, lng: program.location.lng }}
              onClick={() => onMarkerClick(program)}
              zIndex={isActive ? 10 : 1}
            >
              <div className="relative flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                {/* Premium Pin CSS Shape */}
                <div className={`relative ${isActive ? 'scale-110 drop-shadow-xl' : 'scale-100 drop-shadow-md'} transition-all duration-300`}>
                  <svg width="40" height="48" viewBox="0 0 384 512" className={`${isActive ? 'fill-[#d4af37]' : 'fill-[#065f46]'} stroke-white stroke-[15]`}>
                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                  </svg>
                  {/* Inner Icon */}
                  <div className="absolute top-[10px] left-1/2 -translate-x-1/2 text-white">
                    <div className="w-4 h-4"><Icons.Lantern /></div>
                  </div>
                </div>

                {/* Pulse Effect for Active */}
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 blur-sm rounded-full"></div>
                )}
              </div>
            </AdvancedMarker>
          );
        })}

        {selectedProgram && (
          <InfoWindow
            position={{ lat: selectedProgram.location.lat, lng: selectedProgram.location.lng }}
            pixelOffset={[0, -45]}
            onCloseClick={() => onMarkerClick(null as any)} // Hack to close logic if needed, or just let it stay
            headerDisabled={true}
          >
            <div className="p-1 font-bold text-[#065f46] text-sm">{selectedProgram.name}</div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};


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

interface MapProps {
  programs: Program[];
  userLocation: UserLocation | null;
  selectedProgram: Program | null;
  onMarkerClick: (program: Program) => void;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const MapController: React.FC<{ center: google.maps.LatLngLiteral; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [center, zoom, map]);
  return null;
};

export const Map: React.FC<MapProps> = ({ programs, userLocation, selectedProgram, onMarkerClick }) => {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 33.6844, lng: 73.0479 });
  const [zoom, setZoom] = useState(13);
  const [hoveredProgram, setHoveredProgram] = useState<Program | null>(null);

  // Default Map Options
  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    mapId: '8d5cd3706be21a8f88c7c939', // Replace with your actual Map ID if you have one, or use a demo one
    disableDefaultUI: true,
    zoomControl: false,
    clickableIcons: false,
    gestureHandling: 'greedy', // improved mobile experience
  }), []);

  useEffect(() => {
    if (selectedProgram) {
      setCenter({ lat: selectedProgram.location.lat, lng: selectedProgram.location.lng });
      setZoom(15);
    } else if (userLocation) {
      setCenter({ lat: userLocation.lat, lng: userLocation.lng });
    }
  }, [selectedProgram, userLocation]);

  if (!API_KEY) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-100 p-8 text-center">
        <div>
          <h3 className="text-xl font-bold text-red-600 mb-2">Google Maps API Key Missing</h3>
          <p className="text-slate-600">Please add VITE_GOOGLE_MAPS_API_KEY to your .env.local file.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <APIProvider apiKey={API_KEY}>
        <GoogleMap
          defaultCenter={center}
          defaultZoom={zoom}
          options={mapOptions}
          className="h-full w-full"
        >
          <MapController center={center} zoom={zoom} />

          {userLocation && (
            <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }}>
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full animate-ping"></div>
                <div className="w-8 h-8 bg-blue-500 border-4 border-white rounded-full shadow-2xl relative z-10"></div>
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
                <div className="relative flex flex-col items-center group">
                  <div className={`w-10 h-10 ${isActive ? 'bg-[#d4af37] scale-125' : 'bg-[#065f46]'} border-2 border-white rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-500`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M12 6.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" className="fill-white/20 stroke-none" />
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      <path d="M6 8h4" className="opacity-50" />
                      <path d="M6 12h4" className="opacity-50" />
                      <path d="M14 8h4" className="opacity-50" />
                      <path d="M14 12h4" className="opacity-50" />
                    </svg>
                  </div>
                  <div className="w-1 h-3 bg-[#065f46] rounded-full mt-[-2px]"></div>
                  {isActive && <div className="absolute inset-0 bg-[#d4af37] blur-lg opacity-40 animate-pulse rounded-full"></div>}
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
      </APIProvider>
    </div>
  );
};

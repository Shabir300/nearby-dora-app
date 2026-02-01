import React, { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Icons } from '../constants';

interface LocationSearchProps {
    onLocationSelect: (location: { lat: number; lng: number, address: string }) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
    const placesLibrary = useMapsLibrary('places');
    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!placesLibrary || !inputRef.current) return;

        const options = {
            fields: ['geometry', 'formatted_address'],
        };

        const autocompleteInstance = new placesLibrary.Autocomplete(inputRef.current, options);
        setAutocomplete(autocompleteInstance);

        autocompleteInstance.addListener('place_changed', () => {
            const place = autocompleteInstance.getPlace();
            if (place.geometry && place.geometry.location) {
                onLocationSelect({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    address: place.formatted_address || ''
                });
            }
        });

    }, [placesLibrary]);

    return (
        <div className="w-full">
            <div className="flex items-center bg-white/10 md:bg-slate-50 rounded-lg px-4 py-3 border border-white/10 md:border-slate-100 transition-all focus-within:ring-1 focus-within:ring-[#065f46]">
                <span className="text-[#d4af37]"><Icons.MapPin /></span>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for an area..."
                    className="bg-transparent border-none outline-none w-full text-white md:text-slate-700 text-sm font-semibold ml-3 placeholder:text-white/40 md:placeholder:text-slate-400"
                />
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { X, MapPin, Check, Navigation, Search, Loader2 } from 'lucide-react';
import { getCurrentGPSLocation } from '../../services/locationService';
import { googleGeocodeAddress } from '../../services/mapsService';

const POPULAR_LOCATIONS = [
    { city: 'Hyderabad, India', tag: 'Nizami Heritage & Biryani', lat: 17.3850, lng: 78.4867 },
    { city: 'Bengaluru, India', tag: 'Garden & Craft Coffee', lat: 12.9716, lng: 77.5946 },
    { city: 'Mumbai, India', tag: 'Marine Drive & Sea Breeze', lat: 19.0760, lng: 72.8777 },
    { city: 'New Delhi, India', tag: 'Capital & Monuments', lat: 28.6139, lng: 77.2090 },
    { city: 'Goa, India', tag: 'Beaches & Latin Quarter', lat: 15.2993, lng: 74.1240 },
    { city: 'Jaipur, India', tag: 'Palaces & Bazaars', lat: 26.9124, lng: 75.7873 },
    { city: 'Manali, India', tag: 'Alpine Snow & Trails', lat: 32.2432, lng: 77.1892 },
    { city: 'Kochi, Kerala, India', tag: 'Backwaters & Spices', lat: 9.9312, lng: 76.2673 },
    { city: 'Paris, France', tag: 'Eiffel & Seine Art', lat: 48.8566, lng: 2.3522 },
    { city: 'London, United Kingdom', tag: 'Thames & Royals', lat: 51.5074, lng: -0.1278 },
    { city: 'Tokyo, Japan', tag: 'Futuristic & Shrines', lat: 35.6762, lng: 139.6503 },
    { city: 'Bali, Indonesia', tag: 'Tropical & Rice Terraces', lat: -8.3405, lng: 115.0920 },
    { city: 'Rome, Italy', tag: 'Colosseum & History', lat: 41.9028, lng: 12.4964 },
    { city: 'Dubai, UAE', tag: 'Skyline & Desert Dunes', lat: 25.2048, lng: 55.2708 },
    { city: 'Santorini, Greece', tag: 'Aegean Caldera & Villas', lat: 36.3932, lng: 25.4615 },
    { city: 'New York, USA', tag: 'Manhattan & Broadway', lat: 40.7128, lng: -74.0060 },
];

export function ChangeLocationModal({
    isOpen,
    onClose,
    currentLocation,
    onSelectLocation
}) {
    const [query, setQuery] = useState('');
    const [isLocatingGPS, setIsLocatingGPS] = useState(false);

    if (!isOpen) return null;

    const filtered = POPULAR_LOCATIONS.filter((l) =>
        l.city.toLowerCase().includes(query.toLowerCase()) ||
        l.tag.toLowerCase().includes(query.toLowerCase())
    );

    const handleUseDeviceGPS = async () => {
        setIsLocatingGPS(true);
        const res = await getCurrentGPSLocation();
        setIsLocatingGPS(false);

        if (res.status === 'granted') {
            onSelectLocation(res.city, { lat: res.lat, lng: res.lng });
            onClose();
        }
    };

    const handleSelectCustomQuery = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const geocoded = await googleGeocodeAddress(query);
        const resolvedName = geocoded?.formatted || geocoded?.name || query.trim();
        const coords = { lat: geocoded?.lat || 17.3850, lng: geocoded?.lng || 78.4867 };

        onSelectLocation(resolvedName, coords);
        setQuery('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-odyssey-navy/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-odyssey-slate rounded-3xl max-w-sm w-full shadow-2xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 p-5 space-y-4 animate-in zoom-in-95 duration-200 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-odyssey-tan/30 dark:border-odyssey-brown/50 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy text-odyssey-brown dark:text-odyssey-tan flex items-center justify-center">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-odyssey-navy dark:text-odyssey-cream">
                                Change Location
                            </h3>
                            <p className="text-[11px] text-odyssey-slate dark:text-odyssey-tan">
                                Updates Near You, Radar & Trip Distances
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-odyssey-tan/80"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* GPS Trigger Button */}
                <button
                    type="button"
                    onClick={handleUseDeviceGPS}
                    disabled={isLocatingGPS}
                    className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
                >
                    {isLocatingGPS ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Acquiring Device GPS Satellite...</span>
                        </>
                    ) : (
                        <>
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Use Live Device GPS Coordinates</span>
                        </>
                    )}
                </button>

                {/* Search Form */}
                <form onSubmit={handleSelectCustomQuery} className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search any city or country (Press Enter)..."
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-odyssey-navy border border-odyssey-tan/40 dark:border-odyssey-brown/50 rounded-xl text-odyssey-navy dark:text-odyssey-cream focus:outline-none focus:border-odyssey-tan/40 dark:border-odyssey-brown/50"
                    />
                </form>

                {/* Locations List */}
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {filtered.length === 0 ? (
                        <button
                            type="button"
                            onClick={handleSelectCustomQuery}
                            className="w-full p-3 rounded-xl bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-left text-xs text-odyssey-brown dark:text-odyssey-tan font-bold flex items-center justify-between"
                        >
                            <span>Geocode & Set location to "{query}"</span>
                            <MapPin className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        filtered.map((item) => {
                            const isCurrent = currentLocation === item.city;
                            return (
                                <button
                                    key={item.city}
                                    onClick={() => {
                                        onSelectLocation(item.city, { lat: item.lat, lng: item.lng });
                                        onClose();
                                    }}
                                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-semibold transition-all ${
                                        isCurrent
                                            ? 'bg-odyssey-cream/60 dark:bg-odyssey-navy/80 dark:bg-odyssey-navy border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-odyssey-brown dark:text-odyssey-tan'
                                            : 'bg-slate-50/60 dark:bg-odyssey-navy/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-odyssey-navy dark:text-odyssey-cream'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <MapPin className={`w-3.5 h-3.5 ${isCurrent ? 'text-odyssey-brown dark:text-odyssey-tan' : 'text-slate-400'}`} />
                                        <span>{item.city}</span>
                                    </div>
                                    {isCurrent ? (
                                        <Check className="w-4 h-4 text-odyssey-brown dark:text-odyssey-tan" />
                                    ) : (
                                        <span className="text-[10px] text-slate-400 font-normal">{item.tag}</span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

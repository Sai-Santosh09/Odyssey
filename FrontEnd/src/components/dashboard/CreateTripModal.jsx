import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, ArrowRight, Loader2, Compass, CheckCircle2, Check, Layers } from 'lucide-react';
import { searchPlacesAutocomplete, verifyDestinationLocation } from '../../services/mapsService.js';
import { OdysseyLeafletMap } from '../map/OdysseyLeafletMap.jsx';
import { getDestinationDistance, getCoordinatesForLocation } from '../../services/locationService.js';

const VIBE_OPTIONS = [
    { id: 'adventure', label: 'Adventure', icon: '🏔️' },
    { id: 'relaxation', label: 'Relaxation', icon: '🏖️' },
    { id: 'food', label: 'Food', icon: '🍜' },
    { id: 'culture', label: 'Culture', icon: '🏛️' },
    { id: 'nature', label: 'Nature', icon: '🌲' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
];

const SUGGESTED_PLACES = [
    'Goa, India',
    'Manali, Himachal Pradesh',
    'Jaipur, Rajasthan',
    'Paris, France',
    'Berlin, Germany',
    'Tromsø, Norway',
    'Bali, Indonesia',
    'Kyoto, Japan'
];

export function CreateTripModal({
    isOpen,
    onClose,
    onCreateTrip,
    currentLocation = 'Hyderabad, India',
    currentCoords = null,
    initialDestination = null
}) {
    const defaultCoords = currentCoords || getCoordinatesForLocation(currentLocation);
    const [destination, setDestination] = useState('');
    const [destinationCoords, setDestinationCoords] = useState(defaultCoords);
    const [isVerified, setIsVerified] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [travelers, setTravelers] = useState(2);
    const [selectedVibes, setSelectedVibes] = useState(['adventure', 'food']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Sync initial destination when modal opens with prefilled destination
    useEffect(() => {
        if (!isOpen) return;

        if (initialDestination) {
            const destName = typeof initialDestination === 'string'
                ? initialDestination
                : (initialDestination.name || initialDestination.title || initialDestination.location || '');

            let destLat = initialDestination.lat;
            let destLng = initialDestination.lng;

            if (typeof destLat !== 'number' || typeof destLng !== 'number' || isNaN(destLat) || isNaN(destLng)) {
                if (initialDestination.coordinates?.lat && initialDestination.coordinates?.lng) {
                    destLat = initialDestination.coordinates.lat;
                    destLng = initialDestination.coordinates.lng;
                } else {
                    const coords = getCoordinatesForLocation(destName || initialDestination.region || '');
                    destLat = coords.lat;
                    destLng = coords.lng;
                }
            }

            setDestination(destName);
            setDestinationCoords({ lat: destLat, lng: destLng });
            setIsVerified(true);
            setShowPredictions(false);
        } else {
            const locCoords = currentCoords || getCoordinatesForLocation(currentLocation);
            setDestination('');
            setDestinationCoords(locCoords);
            setIsVerified(false);
            setShowPredictions(false);
        }
    }, [isOpen, initialDestination]);

    // When destination input changes, search via Places Autocomplete API & resolve coords
    useEffect(() => {
        if (!destination || destination.trim().length === 0) {
            setPredictions([]);
            setIsVerified(false);
            return;
        }

        // 1. Instant local coordinate matching
        const clean = destination.trim().toLowerCase();
        const local = getCoordinatesForLocation(clean);
        if (local && (local.lat !== 17.3850 || clean.includes('hyderabad'))) {
            setDestinationCoords({ lat: local.lat, lng: local.lng });
            setIsVerified(true);
        }

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearchingPlaces(true);
            const results = await searchPlacesAutocomplete(destination);
            setPredictions(results);
            setIsSearchingPlaces(false);

            // Auto verify if exact match
            const verification = await verifyDestinationLocation(destination);
            if (verification && typeof verification.lat === 'number' && typeof verification.lng === 'number') {
                setIsVerified(true);
                setDestinationCoords({ lat: verification.lat, lng: verification.lng });
            }
        }, 200);

        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, [destination]);

    if (!isOpen) return null;

    const handleSelectPrediction = (pred) => {
        const coords = (pred.lat && pred.lng)
            ? { lat: pred.lat, lng: pred.lng }
            : getCoordinatesForLocation(pred.name);
        setDestination(pred.name);
        setDestinationCoords({ lat: coords.lat || 15.2993, lng: coords.lng || 74.1240 });
        setIsVerified(true);
        setShowPredictions(false);
    };

    const toggleVibe = (vibeId) => {
        if (selectedVibes.includes(vibeId)) {
            setSelectedVibes(selectedVibes.filter((v) => v !== vibeId));
        } else {
            setSelectedVibes([...selectedVibes, vibeId]);
        }
    };

    const distInfo = destination.trim()
        ? getDestinationDistance(currentLocation, currentCoords, destination, destinationCoords)
        : null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!destination.trim()) return;

        setIsSubmitting(true);
        setTimeout(() => {
            const start = startDate ? new Date(startDate) : new Date();
            const end = endDate ? new Date(endDate) : new Date(Date.now() + 4 * 86400000);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

            const formattedDates = `${start.getDate()} ${start.toLocaleString('default', { month: 'short' })} – ${end.getDate()} ${end.toLocaleString('default', { month: 'short' })}`;

            const newTrip = {
                id: 'trip_' + Date.now(),
                title: `${destination.split(',')[0].trim()} Expedition`,
                location: destination,
                coordinates: destinationCoords,
                dates: formattedDates,
                travelers: parseInt(travelers, 10),
                totalDays: diffDays,
                currentDay: 1,
                activitiesCount: diffDays * 3,
                status: 'upcoming',
                vibe: selectedVibes.map((v) => VIBE_OPTIONS.find((opt) => opt.id === v)?.label).join(' & ') || 'Exploration',
                daysRemaining: 14,
                itinerary: [
                    { id: 101, startTime: '09:00 AM', endTime: '11:00 AM', title: `Arrival & check-in at ${destination.split(',')[0]}`, icon: '📍', category: 'Check-in', completed: false },
                    { id: 102, startTime: '11:30 AM', endTime: '01:30 PM', title: 'Neighborhood cafe & welcome drinks', icon: '☕', category: 'Food', completed: false },
                    { id: 103, startTime: '03:00 PM', endTime: '06:00 PM', title: 'Guided scenic sightseeing & landmark tour', icon: '🏛️', category: 'Culture', completed: false },
                    { id: 104, startTime: '07:30 PM', endTime: '10:00 PM', title: 'Sunset dinner & cultural evening', icon: '🌅', category: 'Dining', completed: false },
                ]
            };

            onCreateTrip(newTrip);
            setIsSubmitting(false);
            onClose();
        }, 400);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-odyssey-navy/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-odyssey-slate rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 p-5 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 transition-colors">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-odyssey-tan/30 dark:border-odyssey-brown/50 pb-3.5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy/10 dark:bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy/20 text-odyssey-brown dark:text-odyssey-tan flex items-center justify-center">
                            <Compass className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-odyssey-navy dark:text-odyssey-cream tracking-tight">
                                Create your trip
                            </h2>
                            <p className="text-xs text-odyssey-slate dark:text-odyssey-tan">
                                Leaflet map verification & trip setup.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-odyssey-slate dark:hover:text-slate-200 transition-colors"
                        aria-label="Close dialog"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Destination Search & Google Places Autocomplete */}
                    <div className="space-y-1.5 relative">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-odyssey-slate dark:text-odyssey-tan uppercase tracking-wider">
                                Where are you going?
                            </label>
                            {/* Verification Green Tick Badge */}
                            {isVerified && destination.trim() && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 animate-in fade-in zoom-in duration-200">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Verified Destination ✓</span>
                                </span>
                            )}
                        </div>

                        <div className="relative">
                            <MapPin className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isVerified ? 'text-emerald-500' : 'text-odyssey-brown dark:text-odyssey-tan'}`} />
                            <input
                                type="text"
                                required
                                value={destination}
                                onChange={(e) => {
                                    setDestination(e.target.value);
                                    setShowPredictions(true);
                                }}
                                onFocus={() => setShowPredictions(true)}
                                placeholder="Search destination with Places autocomplete..."
                                className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-odyssey-navy border border-odyssey-tan/40 dark:border-odyssey-brown/50 rounded-2xl text-xs sm:text-sm text-odyssey-navy dark:text-odyssey-cream placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F06536]/20 focus:border-odyssey-tan/40 dark:border-odyssey-brown/50 transition-all"
                            />
                            {isSearchingPlaces && (
                                <Loader2 className="w-4 h-4 text-slate-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
                            )}
                        </div>

                        {/* Autocomplete Predictions Dropdown */}
                        {showPredictions && predictions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white dark:bg-odyssey-navy rounded-2xl shadow-xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 max-h-48 overflow-y-auto py-1 animate-in fade-in duration-150">
                                {predictions.map((pred, idx) => (
                                    <button
                                        type="button"
                                        key={idx}
                                        onClick={() => handleSelectPrediction(pred)}
                                        className="w-full px-3.5 py-2 text-left text-xs font-semibold text-odyssey-navy dark:text-odyssey-cream hover:bg-odyssey-cream/60 dark:bg-odyssey-navy dark:hover:bg-orange-950/40 flex items-center justify-between gap-2 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <MapPin className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan flex-shrink-0" />
                                            <span className="truncate">{pred.name}</span>
                                        </div>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex-shrink-0">
                                            Verify ✓
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Quick Suggestions */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {SUGGESTED_PLACES.slice(0, 4).map((place) => (
                                <button
                                    type="button"
                                    key={place}
                                    onClick={() => {
                                        const coords = getCoordinatesForLocation(place);
                                        setDestination(place);
                                        setDestinationCoords({ lat: coords.lat, lng: coords.lng });
                                        setIsVerified(true);
                                        setShowPredictions(false);
                                    }}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-slate dark:text-odyssey-tan transition-colors"
                                >
                                    {place}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Accurate Distance Callout */}
                    {distInfo && destination.trim() && (
                        <div className="p-2.5 rounded-xl bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy border border-odyssey-tan/40 dark:border-odyssey-brown/50 flex items-center justify-between text-xs animate-in fade-in duration-200">
                            <span className="text-odyssey-slate dark:text-odyssey-tan">
                                Distance from <strong className="text-odyssey-navy dark:text-odyssey-cream">{currentLocation.split(',')[0]}</strong>:
                            </span>
                            <span className="font-bold text-odyssey-brown dark:text-odyssey-tan flex items-center gap-1">
                                <span>🚀 {distInfo.fullBadge}</span>
                            </span>
                        </div>
                    )}

                    {/* Interactive Leaflet Map Preview */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-odyssey-slate dark:text-odyssey-tan">
                            <span className="flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                                Leaflet Dynamic Map
                            </span>
                            <span className="font-mono text-[10px]">
                                {destinationCoords.lat.toFixed(3)}°, {destinationCoords.lng.toFixed(3)}°
                            </span>
                        </div>
                        <OdysseyLeafletMap
                            lat={destinationCoords.lat}
                            lng={destinationCoords.lng}
                            userGpsCoords={currentCoords}
                            locationName={destination || 'Destination'}
                            height="160px"
                        />
                    </div>

                    {/* Dates Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-odyssey-slate dark:text-odyssey-tan uppercase tracking-wider">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-odyssey-navy border border-odyssey-tan/40 dark:border-odyssey-brown/50 rounded-2xl text-xs text-odyssey-navy dark:text-odyssey-cream focus:outline-none focus:ring-2 focus:ring-[#F06536]/20 focus:border-odyssey-tan/40 dark:border-odyssey-brown/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-odyssey-slate dark:text-odyssey-tan uppercase tracking-wider">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-odyssey-navy border border-odyssey-tan/40 dark:border-odyssey-brown/50 rounded-2xl text-xs text-odyssey-navy dark:text-odyssey-cream focus:outline-none focus:ring-2 focus:ring-[#F06536]/20 focus:border-odyssey-tan/40 dark:border-odyssey-brown/50"
                            />
                        </div>
                    </div>

                    {/* Travelers Count */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-odyssey-slate dark:text-odyssey-tan uppercase tracking-wider">
                            Number of Travelers
                        </label>
                        <div className="flex items-center gap-3">
                            {[1, 2, 3, 4, 6].map((num) => (
                                <button
                                    type="button"
                                    key={num}
                                    onClick={() => setTravelers(num)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                                        travelers === num
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-odyssey-navy shadow-sm'
                                            : 'bg-slate-100 dark:bg-odyssey-navy text-odyssey-slate dark:text-odyssey-tan hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {num} {num === 1 ? 'Solo' : 'Pax'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Vibe Selection */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-odyssey-slate dark:text-odyssey-tan uppercase tracking-wider">
                            Travel Vibe
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {VIBE_OPTIONS.map((vibe) => (
                                <button
                                    type="button"
                                    key={vibe.id}
                                    onClick={() => toggleVibe(vibe.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                        selectedVibes.includes(vibe.id)
                                            ? 'bg-[#8C5E3C] text-white dark:bg-[#BFA06A] dark:text-[#1B1F3B] shadow-xs font-bold'
                                            : 'bg-slate-100 dark:bg-odyssey-navy text-odyssey-slate dark:text-odyssey-tan hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <span>{vibe.icon}</span>
                                    <span>{vibe.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !destination.trim()}
                            className="w-full bg-[#8C5E3C] hover:bg-[#784f31] text-white dark:bg-[#BFA06A] dark:text-[#1B1F3B] dark:hover:bg-[#aa8c56] disabled:opacity-50 font-extrabold text-sm py-3.5 px-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-white dark:text-[#1B1F3B]" />
                                    <span className="font-bold text-white dark:text-[#1B1F3B]">Creating & Mapping Trip...</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-bold text-white dark:text-[#1B1F3B]">Generate Odyssey Itinerary</span>
                                    <ArrowRight className="w-4 h-4 text-white dark:text-[#1B1F3B]" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

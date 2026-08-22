import React, { useState } from 'react';
import { X, Star, MapPin, ArrowRight, Check, Map as MapIcon, Image as ImageIcon } from 'lucide-react';
import { OdysseyLeafletMap } from '../map/OdysseyLeafletMap';
import { getDestinationDistance, getCoordinatesForLocation } from '../../services/locationService.js';

export function DestinationModal({
    destination,
    isOpen,
    onClose,
    onPlanTripWithDestination,
    currentLocation = 'Hyderabad, India',
    currentCoords = null
}) {
    const [viewMode, setViewMode] = useState('photo'); // 'photo' | 'map'

    if (!isOpen || !destination) return null;

    const resolvedCoords = (typeof destination.lat === 'number' && typeof destination.lng === 'number' && !isNaN(destination.lat) && !isNaN(destination.lng))
        ? { lat: destination.lat, lng: destination.lng }
        : (destination.coordinates?.lat && destination.coordinates?.lng)
            ? destination.coordinates
            : getCoordinatesForLocation(destination.name || destination.region || '');

    const lat = resolvedCoords.lat || 15.2993;
    const lng = resolvedCoords.lng || 74.1240;

    const distInfo = getDestinationDistance(
        currentLocation,
        currentCoords,
        destination.name,
        { lat, lng }
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#131B2E] rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-0 animate-in zoom-in-95 duration-200 overflow-hidden transition-colors">
                {/* Hero Media / Map Header */}
                <div className="relative h-56 sm:h-64 bg-slate-900 overflow-hidden">
                    {viewMode === 'map' ? (
                        <div className="w-full h-full">
                            <OdysseyLeafletMap
                                lat={lat}
                                lng={lng}
                                userGpsCoords={currentCoords}
                                zoom={12}
                                locationName={destination.name}
                                height="100%"
                            />
                        </div>
                    ) : (
                        <>
                            <img
                                src={destination.image}
                                alt={destination.name}
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        </>
                    )}

                    {/* View Switcher (Photo vs Map) - Fixed at Bottom Left of Media/Map */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/75 dark:bg-[#111827]/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-white/20 z-30">
                        <button
                            onClick={() => setViewMode('photo')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                                viewMode === 'photo'
                                    ? 'bg-[#F06536] text-white shadow-xs'
                                    : 'text-white/80 hover:text-white'
                            }`}
                        >
                            <ImageIcon className="w-3 h-3" />
                            <span>Photo</span>
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                                viewMode === 'map'
                                    ? 'bg-[#F06536] text-white shadow-xs'
                                    : 'text-white/80 hover:text-white'
                            }`}
                        >
                            <MapIcon className="w-3 h-3" />
                            <span>Leaflet Map</span>
                        </button>
                    </div>

                    {/* Close Button at Top Right */}
                    <button
                        onClick={onClose}
                        className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors z-30 shadow-md"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-4">
                    {/* Header info in body */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {destination.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-[#F06536]" />
                                <span>{destination.region}</span>
                                <span>•</span>
                                <span className="font-bold text-[#F06536]">{distInfo.text} away</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            {destination.vibe && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950/50 text-[#F06536]">
                                    {destination.vibe}
                                </span>
                            )}
                            {destination.rating && (
                                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span>{destination.rating}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Geodesic Distance Highlight Bar */}
                    <div className="p-3 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-[#F06536] text-white flex items-center justify-center font-bold">
                                ✈️
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">
                                    {distInfo.fullBadge}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Calculated from your current location ({currentLocation})
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            About Destination
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {destination.description}
                        </p>
                    </div>

                    {/* Highlights */}
                    {destination.highlights && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Odyssey Highlights
                            </h4>
                            <div className="space-y-1.5">
                                {destination.highlights.map((h, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-2.5 h-2.5" />
                                        </div>
                                        <span className="font-semibold">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-2">
                        <button
                            onClick={() => {
                                onPlanTripWithDestination({
                                    ...destination,
                                    name: destination.name,
                                    region: destination.region || destination.name,
                                    lat,
                                    lng,
                                    coordinates: { lat, lng }
                                });
                                onClose();
                            }}
                            className="w-full bg-[#F06536] hover:bg-[#E05325] active:scale-[0.99] text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-[#F06536]/25 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Plan Trip to {destination.name}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

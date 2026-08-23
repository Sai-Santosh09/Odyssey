import { X, MapPin, Star, Navigation, Clock, Plus, ExternalLink, Map as MapIcon } from 'lucide-react';
import { OdysseyLeafletMap } from '../map/OdysseyLeafletMap';

export function PlaceMapModal({
    place,
    isOpen,
    onClose,
    onAddToTrip,
    userGpsCoords = null
}) {
    if (!isOpen || !place) return null;

    const lat = place.lat || 17.3850;
    const lng = place.lng || 78.4867;

    const handleGetDirections = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleOpenInGoogleMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}+${lat},${lng}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const distanceDisplay = place.distanceText || (place.distanceKm !== undefined ? `${place.distanceKm} km away` : 'Near you');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-odyssey-slate rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200 transition-colors">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-odyssey-tan/30 dark:border-odyssey-brown/50 pb-3">
                    <div className="flex items-center gap-3">
                        {place.image ? (
                            <img
                                src={place.image}
                                alt={place.name}
                                className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-2xl bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy text-xl flex items-center justify-center flex-shrink-0">
                                {place.icon || '📍'}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-bold text-odyssey-navy dark:text-odyssey-cream tracking-tight">
                                    {place.name}
                                </h3>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-odyssey-navy text-odyssey-slate dark:text-odyssey-tan">
                                    {place.category}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-odyssey-slate dark:text-odyssey-tan mt-0.5">
                                <span className="flex items-center gap-1 font-semibold text-odyssey-brown dark:text-odyssey-tan">
                                    <MapPin className="w-3 h-3" />
                                    {distanceDisplay}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-amber-500 font-bold">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {place.rating} ({place.reviewsCount || 1200} reviews)
                                </span>
                            </div>
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

                {/* Leaflet Interactive Map View */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-odyssey-slate dark:text-odyssey-tan">
                        <span className="flex items-center gap-1">
                            <Navigation className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                            Live GPS Map Location
                        </span>
                        <span className="font-mono text-[10px]">
                            {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
                        </span>
                    </div>

                    <OdysseyLeafletMap
                        lat={lat}
                        lng={lng}
                        userGpsCoords={userGpsCoords}
                        zoom={14}
                        locationName={place.name}
                        height="220px"
                    />
                </div>

                {/* Description & Details */}
                <div className="bg-slate-50 dark:bg-odyssey-navy/60 p-3.5 rounded-2xl border border-odyssey-tan/30 dark:border-odyssey-brown/50 space-y-2">
                    <p className="text-xs sm:text-sm text-odyssey-slate dark:text-odyssey-tan leading-relaxed font-medium">
                        {place.description}
                    </p>
                    {place.timings && (
                        <div className="flex items-center gap-1.5 text-xs text-odyssey-slate dark:text-odyssey-tan pt-1 border-t border-odyssey-tan/40/60 dark:border-odyssey-brown/50">
                            <Clock className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                            <span>{place.timings}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="pt-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleOpenInGoogleMaps}
                            className="py-2.5 px-3 bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-navy dark:text-odyssey-cream text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                            <MapIcon className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                            <span>Google Maps 📍</span>
                        </button>
                        <button
                            onClick={handleGetDirections}
                            className="py-2.5 px-3 bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-navy dark:text-odyssey-cream text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                            <span>Get Directions</span>
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            onAddToTrip?.(place);
                            onClose();
                        }}
                        className="w-full py-3 px-4 bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy hover:opacity-90 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-[#F06536]/25 transition-all flex items-center justify-center gap-1.5"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add to My Odyssey Itinerary</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

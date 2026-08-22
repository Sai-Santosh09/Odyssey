import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, Star, Navigation, ArrowRight, Compass, Loader2, AlertCircle, Check, Map as MapIcon, List, ExternalLink, Sparkles, RefreshCw, Radio, Zap } from 'lucide-react';
import { getCurrentGPSLocation, getCoordinatesForLocation } from '../../services/locationService';
import { fetchLiveGooglePlaces } from '../../services/googlePlacesLiveService';
import { OdysseyLeafletMap } from '../map/OdysseyLeafletMap';

export function NearYou({
    currentLocation = 'Hyderabad, India',
    currentCoords = null,
    onSelectPlace,
    onLocationUpdate
}) {
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
    const [gpsState, setGpsState] = useState('idle'); // 'idle' | 'locating' | 'granted' | 'denied'
    const [userGpsCoords, setUserGpsCoords] = useState(null);

    // Radius State & Progressive Auto-Expansion
    const [searchRadiusKm, setSearchRadiusKm] = useState(6); // 6 km (Local) -> 15 km -> 35 km (Iconic)
    const [isRadarExpanded, setIsRadarExpanded] = useState(false);
    const [autoExpandEnabled, setAutoExpandEnabled] = useState(true);

    const [livePlaces, setLivePlaces] = useState([]);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);
    const [radarStatusMsg, setRadarStatusMsg] = useState('Scanning immediate neighborhood...');

    const autoExpandTimeoutRef = useRef(null);

    // Active reference coordinates (GPS coords take priority over city center)
    const activeCoords = useMemo(() => {
        if (userGpsCoords && typeof userGpsCoords.lat === 'number') return userGpsCoords;
        if (currentCoords?.lat && currentCoords?.lng) return currentCoords;
        return getCoordinatesForLocation(currentLocation);
    }, [userGpsCoords, currentCoords, currentLocation]);

    // Progressive Search Lifecycle
    useEffect(() => {
        let isMounted = true;
        if (autoExpandTimeoutRef.current) clearTimeout(autoExpandTimeoutRef.current);

        const executeProgressiveDiscovery = async () => {
            setIsLoadingPlaces(true);
            setIsRadarExpanded(false);
            setSearchRadiusKm(6);
            setRadarStatusMsg(`Scanning immediate neighborhood around ${currentLocation.split(',')[0]} (< 6 km)...`);

            // Step 1: Initial Local Query (< 6 km)
            try {
                const localResults = await fetchLiveGooglePlaces(
                    activeCoords.lat,
                    activeCoords.lng,
                    currentLocation,
                    6000,
                    false
                );

                if (isMounted) {
                    setLivePlaces(localResults);
                    setIsLoadingPlaces(false);
                }

                // Step 2: Auto-Expand to Iconic Metropolitan Landmarks (~35 km) after 1.4 seconds
                if (autoExpandEnabled) {
                    autoExpandTimeoutRef.current = setTimeout(async () => {
                        if (!isMounted) return;
                        setRadarStatusMsg(`Expanding radar to 35 km for iconic city landmarks & heritage...`);

                        const expandedResults = await fetchLiveGooglePlaces(
                            activeCoords.lat,
                            activeCoords.lng,
                            currentLocation,
                            35000,
                            true
                        );

                        if (isMounted) {
                            // Merge and deduplicate
                            const mergedMap = new Map();
                            [...localResults, ...expandedResults].forEach((p) => {
                                if (p.id && !mergedMap.has(p.id)) mergedMap.set(p.id, p);
                            });

                            const mergedList = Array.from(mergedMap.values()).sort((a, b) => a.distanceKm - b.distanceKm);
                            setLivePlaces(mergedList);
                            setSearchRadiusKm(35);
                            setIsRadarExpanded(true);
                            setRadarStatusMsg(`✨ Radar expanded to 35 km • Iconic landmarks included`);
                        }
                    }, 1400);
                }
            } catch (err) {
                console.warn('Progressive places discovery error', err);
                if (isMounted) setIsLoadingPlaces(false);
            }
        };

        executeProgressiveDiscovery();

        return () => {
            isMounted = false;
            if (autoExpandTimeoutRef.current) clearTimeout(autoExpandTimeoutRef.current);
        };
    }, [activeCoords.lat, activeCoords.lng, currentLocation, autoExpandEnabled]);

    const [selectedMapPlace, setSelectedMapPlace] = useState(null);

    useEffect(() => {
        if (livePlaces.length > 0 && !selectedMapPlace) {
            setSelectedMapPlace(livePlaces[0]);
        }
    }, [livePlaces, selectedMapPlace]);

    const handleManualRadiusSelect = async (km) => {
        if (autoExpandTimeoutRef.current) clearTimeout(autoExpandTimeoutRef.current);
        setSearchRadiusKm(km);
        setIsLoadingPlaces(true);
        const isExp = km >= 20;
        setIsRadarExpanded(isExp);
        setRadarStatusMsg(`Scanning within ${km} km radius...`);

        const results = await fetchLiveGooglePlaces(
            activeCoords.lat,
            activeCoords.lng,
            currentLocation,
            km * 1000,
            isExp
        );

        setLivePlaces(results);
        setIsLoadingPlaces(false);
        setRadarStatusMsg(isExp ? `✨ 35 km Radius Active • Iconic landmarks included` : `📍 ${km} km Local Neighborhood Active`);
    };

    const handleAcquireGPS = async () => {
        setGpsState('locating');
        const res = await getCurrentGPSLocation();

        if (res.status === 'granted') {
            setGpsState('granted');
            const newCoords = { lat: res.lat, lng: res.lng };
            setUserGpsCoords(newCoords);
            onLocationUpdate?.(res.city, newCoords);
        } else if (res.status === 'denied') {
            setGpsState('denied');
        } else {
            setGpsState('error');
        }
    };

    const handleRefresh = async () => {
        if (autoExpandTimeoutRef.current) clearTimeout(autoExpandTimeoutRef.current);
        setIsLoadingPlaces(true);
        const results = await fetchLiveGooglePlaces(
            activeCoords.lat,
            activeCoords.lng,
            currentLocation,
            searchRadiusKm * 1000,
            isRadarExpanded
        );
        setLivePlaces(results);
        setIsLoadingPlaces(false);
    };

    const filtered = livePlaces.filter(
        (p) => filter === 'all' || p.type === filter
    );

    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Near you
                        </h2>
                        {isRadarExpanded ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white shadow-xs animate-in fade-in duration-300">
                                <Sparkles className="w-2.5 h-2.5" />
                                35km Iconic Radar Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                <Radio className="w-2.5 h-2.5 text-[#F06536]" />
                                Local 6km Radar
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span>{radarStatusMsg}</span>
                    </p>
                </div>

                {/* Right Header Actions: Refresh, Map toggle & GPS Trigger */}
                <div className="flex items-center gap-2">
                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        disabled={isLoadingPlaces}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-all active:rotate-180"
                        title="Re-scan Live Radar"
                        aria-label="Re-scan Live Radar"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPlaces ? 'animate-spin text-[#F06536]' : ''}`} />
                    </button>

                    {/* View Switcher */}
                    <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-all ${
                                viewMode === 'list'
                                    ? 'bg-white dark:bg-[#131B2E] text-[#F06536] shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                            title="List View"
                        >
                            <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-1.5 rounded-lg transition-all ${
                                viewMode === 'map'
                                    ? 'bg-white dark:bg-[#131B2E] text-[#F06536] shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                            title="Leaflet Map View"
                        >
                            <MapIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* GPS Trigger / Badge */}
                    <button
                        onClick={handleAcquireGPS}
                        disabled={gpsState === 'locating'}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all active:scale-95 touch-manipulation ${
                            gpsState === 'granted'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : gpsState === 'denied'
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                        title="Click to locate using device GPS"
                    >
                        {gpsState === 'locating' ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin text-[#F06536]" />
                                <span>Locating...</span>
                            </>
                        ) : gpsState === 'granted' ? (
                            <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>GPS Active</span>
                            </>
                        ) : gpsState === 'denied' ? (
                            <>
                                <AlertCircle className="w-3 h-3 text-rose-500" />
                                <span>GPS Denied</span>
                            </>
                        ) : (
                            <>
                                <Navigation className="w-3 h-3 text-[#F06536]" />
                                <span>Use GPS</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Radar Radius Range Selector Bar */}
            <div className="p-2 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 pl-1">
                        <Compass className="w-3.5 h-3.5 text-[#F06536]" />
                        <span>Radius:</span>
                    </span>
                    {[
                        { km: 6, label: '6 km (Neighborhood)' },
                        { km: 15, label: '15 km (City Center)' },
                        { km: 35, label: '35 km (Iconic & Metro ⭐)' },
                    ].map((r) => (
                        <button
                            key={r.km}
                            onClick={() => handleManualRadiusSelect(r.km)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                                searchRadiusKm === r.km
                                    ? 'bg-[#F06536] text-white shadow-xs'
                                    : 'bg-white dark:bg-[#131B2E] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setAutoExpandEnabled(!autoExpandEnabled)}
                    className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        autoExpandEnabled
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800'
                            : 'text-slate-500 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800'
                    }`}
                    title="Automatically expand radius from local to iconic landmarks after search"
                >
                    <Zap className="w-3 h-3" />
                    <span>Auto-Expand {autoExpandEnabled ? 'ON' : 'OFF'}</span>
                </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar touch-pan-x select-none -mx-4 px-4 sm:mx-0 sm:px-0">
                {[
                    { id: 'all', label: 'All Live Spots' },
                    { id: 'landmark', label: 'Landmarks 🏛️' },
                    { id: 'restaurant', label: 'Dining 🍛' },
                    { id: 'cafe', label: 'Cafés ☕' },
                    { id: 'attraction', label: 'Attractions 🏰' },
                    { id: 'activity', label: 'Activities 🌲' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 touch-manipulation ${
                            filter === tab.id
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                                : 'bg-white dark:bg-[#131B2E] hover:bg-slate-100 dark:hover:bg-[#182238] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Loading Radar Skeleton State */}
            {isLoadingPlaces ? (
                <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#F06536] flex items-center justify-center animate-bounce">
                        <Compass className="w-6 h-6 animate-spin" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                            Searching Google Places & Live Radar...
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {radarStatusMsg}
                        </p>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 text-center border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No places found in this category.</p>
                    <button
                        onClick={() => handleManualRadiusSelect(35)}
                        className="text-xs text-[#F06536] font-bold mt-1.5 hover:underline"
                    >
                        Expand Search to 35 km for Iconic Landmarks
                    </button>
                </div>
            ) : viewMode === 'map' ? (
                <div className="space-y-3">
                    <OdysseyLeafletMap
                        lat={selectedMapPlace?.lat || activeCoords.lat}
                        lng={selectedMapPlace?.lng || activeCoords.lng}
                        userGpsCoords={userGpsCoords}
                        zoom={searchRadiusKm >= 20 ? 11 : 13}
                        locationName={selectedMapPlace?.name || currentLocation}
                        markers={filtered}
                        selectedMarkerId={selectedMapPlace?.id}
                        onSelectMarker={(m) => {
                            setSelectedMapPlace(m);
                        }}
                        height="270px"
                    />

                    {/* Horizontal Places Carousel below Map */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                        {filtered.map((place) => {
                            const isSelected = selectedMapPlace?.id === place.id;
                            return (
                                <button
                                    key={place.id}
                                    onClick={() => {
                                        setSelectedMapPlace(place);
                                    }}
                                    onDoubleClick={() => onSelectPlace?.(place)}
                                    className={`p-2.5 rounded-2xl border text-left text-xs whitespace-nowrap flex items-center gap-2.5 transition-all flex-shrink-0 ${
                                        isSelected
                                            ? 'bg-orange-50 dark:bg-orange-950/40 border-[#F06536] text-[#F06536] font-bold shadow-xs'
                                            : 'bg-white dark:bg-[#131B2E] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <span>{place.icon}</span>
                                    <div className="text-left">
                                        <div className="flex items-center gap-1">
                                            <p className="font-bold truncate max-w-[130px]">{place.name.split('&')[0]}</p>
                                            {place.isIconic && (
                                                <span className="text-[9px] text-amber-500 font-extrabold">⭐</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] opacity-75 font-medium">{place.distanceText}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Places List with tier badges, authentic Google photos, and live Haversine distance */
                <div className="space-y-2.5">
                    {filtered.map((place) => {
                        const googleMapsUrl = place.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}+${place.lat},${place.lng}`;

                        return (
                            <div
                                key={place.id}
                                onClick={() => onSelectPlace?.(place)}
                                className="group bg-white dark:bg-[#131B2E] rounded-2xl p-3 sm:p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#F06536]/40 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    {/* Real Google Place Image Thumbnail */}
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
                                        <img
                                            src={place.image}
                                            alt={place.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/20" />
                                        <span className="absolute bottom-1 right-1 text-xs">
                                            {place.icon}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-0.5 min-w-0 flex-1">
                                        <div className="flex items-center flex-wrap gap-1.5">
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#F06536] transition-colors truncate">
                                                {place.name}
                                            </h4>
                                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex-shrink-0">
                                                {place.category}
                                            </span>
                                            {place.isIconic && (
                                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 flex-shrink-0 flex items-center gap-0.5">
                                                    ⭐ Iconic Spot
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                            {place.description}
                                        </p>

                                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                                            <span className="flex items-center gap-1 font-semibold text-[#F06536]">
                                                <MapPin className="w-3 h-3" />
                                                {place.distanceText}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                {place.rating}
                                            </span>
                                            <span className="hidden xs:inline">•</span>
                                            <span className="text-slate-400 dark:text-slate-500 hidden xs:inline">{place.timings}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons: Google Maps link + View Modal */}
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <a
                                        href={googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-400 hover:text-[#F06536] transition-colors hidden xs:flex items-center"
                                        title="Open in Google Maps"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectPlace?.(place);
                                        }}
                                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-[#F06536] text-slate-600 dark:text-slate-300 group-hover:text-white transition-all flex items-center gap-1 text-xs font-semibold shadow-xs"
                                    >
                                        <span className="hidden sm:inline text-xs">View</span>
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

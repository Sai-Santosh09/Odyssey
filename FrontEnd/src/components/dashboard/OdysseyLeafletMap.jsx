import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Navigation, ExternalLink } from 'lucide-react';

/**
 * MapController
 * Synchronizes map center and handles container resizing without fighting or resetting user zoom.
 */
function MapController({ center, initialZoom = 12 }) {
    const map = useMap();
    const prevCenterRef = useRef(null);

    useEffect(() => {
        const lat = center?.[0];
        const lng = center?.[1];
        if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return;

        const isSame = prevCenterRef.current &&
            Math.abs(prevCenterRef.current[0] - lat) < 0.0001 &&
            Math.abs(prevCenterRef.current[1] - lng) < 0.0001;

        if (!isSame) {
            prevCenterRef.current = [lat, lng];
            map.setView([lat, lng], initialZoom, { animate: true });

            const t1 = setTimeout(() => map.invalidateSize(), 80);
            const t2 = setTimeout(() => map.invalidateSize(), 300);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }
    }, [center?.[0], center?.[1], initialZoom, map]);

    return null;
}

/**
 * MapZoomScaleController
 * Listens to zoom events directly from Leaflet and updates CSS variable --pin-zoom-scale.
 * Allows pins to smoothly expand when zooming out with 60 FPS performance and ZERO React re-render conflicts.
 */
function MapZoomScaleController() {
    const map = useMap();

    useEffect(() => {
        const updateZoomScale = () => {
            const z = map.getZoom();
            // Subtle, controlled scaling: max 1.15x when fully zoomed out, 1.0x at standard view
            const scale = Math.min(1.15, Math.max(0.85, 1 + (12 - z) * 0.022));
            const container = map.getContainer();
            if (container) {
                container.style.setProperty('--pin-zoom-scale', scale.toFixed(3));
            }
        };

        updateZoomScale();
        map.on('zoom', updateZoomScale);
        map.on('zoomend', updateZoomScale);

        return () => {
            map.off('zoom', updateZoomScale);
            map.off('zoomend', updateZoomScale);
        };
    }, [map]);

    return null;
}

// Map Click Listener for dynamic interaction
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click: (e) => {
            if (onMapClick) {
                onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
            }
        },
    });
    return null;
}

// User's Live GPS Blue Pulsing Beacon (Compact 20x20)
const createGpsUserBeacon = () => {
    return L.divIcon({
        className: 'odyssey-gps-beacon-icon',
        html: `
            <div style="
                width: 20px;
                height: 20px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                padding: 0;
                transform: scale(var(--pin-zoom-scale, 1));
                transform-origin: 10px 10px;
            ">
                <div style="
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(14, 165, 233, 0.45);
                    animation: leafletBeaconPulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                "></div>
                <div style="
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #0284C7;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0 2px 6px rgba(2, 132, 199, 0.8);
                "></div>
            </div>
            <style>
                .odyssey-gps-beacon-icon {
                    background: transparent !important;
                    border: none !important;
                }
                @keyframes leafletBeaconPulse {
                    0% { transform: scale(0.6); opacity: 0.9; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
            </style>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -12]
    });
};

/**
 * Compact, High-Precision SVG Odyssey Pin (24x32)
 * Needle tip is mathematically at exact coordinate (12, 31)
 * Transform-origin is fixed at 12px 31px.
 */
const createLockedOdysseyPin = (color = '#F06536') => {
    return L.divIcon({
        className: 'odyssey-locked-pin-icon',
        html: `
            <div style="
                width: 24px;
                height: 32px;
                position: relative;
                margin: 0;
                padding: 0;
                transform: scale(var(--pin-zoom-scale, 1));
                transform-origin: 12px 31px;
                pointer-events: auto;
                cursor: pointer;
            ">
                <!-- Ground Target Pulse Ripple anchored at the exact needle tip (12, 31) -->
                <div style="
                    position: absolute;
                    left: 12px;
                    top: 31px;
                    transform: translate(-50%, -50%);
                    width: 16px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(240, 101, 54, 0.45);
                    animation: pinGroundRipple 2s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
                    pointer-events: none;
                "></div>

                <!-- Sleek SVG Pin with Needle Tip pointing exactly at (12, 31) -->
                <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(240,101,54,0.55)); display: block;">
                    <defs>
                        <linearGradient id="pinGrad-${color.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#FF7A45" />
                            <stop offset="100%" stop-color="${color}" />
                        </linearGradient>
                    </defs>
                    <path d="M12 1C5.925 1 1 5.925 1 12C1 20.5 12 31 12 31C12 31 23 20.5 23 12C23 5.925 18.075 1 12 1Z" fill="url(#pinGrad-${color.replace('#','')})" stroke="#FFFFFF" stroke-width="1.8" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="4.5" fill="#FFFFFF"/>
                    <circle cx="12" cy="12" r="2.2" fill="${color}"/>
                </svg>
            </div>
            <style>
                .odyssey-locked-pin-icon {
                    background: transparent !important;
                    border: none !important;
                }
                @keyframes pinGroundRipple {
                    0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0.9; }
                    100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
                }
            </style>
        `,
        iconSize: [24, 32],
        iconAnchor: [12, 31],
        popupAnchor: [0, -31]
    });
};

export function OdysseyLeafletMap({
    lat = 17.3850,
    lng = 78.4867,
    userGpsCoords = null,
    zoom = 12,
    locationName = 'Destination',
    markers = [],
    selectedMarkerId = null,
    onSelectMarker,
    onLocationChange,
    height = '160px',
    className = ''
}) {
    const { isDarkMode } = useTheme();
    const markerRef = useRef(null);

    const safeLat = typeof lat === 'number' && !isNaN(lat) ? lat : 17.3850;
    const safeLng = typeof lng === 'number' && !isNaN(lng) ? lng : 78.4867;
    const position = [safeLat, safeLng];

    // CartoDB Dark Matter for Dark Mode, CartoDB Voyager for Light Mode
    const tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    const renderMarkers = markers.length > 0 ? markers : [
        { id: 'main', lat: safeLat, lng: safeLng, name: locationName }
    ];

    const dynamicMainPin = createLockedOdysseyPin('#F06536');
    const userBeaconIcon = createGpsUserBeacon();

    const handleGetDirections = (targetLat, targetLng) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className={`w-full rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-700 shadow-inner ${className}`}
            style={{ height }}
        >
            <MapContainer
                key={`map-${safeLat.toFixed(4)}-${safeLng.toFixed(4)}-${isDarkMode ? 'dark' : 'light'}`}
                center={position}
                zoom={zoom}
                scrollWheelZoom={true}
                touchZoom={true}
                doubleClickZoom={true}
                dragging={true}
                zoomControl={true}
                attributionControl={false}
                style={{ width: '100%', height: '100%', zIndex: 10, background: isDarkMode ? '#111827' : '#e2e8f0' }}
            >
                <TileLayer
                    key={isDarkMode ? 'dark-tiles' : 'light-tiles'}
                    url={tileUrl}
                    attribution={attribution}
                    maxZoom={19}
                />

                {/* Live GPS Beacon Marker */}
                {userGpsCoords && userGpsCoords.lat && userGpsCoords.lng && (
                    <Marker
                        position={[userGpsCoords.lat, userGpsCoords.lng]}
                        icon={userBeaconIcon}
                    >
                        <Popup className="odyssey-leaflet-popup">
                            <div className="text-xs font-bold text-sky-700 p-1 space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                    </span>
                                    <span>You are here (Live GPS)</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-normal">
                                    {userGpsCoords.lat.toFixed(4)}°, {userGpsCoords.lng.toFixed(4)}°
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Dynamic Interactive Destination Pins */}
                {renderMarkers.map((m) => {
                    const mIcon = dynamicMainPin;
                    const mPos = [m.lat, m.lng];

                    return (
                        <Marker
                            key={m.id || `marker-${m.lat}-${m.lng}`}
                            ref={markerRef}
                            position={mPos}
                            icon={mIcon}
                            draggable={Boolean(onLocationChange)}
                            eventHandlers={{
                                click: () => onSelectMarker?.(m),
                                dragend: (e) => {
                                    const newLatLng = e.target.getLatLng();
                                    onLocationChange?.({ lat: newLatLng.lat, lng: newLatLng.lng });
                                }
                            }}
                        >
                            <Popup className="odyssey-leaflet-popup" autoPan={true}>
                                <div className="text-xs font-bold text-slate-900 p-1 space-y-2 min-w-[140px]">
                                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-[13px]">
                                        <span className="text-[#F06536]">📍</span>
                                        <span>{m.name || locationName}</span>
                                    </div>

                                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                                        <span>{m.lat.toFixed(4)}° N, {m.lng.toFixed(4)}° E</span>
                                    </div>

                                    {m.distanceText && (
                                        <p className="text-[10px] text-[#F06536] font-bold bg-orange-50 px-2 py-0.5 rounded-md inline-block">
                                            🚀 {m.distanceText}
                                        </p>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleGetDirections(m.lat, m.lng);
                                        }}
                                        className="w-full mt-1 py-1.5 px-2 bg-[#F06536] hover:bg-[#E05325] text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-xs transition-colors"
                                    >
                                        <Navigation className="w-3 h-3" />
                                        <span>Get Directions</span>
                                        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Map Click Event for dynamic location setting */}
                {onLocationChange && <MapClickHandler onMapClick={onLocationChange} />}

                {/* Pure CSS Dynamic Zoom Scale Controller (No React re-render conflicts) */}
                <MapZoomScaleController />

                {/* Active Center Controller */}
                <MapController center={position} initialZoom={zoom} />
            </MapContainer>
        </div>
    );
}
export default OdysseyLeafletMap;

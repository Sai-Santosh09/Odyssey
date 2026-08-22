import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTheme } from '../../context/ThemeContext';

// Helper component to smoothly animate map center change and resize map tiles properly
function MapCenterUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center && typeof center[0] === 'number' && typeof center[1] === 'number' && !isNaN(center[0]) && !isNaN(center[1])) {
            map.setView(center, zoom || 13);
        }

        const timer = setTimeout(() => {
            map.invalidateSize();
            if (center && typeof center[0] === 'number' && typeof center[1] === 'number' && !isNaN(center[0]) && !isNaN(center[1])) {
                map.setView(center, zoom || 13);
            }
        }, 120);

        return () => clearTimeout(timer);
    }, [center, zoom, map]);

    return null;
}

// User's Live GPS Blue Beacon
const createGpsUserBeacon = () => {
    return L.divIcon({
        className: 'custom-user-gps-beacon',
        html: `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 26px;
                height: 26px;
                position: relative;
            ">
                <div style="
                    position: absolute;
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    background: rgba(14, 165, 233, 0.4);
                    animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                "></div>
                <div style="
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #0284C7;
                    border: 2.5px solid #FFFFFF;
                    box-shadow: 0 2px 10px rgba(2, 132, 199, 0.7);
                "></div>
            </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    });
};

// Custom modern Odyssey SVG Pin Icon for places
const createOdysseyPin = (color = '#F06536', isSelected = false) => {
    const size = isSelected ? 38 : 30;
    const shadowSize = isSelected ? 12 : 8;
    return L.divIcon({
        className: 'custom-odyssey-pin',
        html: `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                transform: translate(-50%, -100%);
                cursor: pointer;
            ">
                <div style="
                    background: ${isSelected ? '#FF8A00' : color};
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px ${shadowSize * 2}px rgba(240, 101, 54, ${isSelected ? '0.85' : '0.45'});
                    border: ${isSelected ? '3px solid #FFFFFF' : '2px solid #FFFFFF'};
                    transition: transform 0.2s ease;
                ">
                    <div style="
                        width: ${isSelected ? '12px' : '9px'};
                        height: ${isSelected ? '12px' : '9px'};
                        background: #FFFFFF;
                        border-radius: 50%;
                        transform: rotate(45deg);
                    "></div>
                </div>
                <div style="
                    width: ${isSelected ? '10px' : '7px'};
                    height: 4px;
                    background: rgba(0,0,0,0.35);
                    border-radius: 50%;
                    margin-top: 2px;
                    filter: blur(1px);
                "></div>
            </div>
        `,
        iconSize: [size, size + 10],
        iconAnchor: [size / 2, size + 10],
        popupAnchor: [0, -(size + 8)]
    });
};

export function OdysseyLeafletMap({
    lat = 17.3850,
    lng = 78.4867,
    userGpsCoords = null,
    zoom = 13,
    locationName = 'Destination',
    markers = [],
    selectedMarkerId = null,
    onSelectMarker,
    height = '160px',
    className = ''
}) {
    const { isDarkMode } = useTheme();
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

    const userBeaconIcon = createGpsUserBeacon();

    return (
        <div
            className={`w-full rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-700 shadow-inner ${className}`}
            style={{ height }}
        >
            <MapContainer
                key={`map-${safeLat.toFixed(3)}-${safeLng.toFixed(3)}-${isDarkMode ? 'dark' : 'light'}`}
                center={position}
                zoom={zoom}
                scrollWheelZoom={false}
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

                {/* User GPS location beacon if active */}
                {userGpsCoords && userGpsCoords.lat && userGpsCoords.lng && (
                    <Marker
                        position={[userGpsCoords.lat, userGpsCoords.lng]}
                        icon={userBeaconIcon}
                    >
                        <Popup className="odyssey-leaflet-popup">
                            <div className="text-xs font-bold text-sky-700 p-1">
                                📍 You are here (Live GPS)
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Nearby places markers */}
                {renderMarkers.map((m) => {
                    const isSelected = selectedMarkerId ? selectedMarkerId === m.id : false;
                    const mIcon = createOdysseyPin('#F06536', isSelected);
                    const mPos = [m.lat, m.lng];

                    return (
                        <Marker
                            key={m.id}
                            position={mPos}
                            icon={mIcon}
                            eventHandlers={{
                                click: () => onSelectMarker?.(m)
                            }}
                        >
                            <Popup className="odyssey-leaflet-popup">
                                <div className="text-xs font-bold text-slate-900 p-1 space-y-0.5">
                                    <div className="flex items-center gap-1">
                                        <span>{m.icon || '📍'}</span>
                                        <span>{m.name}</span>
                                    </div>
                                    {m.distanceText && (
                                        <p className="text-[10px] text-[#F06536] font-semibold">
                                            {m.distanceText}
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                <MapCenterUpdater center={position} zoom={zoom} />
            </MapContainer>
        </div>
    );
}

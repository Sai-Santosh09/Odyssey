/**
 * Device GPS & Geolocation Service
 * Handles browser GPS location, Google Maps SDK Geocoding, precise Haversine distance calculations,
 * and high-accuracy landmark registry.
 */
import { getPlacePhoto } from './imageService.js';
import { computeGoogleDistanceKm, googleReverseGeocode, googleGeocodeAddress } from './mapsService.js';

// Coordinates registry for major Indian & Global cities with extensive alias coverage
export const CITY_COORDINATES = {
    // India Domestic
    'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, India', state: 'Telangana', country: 'India' },
    'secunderabad': { lat: 17.4399, lng: 78.4983, name: 'Secunderabad, Telangana, India', state: 'Telangana', country: 'India' },
    'bengaluru': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, India', state: 'Karnataka', country: 'India' },
    'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, India', state: 'Karnataka', country: 'India' },
    'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India', state: 'Maharashtra', country: 'India' },
    'bombay': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India', state: 'Maharashtra', country: 'India' },
    'delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India', state: 'Delhi', country: 'India' },
    'new delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India', state: 'Delhi', country: 'India' },
    'noida': { lat: 28.5355, lng: 77.3910, name: 'Noida, Uttar Pradesh, India', state: 'Uttar Pradesh', country: 'India' },
    'gurugram': { lat: 28.4595, lng: 77.0266, name: 'Gurugram, Haryana, India', state: 'Haryana', country: 'India' },
    'goa': { lat: 15.2993, lng: 74.1240, name: 'Goa, India', state: 'Goa', country: 'India' },
    'panaji': { lat: 15.4909, lng: 73.8278, name: 'Panaji, Goa, India', state: 'Goa', country: 'India' },
    'jaipur': { lat: 26.9124, lng: 75.7873, name: 'Jaipur, India', state: 'Rajasthan', country: 'India' },
    'manali': { lat: 32.2432, lng: 77.1892, name: 'Manali, India', state: 'Himachal Pradesh', country: 'India' },
    'varanasi': { lat: 25.3176, lng: 82.9739, name: 'Varanasi, India', state: 'Uttar Pradesh', country: 'India' },
    'banaras': { lat: 25.3176, lng: 82.9739, name: 'Varanasi, India', state: 'Uttar Pradesh', country: 'India' },
    'ladakh': { lat: 34.1526, lng: 77.5771, name: 'Leh, Ladakh, India', state: 'Ladakh', country: 'India' },
    'leh': { lat: 34.1526, lng: 77.5771, name: 'Leh, Ladakh, India', state: 'Ladakh', country: 'India' },
    'pangong': { lat: 33.7595, lng: 78.6674, name: 'Pangong Tso, Ladakh', state: 'Ladakh', country: 'India' },
    'kerala': { lat: 9.9312, lng: 76.2673, name: 'Kochi, Kerala, India', state: 'Kerala', country: 'India' },
    'kochi': { lat: 9.9312, lng: 76.2673, name: 'Kochi, Kerala, India', state: 'Kerala', country: 'India' },
    'cochin': { lat: 9.9312, lng: 76.2673, name: 'Kochi, Kerala, India', state: 'Kerala', country: 'India' },
    'munnar': { lat: 10.0889, lng: 77.0595, name: 'Munnar, Kerala, India', state: 'Kerala', country: 'India' },
    'alleppey': { lat: 9.4981, lng: 76.3388, name: 'Alleppey, Kerala, India', state: 'Kerala', country: 'India' },
    'udaipur': { lat: 24.5854, lng: 73.7125, name: 'Udaipur, India', state: 'Rajasthan', country: 'India' },
    'rishikesh': { lat: 30.0869, lng: 78.2676, name: 'Rishikesh, India', state: 'Uttarakhand', country: 'India' },
    'ooty': { lat: 11.4102, lng: 76.6950, name: 'Ooty, India', state: 'Tamil Nadu', country: 'India' },
    'agra': { lat: 27.1767, lng: 78.0081, name: 'Agra, India', state: 'Uttar Pradesh', country: 'India' },
    'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai, India', state: 'Tamil Nadu', country: 'India' },
    'madras': { lat: 13.0827, lng: 80.2707, name: 'Chennai, India', state: 'Tamil Nadu', country: 'India' },
    'kolkata': { lat: 22.5726, lng: 88.3639, name: 'Kolkata, India', state: 'West Bengal', country: 'India' },
    'calcutta': { lat: 22.5726, lng: 88.3639, name: 'Kolkata, India', state: 'West Bengal', country: 'India' },
    'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune, India', state: 'Maharashtra', country: 'India' },
    'kashmir': { lat: 34.0837, lng: 74.7973, name: 'Srinagar, Kashmir, India', state: 'Jammu & Kashmir', country: 'India' },
    'srinagar': { lat: 34.0837, lng: 74.7973, name: 'Srinagar, Kashmir, India', state: 'Jammu & Kashmir', country: 'India' },
    'gulmarg': { lat: 34.0484, lng: 74.3805, name: 'Gulmarg, Kashmir, India', state: 'Jammu & Kashmir', country: 'India' },
    'coorg': { lat: 12.3375, lng: 75.8069, name: 'Coorg (Madikeri), Karnataka, India', state: 'Karnataka', country: 'India' },
    'hampi': { lat: 15.3350, lng: 76.4600, name: 'Hampi, Karnataka, India', state: 'Karnataka', country: 'India' },
    'pondicherry': { lat: 11.9416, lng: 79.8083, name: 'Puducherry, India', state: 'Puducherry', country: 'India' },
    'puducherry': { lat: 11.9416, lng: 79.8083, name: 'Puducherry, India', state: 'Puducherry', country: 'India' },
    'darjeeling': { lat: 27.0410, lng: 88.2663, name: 'Darjeeling, West Bengal, India', state: 'West Bengal', country: 'India' },
    'amritsar': { lat: 31.6340, lng: 74.8723, name: 'Amritsar, Punjab, India', state: 'Punjab', country: 'India' },
    'shillong': { lat: 25.5788, lng: 91.8933, name: 'Shillong, Meghalaya, India', state: 'Meghalaya', country: 'India' },
    'andaman': { lat: 11.6234, lng: 92.7265, name: 'Port Blair, Andaman & Nicobar', state: 'Andaman & Nicobar', country: 'India' },

    // International Destinations
    'paris': { lat: 48.8566, lng: 2.3522, name: 'Paris, France', state: 'Île-de-France', country: 'France' },
    'london': { lat: 51.5074, lng: -0.1278, name: 'London, United Kingdom', state: 'England', country: 'UK' },
    'tokyo': { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan', state: 'Kanto', country: 'Japan' },
    'bali': { lat: -8.3405, lng: 115.0920, name: 'Bali, Indonesia', state: 'Bali', country: 'Indonesia' },
    'rome': { lat: 41.9028, lng: 12.4964, name: 'Rome, Italy', state: 'Lazio', country: 'Italy' },
    'dubai': { lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE', state: 'Dubai', country: 'UAE' },
    'santorini': { lat: 36.3932, lng: 25.4615, name: 'Santorini, Greece', state: 'Cyclades', country: 'Greece' },
    'swiss alps': { lat: 46.6863, lng: 7.8632, name: 'Interlaken, Switzerland', state: 'Bern', country: 'Switzerland' },
    'interlaken': { lat: 46.6863, lng: 7.8632, name: 'Interlaken, Switzerland', state: 'Bern', country: 'Switzerland' },
    'switzerland': { lat: 46.8182, lng: 8.2275, name: 'Switzerland', state: 'Europe', country: 'Switzerland' },
    'tromso': { lat: 69.6492, lng: 18.9553, name: 'Tromsø, Norway', state: 'Troms', country: 'Norway' },
    'norway': { lat: 60.4720, lng: 8.4689, name: 'Norway', state: 'Scandinavia', country: 'Norway' },
    'kyoto': { lat: 35.0116, lng: 135.7681, name: 'Kyoto, Japan', state: 'Kansai', country: 'Japan' },
    'amalfi': { lat: 40.6340, lng: 14.6027, name: 'Amalfi Coast, Italy', state: 'Campania', country: 'Italy' },
    'new york': { lat: 40.7128, lng: -74.0060, name: 'New York, USA', state: 'New York', country: 'USA' },
    'cairo': { lat: 30.0444, lng: 31.2357, name: 'Cairo, Egypt', state: 'Cairo', country: 'Egypt' },
    'barcelona': { lat: 41.3879, lng: 2.1699, name: 'Barcelona, Spain', state: 'Catalonia', country: 'Spain' },
    'sydney': { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia', state: 'NSW', country: 'Australia' },
    'singapore': { lat: 1.3521, lng: 103.8198, name: 'Singapore', state: 'Singapore', country: 'Singapore' },
    'reykjavik': { lat: 64.1466, lng: -21.9426, name: 'Reykjavik, Iceland', state: 'Capital Region', country: 'Iceland' },
    'phuket': { lat: 7.8804, lng: 98.3923, name: 'Phuket, Thailand', state: 'Phuket', country: 'Thailand' },
    'berlin': { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany', state: 'Berlin', country: 'Germany' },
    'maldives': { lat: 3.2028, lng: 73.2207, name: 'Maldives', state: 'Indian Ocean', country: 'Maldives' },
    'bangkok': { lat: 13.7563, lng: 100.5018, name: 'Bangkok, Thailand', state: 'Bangkok', country: 'Thailand' },
    'seoul': { lat: 37.5665, lng: 126.9780, name: 'Seoul, South Korea', state: 'Seoul', country: 'South Korea' },
    'amsterdam': { lat: 52.3676, lng: 4.9041, name: 'Amsterdam, Netherlands', state: 'North Holland', country: 'Netherlands' },
    'prague': { lat: 50.0755, lng: 14.4378, name: 'Prague, Czechia', state: 'Bohemia', country: 'Czechia' },
    'cape town': { lat: -33.9249, lng: 18.4241, name: 'Cape Town, South Africa', state: 'Western Cape', country: 'South Africa' },
    'queenstown': { lat: -45.0312, lng: 168.6626, name: 'Queenstown, New Zealand', state: 'Otago', country: 'New Zealand' },
    'bora bora': { lat: -16.5004, lng: -151.7415, name: 'Bora Bora, French Polynesia', state: 'Leeward Islands', country: 'French Polynesia' },
    'venice': { lat: 45.4408, lng: 12.3155, name: 'Venice, Italy', state: 'Veneto', country: 'Italy' },
    'florence': { lat: 43.7696, lng: 11.2558, name: 'Florence, Italy', state: 'Tuscany', country: 'Italy' },
    'istanbul': { lat: 41.0082, lng: 28.9784, name: 'Istanbul, Turkey', state: 'Marmara', country: 'Turkey' },
    'zurich': { lat: 47.3769, lng: 8.5417, name: 'Zurich, Switzerland', state: 'Zurich', country: 'Switzerland' },
    'athens': { lat: 37.9838, lng: 23.7275, name: 'Athens, Greece', state: 'Attica', country: 'Greece' }
};

/**
 * Resolves accurate coordinates for any city name query
 */
export function getCoordinatesForLocation(locationName = '') {
    if (!locationName) return { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, India' };

    const clean = locationName.toLowerCase().trim();

    for (const key in CITY_COORDINATES) {
        if (clean === key || clean.includes(key) || key.includes(clean)) {
            return CITY_COORDINATES[key];
        }
    }

    return { lat: 17.3850, lng: 78.4867, name: locationName };
}

/**
 * Calculates accurate geodesic distance in kilometers
 * Uses Google Maps Geometry Spherical calculations when available, with exact Haversine fallback.
 */
export function calculateExactDistanceKm(lat1, lon1, lat2, lon2) {
    if (
        lat1 === undefined || lon1 === undefined ||
        lat2 === undefined || lon2 === undefined ||
        isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)
    ) {
        return { km: 0, text: 'Distance calculating...' };
    }

    // 1. Try Google Maps Geometry Spherical distance if SDK is present
    const googleDist = computeGoogleDistanceKm(lat1, lon1, lat2, lon2);
    let distance = googleDist;

    // 2. Haversine formula calculation
    if (typeof distance !== 'number' || isNaN(distance)) {
        const R = 6371; // Earth mean radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance = R * c;
    }

    let text;
    if (distance < 1) {
        text = `${Math.max(50, Math.round(distance * 1000))} m away`;
    } else if (distance < 10) {
        text = `${distance.toFixed(1)} km away`;
    } else if (distance < 1000) {
        text = `${Math.round(distance)} km away`;
    } else {
        text = `${Math.round(distance).toLocaleString()} km away`;
    }

    return { km: Math.round(distance), text };
}

/**
 * Dedicated helper to calculate distance from current location to destination
 */
export function getDestinationDistance(userLocation, userCoords, destLocation, destCoords) {
    let uLat = (typeof userCoords?.lat === 'number' && !isNaN(userCoords.lat)) ? userCoords.lat : undefined;
    let uLng = (typeof userCoords?.lng === 'number' && !isNaN(userCoords.lng)) ? userCoords.lng : undefined;

    if (uLat === undefined || uLng === undefined) {
        const u = getCoordinatesForLocation(userLocation);
        uLat = u.lat;
        uLng = u.lng;
    }

    let dLat = (typeof destCoords?.lat === 'number' && !isNaN(destCoords.lat)) ? destCoords.lat : undefined;
    let dLng = (typeof destCoords?.lng === 'number' && !isNaN(destCoords.lng)) ? destCoords.lng : undefined;

    if (dLat === undefined || dLng === undefined) {
        const d = getCoordinatesForLocation(destLocation);
        dLat = d.lat;
        dLng = d.lng;
    }

    const { km, text } = calculateExactDistanceKm(uLat, uLng, dLat, dLng);

    // Approximate flight or travel time
    let travelEstimate = '';
    if (km > 0 && km < 400) {
        travelEstimate = `~${Math.max(1, Math.round(km / 60))}h drive`;
    } else if (km >= 400 && km < 1500) {
        travelEstimate = `~${(km / 650 + 0.5).toFixed(1)}h flight`;
    } else if (km >= 1500) {
        travelEstimate = `~${(km / 800 + 1).toFixed(0)}h flight`;
    }

    return {
        km,
        text,
        travelEstimate,
        fullBadge: travelEstimate ? `${text} • ${travelEstimate}` : text
    };
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const { text } = calculateExactDistanceKm(lat1, lon1, lat2, lon2);
    return text;
}

/**
 * Finds the nearest known major city for given coordinates
 */
export function findNearestCityKey(lat, lng, maxDistanceKm = 120) {
    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        return 'hyderabad';
    }

    let closestKey = null;
    let minDistance = Infinity;

    for (const key in CITY_COORDINATES) {
        const city = CITY_COORDINATES[key];
        const { km } = calculateExactDistanceKm(lat, lng, city.lat, city.lng);
        if (km < minDistance) {
            minDistance = km;
            closestKey = key;
        }
    }

    if (minDistance <= maxDistanceKm) {
        return closestKey;
    }

    return null;
}

/**
 * Reverse Geocodes coordinates to a human-readable city and neighborhood name
 * Powered by Google Maps SDK Geocoder with Nominatim fallback
 */
export async function reverseGeocodeCoords(lat, lng) {
    // 1. Primary: Google Maps JavaScript SDK Geocoder
    try {
        const googleGeo = await googleReverseGeocode(lat, lng);
        if (googleGeo && googleGeo.city) {
            return googleGeo;
        }
    } catch (e) {
        console.warn('Google reverse geocode error, attempting OpenStreetMap fallback', e);
    }

    // 2. Secondary fallback: OpenStreetMap Nominatim
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
            {
                headers: {
                    'Accept-Language': 'en'
                }
            }
        );
        if (res.ok) {
            const data = await res.json();
            const address = data.address || {};
            const neighborhood = address.suburb || address.neighbourhood || address.residential || address.commercial || '';
            const city = address.city || address.town || address.village || address.state_district || address.county || address.state || 'Your City';
            const country = address.country ? `, ${address.country}` : '';

            const formatted = neighborhood ? `${neighborhood}, ${city}` : `${city}${country}`;
            return {
                city: formatted,
                rawCity: city,
                displayName: data.display_name,
                lat,
                lng
            };
        }
    } catch (e) {
        console.warn('Reverse geocoding fallback', e);
    }

    // 3. Nearest known city fallback
    const nearest = findNearestCityKey(lat, lng, 300);
    if (nearest && CITY_COORDINATES[nearest]) {
        return {
            city: CITY_COORDINATES[nearest].name,
            rawCity: nearest,
            lat,
            lng
        };
    }

    return {
        city: `Located Area (${lat.toFixed(3)}° N, ${lng.toFixed(3)}° E)`,
        rawCity: 'Located Area',
        lat,
        lng
    };
}

/**
 * Curated authentic physical landmark catalog with absolute fixed coordinates
 */
const CITY_SPECIFIC_PLACES = {
    'hyderabad': [
        { id: 'hyd_1', name: 'Charminar & Laad Bazaar', category: 'Landmark', icon: '🏛️', type: 'landmark', lat: 17.3616, lng: 78.4747, rating: 4.8, reviewsCount: 4200, timings: 'Open • 09:00 AM – 08:30 PM', description: 'Iconic 16th-century monument with vibrant lacquer bangle and spice bazaars.' },
        { id: 'hyd_2', name: 'Roastery Coffee House', category: 'Café', icon: '☕', type: 'cafe', lat: 17.4326, lng: 78.4071, rating: 4.9, reviewsCount: 2150, timings: 'Open • Artisanal Roasts', description: 'Sunlit courtyard café in Jubilee Hills serving nitro cold brew, sourdough toasts, and pour-overs.' },
        { id: 'hyd_3', name: 'Golconda Fort Sound & Light', category: 'Attraction', icon: '🏰', type: 'attraction', lat: 17.3833, lng: 78.4011, rating: 4.7, reviewsCount: 3100, timings: 'Shows at 06:30 PM & 07:45 PM', description: 'Magnificent acoustic hill citadel with legendary diamond vault history.' },
        { id: 'hyd_4', name: 'Paradise Royal Biryani', category: 'Restaurant', icon: '🍛', type: 'restaurant', lat: 17.4415, lng: 78.4872, rating: 4.9, reviewsCount: 5800, timings: 'Open • Authentic Nizami Cuisine', description: 'World-famous authentic dum biryani infused with saffron and royal spices in Secunderabad.' },
        { id: 'hyd_5', name: 'Hussain Sagar Lake & Buddha Walk', category: 'Activity', icon: '🚤', type: 'activity', lat: 17.4239, lng: 78.4738, rating: 4.6, reviewsCount: 1980, timings: 'Speedboat & Catamaran cruises', description: 'Scenic promenade with speedboats leading to the majestic monolithic Buddha statue.' },
    ],
    'goa': [
        { id: 'goa_1', name: 'Fontainhas Latin Quarter', category: 'Landmark', icon: '🏛️', type: 'landmark', lat: 15.4989, lng: 73.8313, rating: 4.9, reviewsCount: 3200, timings: 'Open all day • Heritage walks', description: 'Colorful Portuguese villas, narrow cobblestone alleys, and traditional bakeries.' },
        { id: 'goa_2', name: 'Curlies Beach Shack & Sundowner', category: 'Café', icon: '☕', type: 'cafe', lat: 15.5733, lng: 73.7408, rating: 4.7, reviewsCount: 4100, timings: 'Open • Sunset Live Music', description: 'Bohemian beachfront cafe in Anjuna with chilled smoothies, live acoustic vibes, and sea breeze.' },
        { id: 'goa_3', name: 'Aguada Fort & Lighthouse', category: 'Attraction', icon: '🏰', type: 'attraction', lat: 15.4920, lng: 73.7737, rating: 4.8, reviewsCount: 2900, timings: 'Open • 09:30 AM – 06:00 PM', description: '17th-century Portuguese coastal fortress overlooking the sparkling Arabian Sea.' },
        { id: 'goa_4', name: 'Fisherman\'s Wharf Seafood', category: 'Restaurant', icon: '🍛', type: 'restaurant', lat: 15.1764, lng: 73.9472, rating: 4.9, reviewsCount: 3800, timings: 'Open • Coastal Delicacies', description: 'Riverside Goan prawn curry, butter garlic crab, and grilled sea bass.' },
        { id: 'goa_5', name: 'Grand Island Scuba & Snorkeling', category: 'Activity', icon: '🤿', type: 'activity', lat: 15.3520, lng: 73.7660, rating: 4.8, reviewsCount: 1650, timings: 'Morning tours from 07:30 AM', description: 'Coral reef diving and dolphin spotting along Goan coastal waters.' },
    ],
    'bengaluru': [
        { id: 'blr_1', name: 'Cubbon Park & Bamboo Walk', category: 'Landmark', icon: '🌲', type: 'landmark', lat: 12.9763, lng: 77.5929, rating: 4.8, reviewsCount: 4900, timings: 'Open • 06:00 AM – 07:00 PM', description: '300-acre lush green sanctuary in the heart of Bengaluru for peaceful morning walks.' },
        { id: 'blr_2', name: 'Third Wave Coffee Roasters', category: 'Café', icon: '☕', type: 'cafe', lat: 12.9352, lng: 77.6245, rating: 4.8, reviewsCount: 2400, timings: 'Open • Specialty Brews', description: 'Popular craft coffee house in Koramangala serving aeropress single origin, cold brews, and bakes.' },
        { id: 'blr_3', name: 'Bangalore Palace & Royal Grounds', category: 'Attraction', icon: '🏰', type: 'attraction', lat: 12.9982, lng: 77.5921, rating: 4.7, reviewsCount: 3400, timings: 'Open • 10:00 AM – 05:30 PM', description: 'Tudor-style royal estate with Victorian interiors, stained glass, and courtyard gardens.' },
        { id: 'blr_4', name: 'Vidyarthi Bhavan Masala Dosa', category: 'Restaurant', icon: '🍛', type: 'restaurant', lat: 12.9450, lng: 77.5736, rating: 4.9, reviewsCount: 6200, timings: 'Open • Heritage South Indian', description: 'Historic Gandhi Bazaar breakfast institution legendary for crispy ghee roast masala dosas.' },
        { id: 'blr_5', name: 'Nandi Hills Sunrise Point', category: 'Activity', icon: '🌄', type: 'activity', lat: 13.3702, lng: 77.6835, rating: 4.9, reviewsCount: 5100, timings: 'Open • Best at 05:30 AM', description: 'Mist-clad hilltop offering breathtaking panoramic cloudbed sunrises.' },
    ],
    'mumbai': [
        { id: 'mum_1', name: 'Gateway of India & Waterfront', category: 'Landmark', icon: '🏛️', type: 'landmark', lat: 18.9220, lng: 72.8347, rating: 4.9, reviewsCount: 7800, timings: 'Open 24 Hours', description: 'Grand waterfront basalt arch overlooking Mumbai harbor and the Arabian Sea.' },
        { id: 'mum_2', name: 'Kala Ghoda Cafe & Art Precinct', category: 'Café', icon: '☕', type: 'cafe', lat: 18.9275, lng: 72.8315, rating: 4.8, reviewsCount: 1900, timings: 'Open • Artisanal & Organic', description: 'Chic café tucked in heritage art district serving waffles and single-origin coffee.' },
        { id: 'mum_3', name: 'Marine Drive Queens Necklace', category: 'Attraction', icon: '🌊', type: 'attraction', lat: 18.9432, lng: 72.8230, rating: 4.9, reviewsCount: 6900, timings: 'Best for Sunset & Night Walk', description: '3.6 km arcuate promenade known for evening breezes and dazzling city lights.' },
        { id: 'mum_4', name: 'Britannia & Co. Berry Pulao', category: 'Restaurant', icon: '🍛', type: 'restaurant', lat: 18.9351, lng: 72.8398, rating: 4.7, reviewsCount: 3100, timings: 'Lunch • Parsi Heritage', description: 'Beloved 100-year-old Parsi institution famous for Iranian Berry Pulao & Caramel Custard.' },
        { id: 'mum_5', name: 'Elephanta Island Cave Cruise', category: 'Activity', icon: '🚤', type: 'activity', lat: 18.9633, lng: 72.9315, rating: 4.7, reviewsCount: 2200, timings: 'Ferry departures every 30 mins', description: 'UNESCO World Heritage rock-cut temples dedicated to Lord Shiva across Mumbai Harbor.' },
    ],
    'delhi': [
        { id: 'del_1', name: 'India Gate & Kartavya Path', category: 'Landmark', icon: '🏛️', type: 'landmark', lat: 28.6129, lng: 77.2295, rating: 4.9, reviewsCount: 8200, timings: 'Open 24 Hours • Illuminated evenings', description: 'Grand triumphal war memorial arch and expansive ceremonial green lawns.' },
        { id: 'del_2', name: 'Blue Tokai Roastery Hauz Khas', category: 'Café', icon: '☕', type: 'cafe', lat: 28.5535, lng: 77.1945, rating: 4.8, reviewsCount: 2600, timings: 'Open • Single Origin Coffee', description: 'Specialty coffee roastery in vintage bohemian alley with artisanal sourdough.' },
        { id: 'del_3', name: 'Qutub Minar & Iron Pillar', category: 'Attraction', icon: '🏰', type: 'attraction', lat: 28.5244, lng: 77.1855, rating: 4.9, reviewsCount: 6400, timings: 'Open • 07:00 AM – 06:00 PM', description: 'UNESCO World Heritage 73m victory minaret surrounded by intricately carved medieval cloisters.' },
        { id: 'del_4', name: 'Karim\'s Historic Mughlai Feast', category: 'Restaurant', icon: '🍛', type: 'restaurant', lat: 28.6508, lng: 77.2334, rating: 4.8, reviewsCount: 5900, timings: 'Open • Royal Mughal Recipes', description: 'Iconic Old Delhi culinary gem serving mutton burra kebabs, nihari and rumali roti.' },
        { id: 'del_5', name: 'Hauz Khas Fort Lake Walk', category: 'Activity', icon: '🚶', type: 'activity', lat: 28.5494, lng: 77.1932, rating: 4.7, reviewsCount: 3100, timings: 'Open • Sunrise to Sunset', description: '14th-century royal madrasa ruins overlooking scenic water reservoir and Deer Park.' },
    ],
    'jaipur': [
        { id: 'jai_1', name: 'Hawa Mahal & Old City', category: 'Landmark', icon: '🏛️', type: 'landmark', lat: 26.9239, lng: 75.8267, rating: 4.9, reviewsCount: 6700, timings: 'Open • 09:00 AM – 05:00 PM', description: 'Pink honeycomb sandstone palace with 953 ornate latticework jharokhas.' },
        { id: 'jai_2', name: 'Tapri Central Rooftop Café', category: 'Café', icon: '☕', type: 'cafe', lat: 26.9075, lng: 75.8062, rating: 4.8, reviewsCount: 3200, timings: 'Open • Rooftop Park Views', description: 'Famous rooftop cafe serving chai in earthen kulhads, bun maska, and fusion street snacks.' },
        { id: 'jai_3', name: 'Amber Fort & Elephant Ridge', category: 'Attraction', icon: '🏰', type: 'attraction', lat: 26.9855, lng: 75.8513, rating: 4.9, reviewsCount: 7100, timings: 'Open • 08:00 AM – 05:30 PM', description: 'Magnificent hilltop Rajput citadel with Sheesh Mahal mirror palace and Maota Lake views.' },
        { id: 'jai_4', name: 'Chokhi Dhani Royal Thali', category: 'Restaurant', icon: '🍛', type: 'restaurant', lat: 26.7663, lng: 75.8362, rating: 4.8, reviewsCount: 5400, timings: 'Evening Experience • 06:00 PM', description: 'Traditional Rajasthani cultural village with dal baati churma and folk dance.' },
        { id: 'jai_5', name: 'Nahargarh Fort Sunset Point', category: 'Activity', icon: '🌅', type: 'activity', lat: 26.9372, lng: 75.8155, rating: 4.9, reviewsCount: 4300, timings: 'Best at Sunset (05:30 PM)', description: 'Spectacular cliff-edge fortress terrace looking over the entire illuminated Pink City.' },
    ],
    'manali': [
        { id: 'man_1', name: 'Solang Valley Ropeway', category: 'Landmark', icon: '🚠', type: 'landmark', lat: 32.3166, lng: 77.1575, rating: 4.9, reviewsCount: 4600, timings: 'Open • 09:00 AM – 06:00 PM', description: 'High-altitude snow adventure arena for paragliding, skiing, and cable car rides.' },
        { id: 'man_2', name: 'Café 1947 & Riverside Music', category: 'Café', icon: '☕', type: 'cafe', lat: 32.2562, lng: 77.1812, rating: 4.8, reviewsCount: 2900, timings: 'Open • Riverside seating', description: 'Charming Old Manali cafe right by the Manalsu river stream with wood-fired pizzas.' },
        { id: 'man_3', name: 'Hidimba Devi Temple & Woods', category: 'Attraction', icon: '🌲', type: 'attraction', lat: 32.2483, lng: 77.1805, rating: 4.8, reviewsCount: 5200, timings: 'Open • 08:00 AM – 06:00 PM', description: '16th-century wooden pagoda temple nestled inside towering cedar deodar forests.' },
        { id: 'man_4', name: 'Chopsticks Tibetan Kitchen', category: 'Restaurant', icon: '🍜', type: 'restaurant', lat: 32.2396, lng: 77.1887, rating: 4.7, reviewsCount: 3100, timings: 'Open • Tibetan Specialties', description: 'Authentic Himalayan steaming momos, thukpa noodles, and honey ginger tea on Mall Road.' },
        { id: 'man_5', name: 'Jogini Waterfall Pine Trek', category: 'Activity', icon: '🏔️', type: 'activity', lat: 32.2680, lng: 77.1980, rating: 4.9, reviewsCount: 2800, timings: 'Daylight hiking trail', description: 'Scenic 3 km pine forest trail leading to cascading mountain waterfalls.' },
    ],
    'paris': [
        { id: 'par_1', name: 'Eiffel Tower & Champ de Mars', category: 'Landmark', icon: '🗼', type: 'landmark', lat: 48.8584, lng: 2.2945, rating: 4.9, reviewsCount: 8900, timings: 'Open • 09:00 AM – 11:45 PM', description: 'World-famous wrought-iron tower offering panoramic vistas over Paris.' },
        { id: 'par_2', name: 'Café de Flore Saint-Germain', category: 'Café', icon: '☕', type: 'cafe', lat: 48.8542, lng: 2.3330, rating: 4.8, reviewsCount: 3400, timings: 'Open • Classic Parisian Bistro', description: 'Historic coffeehouse famous for hot chocolate, croissants, and literary heritage.' },
        { id: 'par_3', name: 'Louvre Museum & Glass Pyramid', category: 'Attraction', icon: '🏛️', type: 'attraction', lat: 48.8606, lng: 2.3376, rating: 4.9, reviewsCount: 9200, timings: 'Open • 09:00 AM – 06:00 PM', description: 'The world’s largest art museum, home to the Mona Lisa and Venus de Milo.' },
        { id: 'par_4', name: 'Le Relais de Venise Entrecôte', category: 'Restaurant', icon: '🍷', type: 'restaurant', lat: 48.8778, lng: 2.2852, rating: 4.8, reviewsCount: 4100, timings: 'Open • French Steak-Frites', description: 'Iconic Parisian steak frites with signature secret house sauce.' },
        { id: 'par_5', name: 'Seine River Sunset Cruise', category: 'Activity', icon: '🚤', type: 'activity', lat: 48.8571, lng: 2.3417, rating: 4.9, reviewsCount: 3800, timings: 'Departures every 45 mins', description: 'Gliding past illuminated Notre-Dame, Musée d’Orsay, and historic bridges.' },
    ],
    'tokyo': [
        { id: 'tok_1', name: 'Shibuya Crossing & Hachiko', category: 'Landmark', icon: '⚡', type: 'landmark', lat: 35.6595, lng: 139.7005, rating: 4.9, reviewsCount: 9400, timings: 'Open 24 Hours • Best at Neon Dusk', description: 'The world’s busiest pedestrian crossing surrounded by giant illuminated video screens.' },
        { id: 'tok_2', name: 'Fuglen Tokyo Vintage Café', category: 'Café', icon: '☕', type: 'cafe', lat: 35.6672, lng: 139.6922, rating: 4.8, reviewsCount: 2200, timings: 'Open • Nordic Roasts & Cocktails', description: 'Cozy Mid-century modern roastery serving exceptional pour-overs near Yoyogi Park.' },
        { id: 'tok_3', name: 'Senso-ji Temple & Asakusa', category: 'Attraction', icon: '⛩️', type: 'attraction', lat: 35.7148, lng: 139.7967, rating: 4.9, reviewsCount: 8100, timings: 'Open • 06:00 AM – 05:00 PM', description: 'Tokyo’s oldest Buddhist temple with towering Kaminarimon thunder gate.' },
        { id: 'tok_4', name: 'Tsukiji Outer Market Sushi Bar', category: 'Restaurant', icon: '🍣', type: 'restaurant', lat: 35.6655, lng: 139.7707, rating: 4.9, reviewsCount: 6100, timings: 'Morning & Lunch • Fresh Sashimi', description: 'Bustling seafood street food stalls serving fresh otoro tuna and tamagoyaki.' },
        { id: 'tok_5', name: 'TeamLab Planets Digital Realm', category: 'Activity', icon: '✨', type: 'activity', lat: 35.6491, lng: 139.7898, rating: 4.9, reviewsCount: 5200, timings: 'Timed tickets • Immersive Art', description: 'Mesmerizing museum where you walk through water and infinite mirror light rooms in Toyosu.' },
    ],
    'london': [
        { id: 'lon_1', name: 'Big Ben & Westminster Bridge', category: 'Landmark', icon: '🕰️', type: 'landmark', lat: 51.5007, lng: -0.1246, rating: 4.9, reviewsCount: 8800, timings: 'Open view 24 Hours', description: 'Iconic neo-Gothic clock tower beside the River Thames and Westminster Bridge.' },
        { id: 'lon_2', name: 'Monmouth Coffee Covent Garden', category: 'Café', icon: '☕', type: 'cafe', lat: 51.5135, lng: -0.1265, rating: 4.8, reviewsCount: 3100, timings: 'Open • Artisanal Roastery', description: 'Pioneering specialty coffee shop with rich espresso and artisanal pastries.' },
        { id: 'lon_3', name: 'Tower Bridge & Thames Path', category: 'Attraction', icon: '🌉', type: 'attraction', lat: 51.5055, lng: -0.0754, rating: 4.9, reviewsCount: 7500, timings: 'Glass floor walkways open daily', description: 'Victorian suspension bridge with glass floor walkway above the river.' },
        { id: 'lon_4', name: 'Dishoom Covent Garden Feast', category: 'Restaurant', icon: '🍛', type: 'restaurant', lat: 51.5126, lng: -0.1268, rating: 4.9, reviewsCount: 6800, timings: 'Open • Bombay Café Delicacies', description: 'Famous Irani café atmosphere serving house black daal and gunpowder potatoes.' },
        { id: 'lon_5', name: 'Sky Garden 360° Panorama', category: 'Activity', icon: '🌿', type: 'activity', lat: 51.5111, lng: -0.0836, rating: 4.8, reviewsCount: 4900, timings: 'Free reservation entry', description: 'Lush indoor landscaped atrium offering 360-degree skyline views across London.' },
    ],
    'bali': [
        { id: 'bal_1', name: 'Tanah Lot Sacred Sea Temple', category: 'Landmark', icon: '🏛️', type: 'landmark', lat: -8.6212, lng: 115.0868, rating: 4.9, reviewsCount: 7200, timings: 'Open • Best at Sunset', description: 'Ancient Hindu shrine perched dramatically on a wave-swept offshore rock formation.' },
        { id: 'bal_2', name: 'Revolver Espresso Seminyak', category: 'Café', icon: '☕', type: 'cafe', lat: -8.6853, lng: 115.1557, rating: 4.8, reviewsCount: 2800, timings: 'Open • Specialty Coffee House', description: 'Cool speakeasy boutique coffee boutique serving cold drip and brunch.' },
        { id: 'bal_3', name: 'Ubud Sacred Monkey Forest', category: 'Attraction', icon: '🐒', type: 'attraction', lat: -8.5188, lng: 115.2585, rating: 4.8, reviewsCount: 6500, timings: 'Open • 09:00 AM – 06:00 PM', description: 'Lush sanctuary and temple complex home to hundreds of playful Balinese macaques.' },
        { id: 'bal_4', name: 'Warung Babi Guling Ibu Oka', category: 'Restaurant', icon: '🍛', type: 'restaurant', lat: -8.5069, lng: 115.2625, rating: 4.7, reviewsCount: 4200, timings: 'Open for Lunch', description: 'Legendary Ubud institution famous for crispy spiced roast pork and sambal matah.' },
        { id: 'bal_5', name: 'Tegalalang Rice Terraces Swing', category: 'Activity', icon: '🌴', type: 'activity', lat: -8.4312, lng: 115.2798, rating: 4.9, reviewsCount: 5400, timings: 'Open • 08:00 AM – 06:00 PM', description: 'Step-terraced emerald valley with scenic jungle canopy swings and walkways.' },
    ],
    'dubai': [
        { id: 'dxb_1', name: 'Burj Khalifa & Dancing Fountain', category: 'Landmark', icon: '🏙️', type: 'landmark', lat: 25.1972, lng: 55.2744, rating: 4.9, reviewsCount: 9800, timings: 'Open • 08:30 AM – 11:00 PM', description: 'The tallest building on earth with spectacular fountain light choreography below.' },
        { id: 'dxb_2', name: 'Arabian Tea House Al Fahidi', category: 'Café', icon: '☕', type: 'cafe', lat: 25.2635, lng: 55.3003, rating: 4.8, reviewsCount: 3900, timings: 'Open • Authentic Emirati Courtyard', description: 'Turquoise-and-white courtyard cafe serving karak tea, fresh flatbreads and dates.' },
        { id: 'dxb_3', name: 'Dubai Frame Golden Arch', category: 'Attraction', icon: '🖼️', type: 'attraction', lat: 25.2355, lng: 55.3004, rating: 4.7, reviewsCount: 4800, timings: 'Open • 09:00 AM – 09:00 PM', description: '150-meter-tall golden picture frame offering Old vs. New Dubai glass walkway views.' },
        { id: 'dxb_4', name: 'Pierchic Overwater Seafood', category: 'Restaurant', icon: '🦞', type: 'restaurant', lat: 25.1325, lng: 55.1843, rating: 4.9, reviewsCount: 3100, timings: 'Evening Dining • Jumeirah Pier', description: 'High-end Mediterranean dining at the end of a private wooden pier over the Gulf.' },
        { id: 'dxb_5', name: 'Red Dunes Sunset Desert Safari', category: 'Activity', icon: '🚙', type: 'activity', lat: 24.9520, lng: 55.6120, rating: 4.9, reviewsCount: 6500, timings: 'Afternoon departures at 03:00 PM', description: 'Thrilling 4x4 dune bashing, sandboarding, falconry and starlit Bedouin barbecue.' },
    ],
    'new york': [
        { id: 'nyc_1', name: 'Central Park & Bethesda Terrace', category: 'Landmark', icon: '🌲', type: 'landmark', lat: 40.7738, lng: -73.9708, rating: 4.9, reviewsCount: 9600, timings: 'Open • 06:00 AM – 01:00 AM', description: '843-acre world-famous green park with rowboat lake, Bow Bridge, and meadows.' },
        { id: 'nyc_2', name: 'Devoción Brooklyn Coffee Roasters', category: 'Café', icon: '☕', type: 'cafe', lat: 40.7161, lng: -73.9646, rating: 4.8, reviewsCount: 2700, timings: 'Open • Farm-to-Cup Colombian', description: 'Sunlit warehouse cafe featuring a living vertical plant wall and fresh roasted beans.' },
        { id: 'nyc_3', name: 'Empire State Building Observatory', category: 'Attraction', icon: '🏙️', type: 'attraction', lat: 40.7484, lng: -73.9857, rating: 4.8, reviewsCount: 8900, timings: 'Open • 09:00 AM – 12:00 AM', description: 'Art Deco skyscraper icon offering 86th & 102nd floor panoramic open-air vistas.' },
        { id: 'nyc_4', name: 'Katz\'s Delicatessen Pastrami', category: 'Restaurant', icon: '🥪', type: 'restaurant', lat: 40.7222, lng: -73.9874, rating: 4.8, reviewsCount: 7800, timings: 'Open • Legendary Deli since 1888', description: 'Historic Lower East Side institution famed for hand-carved pastrami on rye.' },
        { id: 'nyc_5', name: 'High Line Elevated Park Walk', category: 'Activity', icon: '🚶', type: 'activity', lat: 40.7480, lng: -74.0048, rating: 4.9, reviewsCount: 5600, timings: 'Open • 07:00 AM – 10:00 PM', description: '1.45-mile elevated freight rail line transformed into a lush public landscape trail.' },
    ]
};

/**
 * Generates dynamic local places with real absolute coordinates and calculated distance from user
 */
export function getPlacesNearLocation(locationName = 'Hyderabad, India', userLat = 17.3850, userLng = 78.4867) {
    const clean = (locationName || 'hyderabad').toLowerCase();

    // 1. Check if locationName matches a curated city key
    let matchedCityKey = null;
    for (const key in CITY_SPECIFIC_PLACES) {
        if (clean === key || clean.includes(key) || key.includes(clean)) {
            matchedCityKey = key;
            break;
        }
    }

    // 2. If no name match, check if GPS coordinates are within range of a known major city
    if (!matchedCityKey && typeof userLat === 'number' && typeof userLng === 'number') {
        matchedCityKey = findNearestCityKey(userLat, userLng, 120);
    }

    const cityCoords = getCoordinatesForLocation(locationName);
    const liveUserLat = (typeof userLat === 'number' && !isNaN(userLat)) ? userLat : cityCoords.lat;
    const liveUserLng = (typeof userLng === 'number' && !isNaN(userLng)) ? userLng : cityCoords.lng;

    let basePlaces = [];

    if (matchedCityKey && CITY_SPECIFIC_PLACES[matchedCityKey]) {
        basePlaces = CITY_SPECIFIC_PLACES[matchedCityKey];
    } else {
        // Dynamic generation for any custom city name
        const cityPrefix = locationName.split(',')[0].replace(/Located Area|GPS Located Position|\(.*?\)/g, '').trim() || 'Local';
        basePlaces = [
            {
                id: `custom_1_${cityPrefix}`,
                name: `${cityPrefix} Heritage Center & Clocktower`,
                category: 'Landmark',
                icon: '🏛️',
                type: 'landmark',
                lat: liveUserLat + 0.0150,
                lng: liveUserLng + 0.0120,
                rating: 4.8,
                reviewsCount: 1420,
                timings: 'Open • 09:00 AM – 07:00 PM',
                description: `Historic centerpiece landmark showcasing the cultural heritage and architecture of ${cityPrefix}.`
            },
            {
                id: `custom_2_${cityPrefix}`,
                name: `${cityPrefix} Artisan Roastery & Bakery`,
                category: 'Café',
                icon: '☕',
                type: 'cafe',
                lat: liveUserLat - 0.0110,
                lng: liveUserLng + 0.0180,
                rating: 4.9,
                reviewsCount: 980,
                timings: 'Open • Artisanal Coffee & Brunch',
                description: `Charming local coffee house serving specialty pour-overs, fresh sourdough, and pastries.`
            },
            {
                id: `custom_3_${cityPrefix}`,
                name: `${cityPrefix} Grand Viewpoint & Fort`,
                category: 'Attraction',
                icon: '🏰',
                type: 'attraction',
                lat: liveUserLat + 0.0280,
                lng: liveUserLng - 0.0240,
                rating: 4.7,
                reviewsCount: 1850,
                timings: 'Open • Best for Sunset',
                description: `Panoramic vantage lookout offering sweeping views across the landscape of ${cityPrefix}.`
            },
            {
                id: `custom_4_${cityPrefix}`,
                name: `${cityPrefix} Traditional Kitchen & Spices`,
                category: 'Restaurant',
                icon: '🍛',
                type: 'restaurant',
                lat: liveUserLat - 0.0180,
                lng: liveUserLng - 0.0120,
                rating: 4.9,
                reviewsCount: 2300,
                timings: 'Lunch & Dinner • Local Cuisine',
                description: `Celebrated restaurant serving time-honored authentic dishes and regional delicacies.`
            },
            {
                id: `custom_5_${cityPrefix}`,
                name: `${cityPrefix} Nature Promenade & River Walk`,
                category: 'Activity',
                icon: '🌲',
                type: 'activity',
                lat: liveUserLat + 0.0320,
                lng: liveUserLng + 0.0250,
                rating: 4.8,
                reviewsCount: 1100,
                timings: 'Open all day • Scenic trail',
                description: `Peaceful scenic promenade and walking trail ideal for morning runs and golden hour photography.`
            }
        ];
    }

    return basePlaces.map((place, idx) => {
        // Calculate true geodesic distance from live user GPS / current position to the place's absolute lat/lng
        const { km, text } = calculateExactDistanceKm(liveUserLat, liveUserLng, place.lat, place.lng);
        const image = getPlacePhoto(place.name, place.category, idx);

        return {
            ...place,
            distanceKm: km,
            distanceText: text,
            image,
        };
    });
}

/**
 * Device GPS Browser Geolocation with Live Google SDK Reverse Geocoding
 */
export function getCurrentGPSLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({
                status: 'unsupported',
                error: 'Geolocation is not supported by your browser',
                city: 'Hyderabad, India',
                lat: 17.3850,
                lng: 78.4867
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                // Live reverse geocoding via Google Maps SDK & Nominatim
                const geoInfo = await reverseGeocodeCoords(latitude, longitude);

                resolve({
                    status: 'granted',
                    lat: latitude,
                    lng: longitude,
                    city: geoInfo.city,
                    rawCity: geoInfo.rawCity,
                    accuracy
                });
            },
            (error) => {
                let status = 'error';
                if (error.code === error.PERMISSION_DENIED) {
                    status = 'denied';
                }
                resolve({
                    status,
                    error: error.message,
                    city: 'Hyderabad, India (Default)',
                    lat: 17.3850,
                    lng: 78.4867
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

import React, { useMemo } from 'react';
import { Sparkles, Plus, Star, MapPin, ArrowRight, Heart } from 'lucide-react';
import { getDestinationPhoto } from '../../services/imageService.js';
import { getDestinationDistance, getCoordinatesForLocation } from '../../services/locationService.js';

// Recommendation pool matrix by region and vibe
const REGIONAL_RECOMMENDATION_MATRIX = {
    // If user is located in India / South Asia
    'india': [
        {
            id: 'ladakh',
            name: 'Pangong Tso & Nubra Valley',
            region: 'Ladakh, India',
            lat: 34.1526,
            lng: 77.5771,
            vibe: '🏔️ High Adventure',
            rating: 5.0,
            budget: 'Moderate',
            styles: ['Adventure', 'Nature'],
            matchReason: (city) => `Top scenic mountain escape accessible from ${city.split(',')[0]}`,
            highlights: ['Pangong Lake Camping', 'Khardung La Pass', 'Monastery Trails']
        },
        {
            id: 'kerala',
            name: 'Alleppey Backwaters & Munnar',
            region: 'Kerala, India',
            lat: 9.9312,
            lng: 76.2673,
            vibe: '🌲 Nature & Serenity',
            rating: 4.9,
            budget: 'Moderate',
            styles: ['Nature', 'Relaxation', 'Foodie'],
            matchReason: (city) => `Lush tea gardens & luxury houseboat cruises from ${city.split(',')[0]}`,
            highlights: ['Private Houseboat Cruise', 'Munnar Tea Estates', 'Ayurvedic Spa']
        },
        {
            id: 'jaipur',
            name: 'Pink City & Amber Fort',
            region: 'Rajasthan, India',
            lat: 26.9124,
            lng: 75.7873,
            vibe: '🏛️ Heritage & Culture',
            rating: 4.8,
            budget: 'Moderate',
            styles: ['Culture', 'Foodie'],
            matchReason: (city) => `Royal palaces & historic bazaar tasting trails`,
            highlights: ['Amber Fort Elephant Walk', 'Hawa Mahal Sunrise', 'Dal Baati Churma Feast']
        },
        {
            id: 'goa',
            name: 'South Goa Hidden Coves & Shacks',
            region: 'Goa, India',
            lat: 15.2993,
            lng: 74.1240,
            vibe: '🏖️ Relaxation & Food',
            rating: 4.9,
            budget: 'Moderate',
            styles: ['Relaxation', 'Foodie'],
            matchReason: (city) => `Direct coastal retreat with golden beaches and fresh seafood`,
            highlights: ['Cola Beach Lagoon', 'Fontainhas Heritage Tour', 'Sunset Cruise']
        },
        {
            id: 'bali',
            name: 'Ubud Rainforest & Nusa Penida',
            region: 'Bali, Indonesia',
            lat: -8.3405,
            lng: 115.0920,
            vibe: '🌴 Island Tropical',
            rating: 4.9,
            budget: 'Moderate',
            styles: ['Relaxation', 'Adventure', 'Nature'],
            matchReason: (city) => `Short flight overseas escape with crystal lagoons & jungle villas`,
            highlights: ['Tegalalang Rice Terraces', 'Kelingking Cliff View', 'Mount Batur Sunrise']
        },
        {
            id: 'dubai',
            name: 'Desert Safari & Burj Skyline',
            region: 'Dubai, UAE',
            lat: 25.2048,
            lng: 55.2708,
            vibe: '✨ Luxury & Modern',
            rating: 4.8,
            budget: 'Luxury',
            styles: ['Adventure', 'Culture'],
            matchReason: (city) => `Direct international flight for high-octane desert adventures`,
            highlights: ['Dune Bashing Safari', 'Burj Khalifa Observation', 'Dubai Marina Yacht']
        }
    ],

    // If user is located in Europe / Western World
    'europe': [
        {
            id: 'interlaken',
            name: 'Interlaken & Jungfrau Alps',
            region: 'Bernese Alps, Switzerland',
            lat: 46.6863,
            lng: 7.8632,
            vibe: '🏔️ High Alpine',
            rating: 5.0,
            budget: 'Luxury',
            styles: ['Adventure', 'Nature'],
            matchReason: (city) => `Breathtaking glacier train & paragliding escape from ${city.split(',')[0]}`,
            highlights: ['Jungfraujoch Top of Europe', 'Lake Brienz Cruise', 'Glacier Ice Caves']
        },
        {
            id: 'amalfi',
            name: 'Amalfi Coast & Positano Cliffs',
            region: 'Campania, Italy',
            lat: 40.6340,
            lng: 14.6027,
            vibe: '🏖️ Scenic Coastal',
            rating: 4.9,
            budget: 'Luxury',
            styles: ['Relaxation', 'Foodie'],
            matchReason: (city) => `Sun-drenched cliffside villages & private coastal yachts`,
            highlights: ['Path of the Gods Hike', 'Limoncello Tasting', 'Capri Island Boat']
        },
        {
            id: 'tromso',
            name: 'Lofoten Islands & Aurora Safaris',
            region: 'Norway',
            lat: 69.6492,
            lng: 18.9553,
            vibe: '🌲 Arctic Wilderness',
            rating: 4.9,
            budget: 'Moderate',
            styles: ['Nature', 'Adventure'],
            matchReason: (city) => `Northern lights and majestic fjord excursions`,
            highlights: ['Aurora Safari Chase', 'Fjord Kayaking', 'Midnight Sun Excursion']
        },
        {
            id: 'santorini',
            name: 'Oia Caldera & White Villas',
            region: 'Cyclades, Greece',
            lat: 36.3932,
            lng: 25.4615,
            vibe: '🌅 Romance & Views',
            rating: 4.9,
            budget: 'Luxury',
            styles: ['Relaxation', 'Culture'],
            matchReason: (city) => `Iconic Aegean sunsets and cliffside infinity pools`,
            highlights: ['Oia Sunset Walk', 'Volcanic Beach Tour', 'Catamaran Wine Tasting']
        }
    ],

    // If user is located in East Asia / Americas / Others
    'global': [
        {
            id: 'kyoto',
            name: 'Kyoto & Arashiyama Groves',
            region: 'Kansai, Japan',
            lat: 35.0116,
            lng: 135.7681,
            vibe: '🏛️ Zen Culture',
            rating: 4.9,
            budget: 'Moderate',
            styles: ['Culture', 'Nature'],
            matchReason: (city) => `Serene bamboo forests & centuries-old shrines`,
            highlights: ['Fushimi Inari Torii Gates', 'Arashiyama Bamboo Forest', 'Matcha Ceremony']
        },
        {
            id: 'new_york',
            name: 'Manhattan Skyline & Broadway',
            region: 'New York, USA',
            lat: 40.7128,
            lng: -74.0060,
            vibe: '🏙️ Urban Energy',
            rating: 4.8,
            budget: 'Luxury',
            styles: ['Culture', 'Foodie'],
            matchReason: (city) => `World-class dining, Broadway theatre, and Central Park`,
            highlights: ['Central Park Bike Tour', 'Summit One Vanderbilt', 'SoHo Food Walk']
        },
        {
            id: 'reykjavik',
            name: 'Golden Circle & Blue Lagoon',
            region: 'Iceland',
            lat: 64.1466,
            lng: -21.9426,
            vibe: '🌋 Geothermal & Nature',
            rating: 5.0,
            budget: 'Luxury',
            styles: ['Adventure', 'Nature'],
            matchReason: (city) => `Volcanic geysers, black sand beaches, and mineral hot springs`,
            highlights: ['Blue Lagoon Geothermal Spa', 'Gullfoss Waterfall', 'Black Sand Beach']
        },
        {
            id: 'cairo',
            name: 'Giza Pyramids & Nile Cruise',
            region: 'Egypt',
            lat: 30.0444,
            lng: 31.2357,
            vibe: '🏛️ Ancient Wonders',
            rating: 4.8,
            budget: 'Moderate',
            styles: ['Culture', 'Adventure'],
            matchReason: (city) => `The monumental Great Pyramids and sunset felucca sailing`,
            highlights: ['Great Pyramid of Giza', 'Grand Egyptian Museum', 'Nile Sunset Sail']
        }
    ]
};

export function PlacesInMind({
    currentLocation = 'Hyderabad, India',
    currentCoords = null,
    preferences = {},
    onPlanTripWithDestination
}) {
    // Dynamically select and rank recommendations based on currentLocation & traveler preferences
    const recommendedPlaces = useMemo(() => {
        const locLower = currentLocation.toLowerCase();
        let primaryPool = REGIONAL_RECOMMENDATION_MATRIX.india;

        if (locLower.includes('paris') || locLower.includes('london') || locLower.includes('berlin') || locLower.includes('rome') || locLower.includes('europe') || locLower.includes('norway') || locLower.includes('greece')) {
            primaryPool = REGIONAL_RECOMMENDATION_MATRIX.europe;
        } else if (locLower.includes('tokyo') || locLower.includes('new york') || locLower.includes('singapore') || locLower.includes('sydney') || locLower.includes('japan') || locLower.includes('usa')) {
            primaryPool = REGIONAL_RECOMMENDATION_MATRIX.global;
        }

        const combined = [...primaryPool, ...REGIONAL_RECOMMENDATION_MATRIX.global];
        const userStyles = preferences.travelStyle || ['Adventure', 'Nature', 'Foodie'];

        // Score based on preference matching
        const scored = combined.map((place) => {
            let score = 0;
            if (place.styles.some((s) => userStyles.includes(s))) score += 2;
            if (preferences.budget && place.budget === preferences.budget) score += 1;

            const placeCoords = getCoordinatesForLocation(place.id);
            const distInfo = getDestinationDistance(currentLocation, currentCoords, place.name, placeCoords);

            return {
                ...place,
                score,
                image: getDestinationPhoto(place.id),
                reason: place.matchReason(currentLocation),
                distanceText: distInfo.text,
                travelEstimate: distInfo.travelEstimate,
            };
        });

        // Deduplicate and take top 4
        const uniqueMap = new Map();
        scored.forEach((item) => {
            if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
        });

        return Array.from(uniqueMap.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);
    }, [currentLocation, currentCoords, preferences]);

    return (
        <section className="space-y-3.5 pt-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Places in Mind
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI Recommendation Engine
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Tailored for <span className="font-semibold text-slate-700 dark:text-slate-300">{currentLocation}</span> from your profile & preferences.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {recommendedPlaces.map((place) => (
                    <div
                        key={place.id}
                        className="group bg-white dark:bg-[#131B2E] rounded-3xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900 transition-all duration-200 flex flex-col justify-between"
                    >
                        {/* Image Banner */}
                        <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-900 mb-2.5">
                            <img
                                src={place.image}
                                alt={place.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                            <div className="absolute top-2.5 left-2.5">
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/90 backdrop-blur-md text-white shadow-xs">
                                    {place.vibe}
                                </span>
                            </div>

                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                                <span className="text-xs font-bold truncate drop-shadow-sm">{place.name}</span>
                                <div className="flex items-center gap-1 text-amber-300 text-xs font-bold bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex-shrink-0">
                                    <Star className="w-3 h-3 fill-amber-300" />
                                    <span>{place.rating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Match Reason & Distance callout */}
                        <div className="space-y-1.5 flex-1">
                            <div className="p-2 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/60 text-[11px] font-medium text-orange-900 dark:text-orange-200">
                                🎯 {place.reason}
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-0.5">
                                <span className="font-semibold text-[#F06536]">
                                    🚀 {place.distanceText}
                                </span>
                                {place.travelEstimate && (
                                    <span className="font-medium text-slate-400">
                                        ✈️ {place.travelEstimate}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Bottom Plan Trip Action */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                {place.budget} Tier
                            </span>
                            <button
                                onClick={() => {
                                    const coords = (typeof place.lat === 'number' && typeof place.lng === 'number')
                                        ? { lat: place.lat, lng: place.lng }
                                        : getCoordinatesForLocation(place.id);
                                    onPlanTripWithDestination?.({
                                        id: place.id,
                                        name: place.name.split('&')[0].trim(),
                                        region: place.region,
                                        location: place.region || place.name,
                                        lat: coords.lat,
                                        lng: coords.lng,
                                        coordinates: coords,
                                        image: place.image,
                                        vibe: place.vibe
                                    });
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F06536] hover:bg-[#E05325] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                            >
                                <Plus className="w-3 h-3" />
                                <span>Plan Trip</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

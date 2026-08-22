import React, { useState } from 'react';
import { MapPin, Star, Navigation, ArrowRight, Coffee, Utensils, Landmark, Compass, Eye } from 'lucide-react';

const NEAR_PLACES = [
    {
        id: 'charminar',
        name: 'Charminar & Old City Markets',
        distance: '3.2 km away',
        category: 'Landmark',
        icon: '🏛️',
        rating: 4.7,
        reviewsCount: 3840,
        timings: 'Open • Closes 8:30 PM',
        description: 'Iconic 16th-century mosque surrounded by bustling spice, pearl and bangle bazaars.',
        type: 'landmark',
    },
    {
        id: 'roastery',
        name: 'Roastery Coffee House',
        distance: '1.8 km away',
        category: 'Café',
        icon: '☕',
        rating: 4.8,
        reviewsCount: 1920,
        timings: 'Open • Artisanal Brews',
        description: 'Charming courtyard cafe serving cold brews, cascara and gourmet continental breakfast.',
        type: 'cafe',
    },
    {
        id: 'golconda',
        name: 'Golconda Fort Sound & Light',
        distance: '7.5 km away',
        category: 'Attraction',
        icon: '🏰',
        rating: 4.6,
        reviewsCount: 2980,
        timings: 'Evening Show • 6:30 PM',
        description: 'Acoustic marvel hill fortress with panoramic city views and dramatic history.',
        type: 'attraction',
    },
    {
        id: 'paradise',
        name: 'Paradise Royal Biryani',
        distance: '2.1 km away',
        category: 'Restaurant',
        icon: '🍛',
        rating: 4.9,
        reviewsCount: 5400,
        timings: 'Open • Authentic Nizami',
        description: 'Legendary Hyderabadi dum biryani, mirchi ka salan and tender mutton kebabs.',
        type: 'restaurant',
    },
    {
        id: 'hussain_sagar',
        name: 'Hussain Sagar Lake & Buddha Walk',
        distance: '4.0 km away',
        category: 'Activity',
        icon: '🚤',
        rating: 4.5,
        reviewsCount: 1650,
        timings: 'Speedboats Available',
        description: 'Scenic heart-shaped lake promenade with boat cruises to the monolithic Buddha statue.',
        type: 'activity',
    },
];

export function NearYou({
    currentLocation = 'Hyderabad, India',
    onSelectPlace
}) {
    const [filter, setFilter] = useState('all');

    const filtered = NEAR_PLACES.filter(
        (p) => filter === 'all' || p.type === filter
    );

    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#181A20] tracking-tight">
                        Near you
                    </h2>
                    <p className="text-xs text-stone-500">
                        Discover something around <span className="font-semibold text-stone-700">{currentLocation}</span>.
                    </p>
                </div>

                {/* Live Radar Beacon Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-[11px] font-bold">
                    <Navigation className="w-3 h-3 text-emerald-600 animate-pulse" />
                    <span>GPS Active</span>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar touch-pan-x select-none -mx-4 px-4 sm:mx-0 sm:px-0">
                {[
                    { id: 'all', label: 'All Nearby' },
                    { id: 'landmark', label: 'Landmarks 🏛️' },
                    { id: 'restaurant', label: 'Dining 🍛' },
                    { id: 'cafe', label: 'Cafés ☕' },
                    { id: 'attraction', label: 'Attractions 🏰' },
                    { id: 'activity', label: 'Activities 🚤' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 touch-manipulation ${
                            filter === tab.id
                                ? 'bg-[#181A20] text-white shadow-xs'
                                : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200/80'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Places List */}
            <div className="space-y-2.5">
                {filtered.map((place) => (
                    <div
                        key={place.id}
                        onClick={() => onSelectPlace?.(place)}
                        className="group bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 shadow-sm hover:shadow-md hover:border-[#F06536]/40 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3"
                    >
                        <div className="flex items-start gap-3 min-w-0">
                            {/* Icon badge */}
                            <div className="w-10 h-10 rounded-2xl bg-stone-100 group-hover:bg-orange-50 text-xl flex items-center justify-center flex-shrink-0 transition-colors">
                                {place.icon}
                            </div>

                            {/* Info */}
                            <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#F06536] transition-colors truncate">
                                        {place.name}
                                    </h4>
                                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600">
                                        {place.category}
                                    </span>
                                </div>

                                <p className="text-[11px] text-stone-500 line-clamp-1">
                                    {place.description}
                                </p>

                                <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-0.5">
                                    <span className="flex items-center gap-1 font-semibold text-[#F06536]">
                                        <MapPin className="w-3 h-3" />
                                        {place.distance}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        {place.rating}
                                    </span>
                                    <span className="hidden xs:inline">•</span>
                                    <span className="text-stone-400 hidden xs:inline">{place.timings}</span>
                                </div>
                            </div>
                        </div>

                        {/* View Action Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectPlace?.(place);
                                }}
                                className="p-2 rounded-xl bg-stone-50 group-hover:bg-[#F06536] text-stone-600 group-hover:text-white transition-all flex items-center gap-1 text-xs font-semibold shadow-xs"
                            >
                                <span className="hidden sm:inline text-xs">View</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

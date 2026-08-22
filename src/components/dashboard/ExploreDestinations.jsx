import React from 'react';
import { Star, MapPin, ArrowRight, Sparkles, Heart } from 'lucide-react';
import manaliImg from '../../assets/odyssey-mountains.jpg';
import goaImg from '../../assets/goa_streets.jpg';
import parisImg from '../../assets/paris_eiffel.jpg';
import berlinImg from '../../assets/berlin_cathedral.jpg';
import auroraImg from '../../assets/aurora_adventure.jpg';

export const DESTINATIONS = [
    {
        id: 'manali',
        name: 'Manali',
        region: 'Himachal Pradesh, India',
        category: 'adventure',
        badge: 'Adventure',
        description: 'Snow-capped peaks, alpine trails & thrilling river valleys.',
        rating: 4.8,
        reviewsCount: 1420,
        image: manaliImg,
        bestTime: 'Oct – Feb',
        vibe: '🏔️ Adventure',
        highlights: ['Solang Valley Skiing', 'Rohtang Pass Trek', 'Old Manali Cafés']
    },
    {
        id: 'goa',
        name: 'Goa',
        region: 'Goa, India',
        category: 'relaxation',
        badge: 'Beaches & Vibe',
        description: 'Golden sunsets, Portuguese Latin quarter & lively beach shacks.',
        rating: 4.9,
        reviewsCount: 2310,
        image: goaImg,
        bestTime: 'Nov – Mar',
        vibe: '🏖️ Relaxation',
        highlights: ['Fontainhas Heritage Walk', 'Baga Watersports', 'Sunset Cruises']
    },
    {
        id: 'paris',
        name: 'Paris',
        region: 'Île-de-France, France',
        category: 'culture',
        badge: 'Iconic Romance',
        description: 'Golden hour at the Eiffel Tower, timeless art & café boulevards.',
        rating: 4.9,
        reviewsCount: 4890,
        image: parisImg,
        bestTime: 'Apr – Oct',
        vibe: '🏛️ Culture',
        highlights: ['Eiffel Tower Sunset', 'Louvre Museum', 'Seine River Cruise']
    },
    {
        id: 'berlin',
        name: 'Berlin',
        region: 'Germany',
        category: 'culture',
        badge: 'Heritage & Art',
        description: 'Cathedral reflections, riverside promenades & cultural landmarks.',
        rating: 4.7,
        reviewsCount: 1820,
        image: berlinImg,
        bestTime: 'May – Sep',
        vibe: '🏛️ Culture',
        highlights: ['Berlin Cathedral', 'Museum Island', 'Spree Promenade']
    },
    {
        id: 'tromso',
        name: 'Tromsø',
        region: 'Norway',
        category: 'nature',
        badge: 'Northern Lights',
        description: 'Celestial aurora borealis skies & untouched arctic wilderness.',
        rating: 5.0,
        reviewsCount: 960,
        image: auroraImg,
        bestTime: 'Sep – Mar',
        vibe: '🌲 Nature',
        highlights: ['Aurora Safari', 'Fjord Excursions', 'Reindeer Sledding']
    }
];

export function ExploreDestinations({
    onSelectDestination,
    selectedCategory = 'all',
    searchQuery = '',
    onToggleFavorite,
    favorites = []
}) {
    const filteredDestinations = DESTINATIONS.filter((d) => {
        const matchesCategory =
            selectedCategory === 'all' ||
            selectedCategory === 'popular' ||
            selectedCategory === 'nearby' ||
            d.category === selectedCategory;

        const matchesSearch =
            !searchQuery ||
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#181A20] tracking-tight">
                        Explore destinations
                    </h2>
                    <p className="text-xs text-stone-500">
                        Places worth adding to your Odyssey.
                    </p>
                </div>
                <span className="text-xs font-semibold text-[#F06536] hidden sm:block">
                    {filteredDestinations.length} available
                </span>
            </div>

            {/* Horizontally Scrollable Cards Container */}
            {filteredDestinations.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center border border-stone-200/80">
                    <p className="text-sm font-semibold text-stone-700">No destinations found</p>
                    <p className="text-xs text-stone-500 mt-1">Try changing your search query or filter.</p>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar touch-pan-x select-none -mx-4 px-4 sm:mx-0 sm:px-0">
                    {filteredDestinations.map((destination) => {
                        const isFav = favorites.includes(destination.id);
                        return (
                            <div
                                key={destination.id}
                                onClick={() => onSelectDestination(destination)}
                                className="group flex-shrink-0 w-[240px] sm:w-[260px] bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                            >
                                {/* Card Image with Badges */}
                                <div className="relative h-44 sm:h-48 overflow-hidden bg-stone-900">
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

                                    {/* Category Pill Tag */}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-stone-900 shadow-sm">
                                            {destination.badge}
                                        </span>
                                    </div>

                                    {/* Favorite Heart Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleFavorite?.(destination.id);
                                        }}
                                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white transition-colors"
                                        aria-label="Save to favorites"
                                    >
                                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                                    </button>

                                    {/* Bottom Title on Image */}
                                    <div className="absolute bottom-3 left-3 right-3 text-white">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold tracking-tight leading-none drop-shadow-sm">
                                                {destination.name}
                                            </h3>
                                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-lg text-amber-300 text-xs font-bold">
                                                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                                                <span>{destination.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] text-white/80 mt-1">
                                            <MapPin className="w-3 h-3 text-[#F06536] flex-shrink-0" />
                                            <span className="truncate">{destination.region}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-3.5 flex flex-col justify-between flex-grow">
                                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-normal">
                                        {destination.description}
                                    </p>

                                    {/* Bottom Explore CTA */}
                                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#F06536] group-hover:text-[#E05325]">
                                        <span>Explore</span>
                                        <div className="w-6 h-6 rounded-full bg-[#F06536]/10 flex items-center justify-center group-hover:bg-[#F06536] group-hover:text-white transition-colors">
                                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

import React from 'react';
import { Star, MapPin, ArrowRight, Sparkles, Heart, Navigation, Plane } from 'lucide-react';
import { getDestinationPhoto } from '../../services/imageService';
import { getDestinationDistance } from '../../services/locationService';

export const DESTINATIONS = [
    // 1. Domestic Destinations (India)
    {
        id: 'goa',
        name: 'Goa',
        region: 'Goa, India',
        category: 'relaxation',
        badge: 'Beaches & Shacks',
        description: 'Golden sunsets, Portuguese Latin quarter, coastal seafood & vibrant beach shacks.',
        rating: 4.9,
        reviewsCount: 3420,
        lat: 15.2993,
        lng: 74.1240,
        image: getDestinationPhoto('goa'),
        bestTime: 'Nov – Mar',
        vibe: '🏖️ Relaxation',
        highlights: ['Fontainhas Heritage Walk', 'Baga Watersports', 'Sunset Cruises']
    },
    {
        id: 'manali',
        name: 'Manali',
        region: 'Himachal Pradesh, India',
        category: 'adventure',
        badge: 'Alpine Adventure',
        description: 'Snow-capped peaks, alpine river trails, pine forests & Solang valley skiing.',
        rating: 4.8,
        reviewsCount: 2890,
        lat: 32.2432,
        lng: 77.1892,
        image: getDestinationPhoto('manali'),
        bestTime: 'Oct – Feb',
        vibe: '🏔️ Adventure',
        highlights: ['Solang Valley Skiing', 'Rohtang Pass Trek', 'Old Manali Cafés']
    },
    {
        id: 'jaipur',
        name: 'Jaipur',
        region: 'Rajasthan, India',
        category: 'culture',
        badge: 'Palaces & Forts',
        description: 'Royal courtyards, Amber Fort elephant trails, pink terracotta facades & artisan bazaars.',
        rating: 4.8,
        reviewsCount: 3100,
        lat: 26.9124,
        lng: 75.7873,
        image: getDestinationPhoto('jaipur'),
        bestTime: 'Oct – Mar',
        vibe: '🏛️ Culture',
        highlights: ['Amber Fort Panorama', 'Hawa Mahal Sunrise', 'Nahargarh Sunset']
    },
    {
        id: 'varanasi',
        name: 'Varanasi',
        region: 'Uttar Pradesh, India',
        category: 'culture',
        badge: 'Spiritual Ghats',
        description: 'Ancient river ghats, mesmerizing Ganga Aarti, morning rowing & silk weaving alleys.',
        rating: 4.9,
        reviewsCount: 2750,
        lat: 25.3176,
        lng: 82.9739,
        image: getDestinationPhoto('varanasi'),
        bestTime: 'Oct – Mar',
        vibe: '🕉️ Spiritual',
        highlights: ['Ganga Aarti at Dashashwamedh', 'Morning Boat Ride', 'Sarnath Buddhist Stupa']
    },
    {
        id: 'ladakh',
        name: 'Ladakh & Pangong Tso',
        region: 'Ladakh, India',
        category: 'adventure',
        badge: 'High Altitudes',
        description: 'Azure glacial lakes, high-mountain passes, lunar landscapes & ancient gompas.',
        rating: 5.0,
        reviewsCount: 2150,
        lat: 34.1526,
        lng: 77.5771,
        image: getDestinationPhoto('ladakh'),
        bestTime: 'May – Sep',
        vibe: '🏔️ High Adventure',
        highlights: ['Pangong Lake Camping', 'Khardung La Pass', 'Nubra Sand Dunes']
    },
    {
        id: 'kerala',
        name: 'Munnar & Alleppey',
        region: 'Kerala, India',
        category: 'nature',
        badge: 'Lush Backwaters',
        description: 'Tranquil palm-fringed lagoons, private houseboats, spice hills & rolling tea estates.',
        rating: 4.9,
        reviewsCount: 3620,
        lat: 9.9312,
        lng: 76.2673,
        image: getDestinationPhoto('kerala'),
        bestTime: 'Sep – Mar',
        vibe: '🌲 Nature & Serenity',
        highlights: ['Alleppey Houseboat Cruise', 'Munnar Tea Gardens', 'Kathakali Performance']
    },
    {
        id: 'udaipur',
        name: 'Udaipur',
        region: 'Rajasthan, India',
        category: 'culture',
        badge: 'City of Lakes',
        description: 'Marble palaces on shimmering lakes, romantic sunset boat rides & royal Rajput suites.',
        rating: 4.9,
        reviewsCount: 2980,
        lat: 24.5854,
        lng: 73.7125,
        image: getDestinationPhoto('udaipur'),
        bestTime: 'Oct – Mar',
        vibe: '🏛️ Romance & Heritage',
        highlights: ['City Palace Museum', 'Lake Pichola Boat Cruise', 'Jag Mandir Sunset']
    },
    {
        id: 'rishikesh',
        name: 'Rishikesh & Ganga',
        region: 'Uttarakhand, India',
        category: 'adventure',
        badge: 'Yoga & River Rafting',
        description: 'White-water rapids, cliff jumping, Himalayan foothills yoga retreats & riverside aartis.',
        rating: 4.8,
        reviewsCount: 2400,
        lat: 30.0869,
        lng: 78.2676,
        image: getDestinationPhoto('rishikesh'),
        bestTime: 'Sep – Apr',
        vibe: '🌊 Adventure & Zen',
        highlights: ['Ganges River Rafting', 'Triveni Ghat Evening Aarti', 'Beatles Ashram']
    },
    {
        id: 'ooty',
        name: 'Ooty & Nilgiri Hills',
        region: 'Tamil Nadu, India',
        category: 'nature',
        badge: 'Tea Hills & Toy Train',
        description: 'UNESCO toy train rides, emerald tea slopes, eucalyptus mist & botanical sanctuaries.',
        rating: 4.7,
        reviewsCount: 1980,
        lat: 11.4102,
        lng: 76.6950,
        image: getDestinationPhoto('ooty'),
        bestTime: 'Oct – May',
        vibe: '🌲 Nature',
        highlights: ['Nilgiri Mountain Railway', 'Doddabetta Peak View', 'Pykara Waterfalls']
    },
    {
        id: 'agra',
        name: 'Agra & Taj Mahal',
        region: 'Uttar Pradesh, India',
        category: 'culture',
        badge: 'World Wonder',
        description: 'The monumental ivory-white marble Taj Mahal, Agra Fort & Mughal garden walkways.',
        rating: 4.9,
        reviewsCount: 5600,
        lat: 27.1767,
        lng: 78.0081,
        image: getDestinationPhoto('agra'),
        bestTime: 'Oct – Mar',
        vibe: '🏛️ World Heritage',
        highlights: ['Taj Mahal Sunrise', 'Agra Fort Red Sandstone', 'Mehtab Bagh Reflection View']
    },

    // 2. Global Icons
    {
        id: 'paris',
        name: 'Paris',
        region: 'Île-de-France, France',
        category: 'culture',
        badge: 'Iconic Romance',
        description: 'Golden hour at the Eiffel Tower, timeless Louvre masterpieces, Seine cruises & cafe boulevards.',
        rating: 4.9,
        reviewsCount: 6890,
        lat: 48.8566,
        lng: 2.3522,
        image: getDestinationPhoto('paris'),
        bestTime: 'Apr – Oct',
        vibe: '🏛️ Culture & Romance',
        highlights: ['Eiffel Tower Sunset', 'Louvre Museum Glass Pyramid', 'Seine River Cruise']
    },
    {
        id: 'tokyo',
        name: 'Tokyo',
        region: 'Kanto, Japan',
        category: 'culture',
        badge: 'Futuristic & Shrines',
        description: 'Neon skyscrapers, ancient Senso-ji shrine, Michelin ramen bars & bullet trains.',
        rating: 4.9,
        reviewsCount: 5420,
        lat: 35.6762,
        lng: 139.6503,
        image: getDestinationPhoto('tokyo'),
        bestTime: 'Mar – May & Sep – Nov',
        vibe: '⚡ Cyberpunk & Heritage',
        highlights: ['Shibuya Crossing Panorama', 'Senso-ji Temple', 'TeamLab Planets Exhibition']
    },
    {
        id: 'bali',
        name: 'Bali',
        region: 'Bali, Indonesia',
        category: 'relaxation',
        badge: 'Island Tropical',
        description: 'Lush terraced rice fields, sacred sea temples, surf breaks & cliffside infinity beach clubs.',
        rating: 4.9,
        reviewsCount: 5200,
        lat: -8.3405,
        lng: 115.0920,
        image: getDestinationPhoto('bali'),
        bestTime: 'Apr – Oct',
        vibe: '🌴 Island Tropical',
        highlights: ['Uluwatu Sunset Temple', 'Tegalalang Rice Terraces', 'Nusa Penida Kelingking']
    },
    {
        id: 'rome',
        name: 'Rome',
        region: 'Lazio, Italy',
        category: 'culture',
        badge: 'Ancient Eternal City',
        description: 'The monumental Colosseum, Vatican museums, Pantheon dome & handmade truffle pasta.',
        rating: 4.8,
        reviewsCount: 4780,
        lat: 41.9028,
        lng: 12.4964,
        image: getDestinationPhoto('rome'),
        bestTime: 'Apr – Jun & Sep – Oct',
        vibe: '🏛️ Ancient History',
        highlights: ['Colosseum Arena Tour', 'Trevi Fountain Coin Toss', 'Vatican Sistine Chapel']
    },
    {
        id: 'dubai',
        name: 'Dubai',
        region: 'Dubai, UAE',
        category: 'adventure',
        badge: 'Futuristic Luxury',
        description: 'Burj Khalifa observation decks, golden desert dune safaris, marina yachts & luxury malls.',
        rating: 4.8,
        reviewsCount: 4300,
        lat: 25.2048,
        lng: 55.2708,
        image: getDestinationPhoto('dubai'),
        bestTime: 'Nov – Mar',
        vibe: '✨ Luxury & Desert',
        highlights: ['Burj Khalifa Level 148', 'Red Dune Desert Safari', 'Dubai Marina Sunset Yacht']
    },
    {
        id: 'santorini',
        name: 'Santorini',
        region: 'Cyclades, Greece',
        category: 'relaxation',
        badge: 'Aegean Romance',
        description: 'Cobalt blue domes, whitewashed cliff villages, Aegean sunset catamaran sails & volcanic wines.',
        rating: 4.9,
        reviewsCount: 3890,
        lat: 36.3932,
        lng: 25.4615,
        image: getDestinationPhoto('santorini'),
        bestTime: 'May – Oct',
        vibe: '🌅 Romance & Views',
        highlights: ['Oia Sunset Walk', 'Red Beach Catamaran Tour', 'Akrotiri Prehistoric Ruins']
    },
    {
        id: 'interlaken',
        name: 'Swiss Alps & Interlaken',
        region: 'Bernese Alps, Switzerland',
        category: 'adventure',
        badge: 'Alpine Glaciers',
        description: 'Snow-capped peaks, Jungfraujoch Top of Europe railway, glacier ice caves & paragliding.',
        rating: 5.0,
        reviewsCount: 3450,
        lat: 46.6863,
        lng: 7.8632,
        image: getDestinationPhoto('swiss_alps'),
        bestTime: 'Jun – Sep & Dec – Mar',
        vibe: '🏔️ High Alpine',
        highlights: ['Jungfraujoch Glacier Train', 'Interlaken Tandem Paragliding', 'Lake Brienz Steamboat']
    },
    {
        id: 'tromso',
        name: 'Tromsø & Lofoten',
        region: 'Troms, Norway',
        category: 'nature',
        badge: 'Northern Lights',
        description: 'Celestial aurora borealis skies, Arctic fjord kayaking, reindeer safaris & midnight sun.',
        rating: 5.0,
        reviewsCount: 1890,
        lat: 69.6492,
        lng: 18.9553,
        image: getDestinationPhoto('tromso'),
        bestTime: 'Sep – Mar (Aurora) & Jun – Aug',
        vibe: '🌲 Arctic Wilderness',
        highlights: ['Aurora Borealis Safari', 'Fjord Whale Watching', 'Dog Sledding across Snowfields']
    },
    {
        id: 'kyoto',
        name: 'Kyoto',
        region: 'Kansai, Japan',
        category: 'culture',
        badge: 'Zen Temples',
        description: 'Thousands of vermilion torii gates at Fushimi Inari, Arashiyama bamboo forest & geisha alleys.',
        rating: 4.9,
        reviewsCount: 3900,
        lat: 35.0116,
        lng: 135.7681,
        image: getDestinationPhoto('kyoto'),
        bestTime: 'Mar – May (Cherry Blossom) & Oct – Nov',
        vibe: '🏛️ Zen Culture',
        highlights: ['Fushimi Inari Torii Shrines', 'Arashiyama Bamboo Forest', 'Kinkaku-ji Golden Pavilion']
    },
    {
        id: 'amalfi',
        name: 'Amalfi Coast & Positano',
        region: 'Campania, Italy',
        category: 'relaxation',
        badge: 'Cliffside Coast',
        description: 'Pastel cliffside villas overlooking the Mediterranean, lemon groves & private coastal boats.',
        rating: 4.9,
        reviewsCount: 3200,
        lat: 40.6340,
        lng: 14.6027,
        image: getDestinationPhoto('amalfi'),
        bestTime: 'May – Sep',
        vibe: '🏖️ Scenic Coastal',
        highlights: ['Path of the Gods Cliff Hike', 'Positano Beach Club', 'Capri Blue Grotto Excursion']
    },
    {
        id: 'new_york',
        name: 'New York City',
        region: 'New York, USA',
        category: 'culture',
        badge: 'Metropolitan Energy',
        description: 'Iconic Manhattan skyline, Central Park walks, Broadway theatres & diverse foodie boroughs.',
        rating: 4.8,
        reviewsCount: 6100,
        lat: 40.7128,
        lng: -74.0060,
        image: getDestinationPhoto('new_york'),
        bestTime: 'Sep – Nov & Apr – Jun',
        vibe: '🏙️ Urban Adventure',
        highlights: ['Summit One Vanderbilt Glass Floor', 'Central Park Rowboats', 'Broadway Theatre Show']
    },
    {
        id: 'cairo',
        name: 'Cairo & Giza',
        region: 'Egypt',
        category: 'culture',
        badge: 'Ancient Pyramids',
        description: 'The monumental Great Pyramids of Giza, the Great Sphinx, Nile felucca boats & Khan el-Khalili.',
        rating: 4.8,
        reviewsCount: 2980,
        lat: 30.0444,
        lng: 31.2357,
        image: getDestinationPhoto('cairo'),
        bestTime: 'Oct – Apr',
        vibe: '🏛️ Ancient Wonders',
        highlights: ['Great Pyramid of Giza', 'Sphinx Exploration', 'Sunset Nile Felucca Sailing']
    },
    {
        id: 'barcelona',
        name: 'Barcelona',
        region: 'Catalonia, Spain',
        category: 'culture',
        badge: 'Gaudí Architecture',
        description: 'Sagrada Família spires, Park Güell mosaics, Mediterranean beaches & vibrant tapas bars.',
        rating: 4.8,
        reviewsCount: 4200,
        lat: 41.3879,
        lng: 2.1699,
        image: getDestinationPhoto('barcelona'),
        bestTime: 'May – Jun & Sep – Oct',
        vibe: '🏛️ Art & Coastal',
        highlights: ['Sagrada Família Tower Tour', 'Park Güell Panorama', 'Barceloneta Tapas Tour']
    },
    {
        id: 'sydney',
        name: 'Sydney',
        region: 'NSW, Australia',
        category: 'nature',
        badge: 'Harbor & Surfing',
        description: 'The architectural Sydney Opera House, Harbor Bridge climb, Bondi beach coastal walks & bays.',
        rating: 4.9,
        reviewsCount: 3600,
        lat: -33.8688,
        lng: 151.2093,
        image: getDestinationPhoto('sydney'),
        bestTime: 'Sep – Nov & Mar – May',
        vibe: '🌊 Coastal & Nature',
        highlights: ['Sydney Opera House Tour', 'Bondi to Coogee Coastal Walk', 'Harbor Bridge Climb']
    },
    {
        id: 'singapore',
        name: 'Singapore',
        region: 'Singapore',
        category: 'nature',
        badge: 'Garden City',
        description: 'Supertree Grove light shows, futuristic biodomes at Gardens by the Bay & vibrant hawker centers.',
        rating: 4.9,
        reviewsCount: 4900,
        lat: 1.3521,
        lng: 103.8198,
        image: getDestinationPhoto('singapore'),
        bestTime: 'Nov – Jan & Jun – Aug',
        vibe: '🌲 Futuristic & Green',
        highlights: ['Gardens by the Bay Supertrees', 'Marina Bay Sands Infinity Pool', 'Changi Jewel Waterfall']
    },
    {
        id: 'reykjavik',
        name: 'Reykjavik & Golden Circle',
        region: 'Iceland',
        category: 'nature',
        badge: 'Glaciers & Geysers',
        description: 'Geothermal Blue Lagoon springs, Gullfoss waterfall, black sand beaches & volcanic craters.',
        rating: 5.0,
        reviewsCount: 2300,
        lat: 64.1466,
        lng: -21.9426,
        image: getDestinationPhoto('reykjavik'),
        bestTime: 'Jun – Aug (Greenery) & Oct – Mar (Ice Caves)',
        vibe: '🌋 Geothermal Wonders',
        highlights: ['Blue Lagoon Geothermal Spa', 'Gullfoss Waterfall', 'Thingvellir Tectonic Rift']
    },
    {
        id: 'phuket',
        name: 'Phuket & Phi Phi Islands',
        region: 'Thailand',
        category: 'relaxation',
        badge: 'Emerald Lagoons',
        description: 'Limestone karsts rising from turquoise seas, longtail boat tours, night markets & viewpoints.',
        rating: 4.8,
        reviewsCount: 4150,
        lat: 7.8804,
        lng: 98.3923,
        image: getDestinationPhoto('phuket'),
        bestTime: 'Nov – Apr',
        vibe: '🏖️ Island Relaxation',
        highlights: ['Maya Bay & Phi Phi Speedboat', 'Big Buddha Viewpoint', 'Old Phuket Town Night Market']
    },
    {
        id: 'berlin',
        name: 'Berlin',
        region: 'Germany',
        category: 'culture',
        badge: 'Heritage & Art',
        description: 'Berlin Cathedral reflections, Museum Island treasures, Brandenburg Gate & riverside cafes.',
        rating: 4.7,
        reviewsCount: 2890,
        lat: 52.5200,
        lng: 13.4050,
        image: getDestinationPhoto('berlin'),
        bestTime: 'May – Sep',
        vibe: '🏛️ Culture',
        highlights: ['Berlin Cathedral', 'Museum Island', 'East Side Gallery']
    }
];

export function ExploreDestinations({
    currentLocation = 'Hyderabad, India',
    currentCoords = null,
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
            d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.vibe && d.vibe.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    return (
        <section className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Explore Destinations
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        Hand-picked destinations for your next journey across India and the world.
                    </p>
                </div>
                <span className="text-xs font-bold text-[#F06536] bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200/60 dark:border-orange-900/60">
                    {filteredDestinations.length} destinations
                </span>
            </div>

            {/* Responsive Destination Cards Grid */}
            {filteredDestinations.length === 0 ? (
                <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No destinations found matching your filters.</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try resetting your search query or selecting "All Places".</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredDestinations.map((destination) => {
                        const isFav = favorites.includes(destination.id);
                        const distInfo = getDestinationDistance(
                            currentLocation,
                            currentCoords,
                            destination.name,
                            { lat: destination.lat, lng: destination.lng }
                        );

                        return (
                            <div
                                key={destination.id}
                                onClick={() => onSelectDestination(destination)}
                                className="group bg-white dark:bg-[#131B2E] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                            >
                                {/* Card Image with Badges */}
                                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                                    {/* Top Badges */}
                                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
                                            {destination.badge || destination.vibe}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleFavorite?.(destination.id);
                                            }}
                                            className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${
                                                isFav
                                                    ? 'bg-rose-500 text-white'
                                                    : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
                                            }`}
                                            aria-label="Save destination"
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                                        </button>
                                    </div>

                                    {/* Bottom Title & Accurate Distance on Image */}
                                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                                        <div className="space-y-0.5">
                                            <h3 className="text-lg font-bold tracking-tight drop-shadow-md">
                                                {destination.name}
                                            </h3>
                                            <p className="text-xs text-white/80 flex items-center gap-1 drop-shadow-sm">
                                                <MapPin className="w-3 h-3 text-[#F06536]" />
                                                <span>{destination.region}</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1 text-amber-300 text-xs font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                                                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                                <span>{destination.rating}</span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F06536]/90 text-white shadow-xs">
                                                {distInfo.text}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                        {destination.description}
                                    </p>

                                    {/* Highlights Pills */}
                                    {destination.highlights && (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {destination.highlights.slice(0, 2).map((hl, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                                >
                                                    ✨ {hl}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action Bar */}
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                            {distInfo.travelEstimate ? (
                                                <span>✈️ <strong className="text-slate-700 dark:text-slate-300 font-semibold">{distInfo.travelEstimate}</strong></span>
                                            ) : (
                                                <span>Best: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{destination.bestTime}</strong></span>
                                            )}
                                        </span>
                                        <span className="text-xs font-bold text-[#F06536] group-hover:text-[#E05325] flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                                            <span>View Guide</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
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

import React, { useState, useEffect, useRef } from 'react';
import { Star, MapPin, ArrowRight, Sparkles, Heart, Plane, Globe, ExternalLink, Search, Loader2 } from 'lucide-react';
import { getDestinationPhoto } from '../../services/imageService';
import { getDestinationDistance } from '../../services/locationService';
import { searchDynamicDestinations, getGoogleSearchUrls } from '../../services/dynamicDestinationService';

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
        id: 'kashmir',
        name: 'Srinagar & Gulmarg',
        region: 'Jammu & Kashmir, India',
        category: 'adventure',
        badge: 'Paradise on Earth',
        description: 'Dal Lake shikara houseboats, snow-clad Gulmarg gondolas, Mughal gardens & saffron valleys.',
        rating: 5.0,
        reviewsCount: 3890,
        lat: 34.0837,
        lng: 74.7973,
        image: getDestinationPhoto('kashmir'),
        bestTime: 'Apr – Oct (Greenery) & Dec – Feb (Snow)',
        vibe: '🏔️ Alpine & Lakes',
        highlights: ['Dal Lake Shikara Ride', 'Gulmarg Gondola Phase 2', 'Pahalgam Betaab Valley']
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
        id: 'coorg',
        name: 'Coorg & Madikeri',
        region: 'Karnataka, India',
        category: 'nature',
        badge: 'Scotland of India',
        description: 'Aromatic coffee plantations, misty hillside trails, Abbey waterfalls & Tibetan Golden Temple.',
        rating: 4.8,
        reviewsCount: 2240,
        lat: 12.3375,
        lng: 75.8069,
        image: getDestinationPhoto('coorg'),
        bestTime: 'Oct – Apr',
        vibe: '🌲 Misty Hills & Coffee',
        highlights: ['Abbey Falls Trek', 'Coffee Plantation Walk', 'Bylakuppe Tibetan Monastery']
    },
    {
        id: 'hampi',
        name: 'Hampi',
        region: 'Karnataka, India',
        category: 'culture',
        badge: 'UNESCO Boulder Ruins',
        description: 'Surreal granite boulder landscapes, Virupaksha temple, Tungabhadra coracle rides & Vijayanagara ruins.',
        rating: 4.9,
        reviewsCount: 2600,
        lat: 15.3350,
        lng: 76.4600,
        image: getDestinationPhoto('hampi'),
        bestTime: 'Oct – Mar',
        vibe: '🏛️ Ancient Boulders',
        highlights: ['Stone Chariot at Vittala', 'Coracle Boat Ride on Tungabhadra', 'Matanga Hill Sunrise']
    },
    {
        id: 'pondicherry',
        name: 'Pondicherry',
        region: 'Puducherry, India',
        category: 'relaxation',
        badge: 'French Riviera Alleys',
        description: 'Pastel French colonial villas, Promenade beach walks, seaside bakeries & Auroville meditation dome.',
        rating: 4.8,
        reviewsCount: 2950,
        lat: 11.9416,
        lng: 79.8083,
        image: getDestinationPhoto('pondicherry'),
        bestTime: 'Oct – Mar',
        vibe: '🏖️ French Bohemian',
        highlights: ['White Town Heritage Cycling', 'Promenade Beach Walk', 'Auroville Matrimandir']
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
        id: 'darjeeling',
        name: 'Darjeeling',
        region: 'West Bengal, India',
        category: 'nature',
        badge: 'Queen of the Hills',
        description: 'Tiger Hill sunrise over Mt. Kanchenjunga, heritage tea estates, Himalayan mountaineering & toy train.',
        rating: 4.8,
        reviewsCount: 2310,
        lat: 27.0410,
        lng: 88.2663,
        image: getDestinationPhoto('darjeeling'),
        bestTime: 'Mar – May & Oct – Dec',
        vibe: '🌲 Mountain Mist',
        highlights: ['Tiger Hill Kanchenjunga Sunrise', 'Happy Valley Tea Estate', 'Darjeeling Himalayan Railway']
    },
    {
        id: 'amritsar',
        name: 'Amritsar & Golden Temple',
        region: 'Punjab, India',
        category: 'culture',
        badge: 'Golden Sanctuary',
        description: 'The shimmering Golden Temple, community langar kitchen, Wagah border ceremony & rich Punjabi food.',
        rating: 4.9,
        reviewsCount: 3800,
        lat: 31.6340,
        lng: 74.8723,
        image: getDestinationPhoto('amritsar'),
        bestTime: 'Oct – Mar',
        vibe: '🕉️ Spiritual & Culinary',
        highlights: ['Golden Temple Night View', 'Wagah Border Beating Retreat', 'Amritsari Kulcha Trail']
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
        id: 'maldives',
        name: 'Maldives',
        region: 'Maldives, Indian Ocean',
        category: 'relaxation',
        badge: 'Overwater Bungalows',
        description: 'Crystal turquoise atolls, pristine coral reefs, private overwater villas & bioluminescent beaches.',
        rating: 5.0,
        reviewsCount: 4620,
        lat: 3.2028,
        lng: 73.2207,
        image: getDestinationPhoto('maldives'),
        bestTime: 'Nov – Apr',
        vibe: '🏖️ Tropical Luxury',
        highlights: ['Overwater Villa Stay', 'Manta Ray & Turtle Snorkeling', 'Sunset Dolphin Cruise']
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
    const [destinationsList, setDestinationsList] = useState(DESTINATIONS);
    const [isSearchingLive, setIsSearchingLive] = useState(false);
    const debounceTimerRef = useRef(null);

    // Dynamic Search Effect
    useEffect(() => {
        const query = (searchQuery || '').trim();

        // 1. Instant local filter
        const instantFiltered = DESTINATIONS.filter((d) => {
            const matchesCategory =
                selectedCategory === 'all' ||
                selectedCategory === 'popular' ||
                selectedCategory === 'nearby' ||
                d.category === selectedCategory;

            if (!query) return matchesCategory;

            const matchesSearch =
                d.name.toLowerCase().includes(query.toLowerCase()) ||
                d.region.toLowerCase().includes(query.toLowerCase()) ||
                d.description.toLowerCase().includes(query.toLowerCase()) ||
                (d.vibe && d.vibe.toLowerCase().includes(query.toLowerCase())) ||
                (d.badge && d.badge.toLowerCase().includes(query.toLowerCase()));

            return matchesCategory && matchesSearch;
        });

        setDestinationsList(instantFiltered);

        if (!query) {
            setIsSearchingLive(false);
            return;
        }

        // 2. Debounced Live Dynamic Discovery (Wikipedia, Geocoding & Dynamic Synthesizer)
        setIsSearchingLive(true);
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

        debounceTimerRef.current = setTimeout(async () => {
            try {
                const liveResults = await searchDynamicDestinations(query, DESTINATIONS, selectedCategory);
                if (liveResults && liveResults.length > 0) {
                    setDestinationsList(liveResults);
                }
            } catch (err) {
                console.warn('Live dynamic search fallback', err);
            } finally {
                setIsSearchingLive(false);
            }
        }, 320);

        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, [searchQuery, selectedCategory]);

    const googleUrls = getGoogleSearchUrls(searchQuery);

    return (
        <section className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Explore Destinations
                        </h2>
                        {isSearchingLive && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#F06536] bg-orange-50 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-900/60 animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Searching live...</span>
                            </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        Hand-picked and live dynamic destinations across India and the globe.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {searchQuery && (
                        <a
                            href={googleUrls.search}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#182238] hover:bg-slate-100 dark:hover:bg-[#202d4a] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-[#F06536]/40 transition-all"
                            title={`Search "${searchQuery}" on Google`}
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            <span>Search on Google</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                    )}
                    <span className="text-xs font-bold text-[#F06536] bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200/60 dark:border-orange-900/60">
                        {destinationsList.length} destinations
                    </span>
                </div>
            </div>

            {/* Dynamic Google Search & Travel Intelligence Card (Always available when search query is active) */}
            {searchQuery && (
                <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-orange-50/60 dark:from-[#11192e] dark:via-[#141f38] dark:to-[#1a1c2d] rounded-2xl p-4 border border-blue-200/60 dark:border-blue-900/40 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#182238] shadow-xs flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <span>Google Search & Live Travel Hub</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                                        Live Web Links
                                    </span>
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                    Search Google's real-time web, flight routes, hotels & maps for <strong className="text-slate-800 dark:text-slate-200">"{searchQuery}"</strong>
                                </p>
                            </div>
                        </div>

                        {/* Interactive Google Action Buttons */}
                        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
                            <a
                                href={googleUrls.search}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <span>Google Web</span>
                                <ExternalLink className="w-3 h-3 text-white/70" />
                            </a>
                            <a
                                href={googleUrls.maps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-[#28364e] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                            >
                                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Maps</span>
                            </a>
                            <a
                                href={googleUrls.travel}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-[#28364e] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                            >
                                <Plane className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Travel</span>
                            </a>
                            <a
                                href={googleUrls.hotels}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-[#28364e] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                            >
                                <Globe className="w-3.5 h-3.5 text-amber-500" />
                                <span>Hotels</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Responsive Destination Cards Grid */}
            {destinationsList.length === 0 ? (
                <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {isSearchingLive ? 'Scanning live destination records...' : `Searching Google for "${searchQuery}"`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Odyssey is querying global map records and live travel engines. You can also explore instantly on Google Web:
                    </p>
                    <div className="pt-2">
                        <a
                            href={googleUrls.search}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F06536] hover:bg-[#E05325] text-white font-bold text-xs shadow-md transition-all active:scale-95"
                        >
                            <span>Search "{searchQuery}" on Google</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {destinationsList.map((destination) => {
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
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
                                                {destination.badge || destination.vibe}
                                            </span>
                                            {destination.isDynamic && (
                                                <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-blue-500/85 backdrop-blur-md text-white border border-blue-300/30 flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5" />
                                                    <span>Live Discovery</span>
                                                </span>
                                            )}
                                        </div>
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
                                        <div className="space-y-0.5 pr-2">
                                            <h3 className="text-lg font-bold tracking-tight drop-shadow-md truncate">
                                                {destination.name}
                                            </h3>
                                            <p className="text-xs text-white/80 flex items-center gap-1 drop-shadow-sm truncate">
                                                <MapPin className="w-3 h-3 text-[#F06536] shrink-0" />
                                                <span className="truncate">{destination.region}</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
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

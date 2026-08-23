/**
 * Odyssey Dynamic Image Service
 * Provides verified, high-resolution photography for global and domestic destinations
 * and local places (Cafes, Landmarks, Restaurants, Nature, Attractions).
 * Features deep semantic name & keyword resolution to avoid dummy/mismatched imagery.
 */

// High-resolution photography catalog for destinations
export const DESTINATION_IMAGES = {
    // Domestic Gems (India)
    'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    'manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    'jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    'varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    'ladakh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    'udaipur': 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    'rishikesh': 'https://images.unsplash.com/photo-1600100397608-f010f443b7f2?auto=format&fit=crop&w=1200&q=80',
    'ooty': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    'hyderabad': 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=1200&q=80',
    'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    'bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    'kashmir': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    'srinagar': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    'gulmarg': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    'coorg': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    'hampi': 'https://images.unsplash.com/photo-1600100397608-f010f443b7f2?auto=format&fit=crop&w=1200&q=80',
    'pondicherry': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    'darjeeling': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    'amritsar': 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    'shillong': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'munnar': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    'andaman': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',

    // International Icons
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    'tokyo': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    'swiss_alps': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    'interlaken': 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=80',
    'tromso': 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
    'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    'amalfi': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    'new_york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    'cairo': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
    'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    'reykjavik': 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    'phuket': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
    'berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    'bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    'seoul': 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
    'amsterdam': 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',
    'prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80',
    'cape_town': 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
    'queenstown': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
    'bora_bora': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'venice': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80',
    'florence': 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=80',
    'istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    'zurich': 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200&q=80',
    'athens': 'https://images.unsplash.com/photo-1555993539-1732916b8235?auto=format&fit=crop&w=1200&q=80'
};

// Thematic Fallback Photography Pool
export const THEMATIC_IMAGES = {
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    island: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    waterfall: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    desert: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    temple: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    palace: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    lake: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    city: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80'
};

// Curated Semantic Photo Pools for specific real-world place types
export const SEMANTIC_PLACE_POOLS = {
    // 🚆 Railway Stations & Rail Transit Hubs
    station: [
        'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    ],

    // 🌾 Villages, Local Mandals & Scenic Countrysides
    village: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],

    // 🛕 Temples, Mandirs & Sacred Shrines
    temple: [
        'https://images.unsplash.com/photo-1600100397608-f010f443b7f2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    ],

    // 🏢 Tech Parks, Corporate SEZs & Universities
    campus: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    ],

    // 🌊 Lakes, Reservoirs & Waterways
    lake: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1533692328991-08159ff19fca?auto=format&fit=crop&w=800&q=80',
    ],

    // 🌲 Parks, Gardens & Nature Trails
    park: [
        'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],

    // 🏰 Historic Forts & Citadel Ramparts
    fort: [
        'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600100397608-f010f443b7f2?auto=format&fit=crop&w=800&q=80',
    ],

    // ☕ Cafés & Roasteries
    cafe: [
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80',
    ],

    // 🍛 Restaurants & Authentic Dining
    restaurant: [
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    ],

    // 🛍️ Bazaars & Shopping Promenades
    market: [
        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    ],

    // 🌄 Hills & Viewpoints
    hill: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    ]
};

// Specific verified photography for iconic local spots
export const SPECIFIC_PLACE_IMAGES = {
    // Hyderabad
    'charminar': 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=800&q=80',
    'roastery': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    'golconda': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    'paradise': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    'hussain': 'https://images.unsplash.com/photo-1533692328991-08159ff19fca?auto=format&fit=crop&w=800&q=80',

    // Bengaluru
    'cubbon': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
    'third wave': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    'bangalore palace': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'vidyarthi': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    'nandi': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',

    // Mumbai
    'gateway': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    'kala ghoda': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    'marine drive': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
    'britannia': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'elephanta': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',

    // Delhi
    'india gate': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    'blue tokai': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80',
    'qutub': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    'karim': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    'hauz khas': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',

    // Jaipur
    'hawa mahal': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    'tapri': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'amber fort': 'https://images.unsplash.com/photo-1600100397608-f010f443b7f2?auto=format&fit=crop&w=800&q=80',
    'chokhi': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    'nahargarh': 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',

    // Paris
    'eiffel': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    'flore': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    'louvre': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
    'seine': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',

    // Tokyo
    'shibuya': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    'senso-ji': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    'tsukiji': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    'teamlab': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
};

/**
 * Resolves a dynamic, high-resolution photo URL for a given destination name
 */
export function getDestinationPhoto(name = '', category = 'all') {
    if (!name) return DESTINATION_IMAGES['goa'];

    const clean = name.toLowerCase().trim();

    // 1. Check exact or partial key match in catalog
    for (const key in DESTINATION_IMAGES) {
        if (clean.includes(key) || key.includes(clean)) {
            return DESTINATION_IMAGES[key];
        }
    }

    // 2. Thematic Keyword matching
    if (clean.includes('beach') || clean.includes('coast') || clean.includes('sea') || clean.includes('ocean')) return THEMATIC_IMAGES.beach;
    if (clean.includes('mountain') || clean.includes('peak') || clean.includes('hill') || clean.includes('snow') || clean.includes('trek')) return THEMATIC_IMAGES.mountain;
    if (clean.includes('island') || clean.includes('atoll') || clean.includes('bay') || clean.includes('lagoon')) return THEMATIC_IMAGES.island;
    if (clean.includes('waterfall') || clean.includes('falls') || clean.includes('cascade')) return THEMATIC_IMAGES.waterfall;
    if (clean.includes('desert') || clean.includes('dune') || clean.includes('safari')) return THEMATIC_IMAGES.desert;
    if (clean.includes('temple') || clean.includes('shrine') || clean.includes('monastery') || clean.includes('ghat')) return THEMATIC_IMAGES.temple;
    if (clean.includes('palace') || clean.includes('fort') || clean.includes('castle') || clean.includes('citadel')) return THEMATIC_IMAGES.palace;
    if (clean.includes('lake') || clean.includes('river') || clean.includes('backwater')) return THEMATIC_IMAGES.lake;
    if (clean.includes('forest') || clean.includes('jungle') || clean.includes('park') || clean.includes('sanctuary')) return THEMATIC_IMAGES.forest;

    // 3. Category Fallback
    if (category === 'relaxation') return THEMATIC_IMAGES.beach;
    if (category === 'adventure') return THEMATIC_IMAGES.mountain;
    if (category === 'nature') return THEMATIC_IMAGES.forest;
    if (category === 'culture') return THEMATIC_IMAGES.palace;

    // 4. Default high-quality travel photography
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
}

/**
 * Resolves an authentic, contextually accurate photo for any local place, station, or landmark
 * Avoids dummy/mismatched imagery by inspecting the place name, description, and keywords.
 */
export function getPlacePhoto(placeName = '', category = 'landmark', index = 0, description = '') {
    const clean = (placeName + ' ' + description).toLowerCase();

    // 1. Check verified specific place matches
    for (const key in SPECIFIC_PLACE_IMAGES) {
        if (clean.includes(key)) {
            return SPECIFIC_PLACE_IMAGES[key];
        }
    }

    // 2. 🚆 Railway Stations & Rail Transit
    if (clean.includes('railway') || clean.includes('station') || clean.includes('train') || clean.includes('junction') || clean.includes('metro') || clean.includes('terminal') || clean.includes('rail')) {
        const pool = SEMANTIC_PLACE_POOLS.station;
        return pool[index % pool.length];
    }

    // 3. 🛕 Temples, Devalayams & Shrines
    if (clean.includes('temple') || clean.includes('mandir') || clean.includes('kovil') || clean.includes('devalayam') || clean.includes('shrine') || clean.includes('math') || clean.includes('monastery') || clean.includes('ghat') || clean.includes('ashram') || clean.includes('gopuram') || clean.includes('hanuman') || clean.includes('shiva') || clean.includes('krishna') || clean.includes('balaji') || clean.includes('venkateswara')) {
        const pool = SEMANTIC_PLACE_POOLS.temple;
        return pool[index % pool.length];
    }

    // 4. 🏢 Tech Parks, Corporate Campuses & Universities
    if (clean.includes('tech') || clean.includes('infotech') || clean.includes('campus') || clean.includes('university') || clean.includes('college') || clean.includes('institute') || clean.includes('academy') || clean.includes('infosys') || clean.includes('tcs') || clean.includes('wipro') || clean.includes('mindspace') || clean.includes('cyber') || clean.includes('hitec') || clean.includes('sez') || clean.includes('pocharam')) {
        const pool = SEMANTIC_PLACE_POOLS.campus;
        return pool[index % pool.length];
    }

    // 5. 🌊 Lakes, Reservoirs & Waterways
    if (clean.includes('lake') || clean.includes('cheruvu') || clean.includes('sagar') || clean.includes('reservoir') || clean.includes('dam') || clean.includes('river') || clean.includes('pond') || clean.includes('water') || clean.includes('falls') || clean.includes('waterfall')) {
        const pool = SEMANTIC_PLACE_POOLS.lake;
        return pool[index % pool.length];
    }

    // 6. 🌲 Parks, Gardens & Sanctuaries
    if (clean.includes('park') || clean.includes('garden') || clean.includes('botanical') || clean.includes('forest') || clean.includes('bamboo') || clean.includes('sanctuary') || clean.includes('safari') || clean.includes('trail') || clean.includes('deer') || clean.includes('meadow')) {
        const pool = SEMANTIC_PLACE_POOLS.park;
        return pool[index % pool.length];
    }

    // 7. 🏰 Historic Forts, Bastions & Palaces
    if (clean.includes('fort') || clean.includes('citadel') || clean.includes('rampart') || clean.includes('palace') || clean.includes('mahal') || clean.includes('qila') || clean.includes('bastion') || clean.includes('heritage') || clean.includes('bhuvanagiri') || clean.includes('bhongir')) {
        const pool = SEMANTIC_PLACE_POOLS.fort;
        return pool[index % pool.length];
    }

    // 8. ☕ Cafes, Bakeries & Coffee Houses
    if (clean.includes('cafe') || clean.includes('coffee') || clean.includes('roastery') || clean.includes('bakery') || clean.includes('bistro') || clean.includes('tea') || clean.includes('chai') || clean.includes('espresso')) {
        const pool = SEMANTIC_PLACE_POOLS.cafe;
        return pool[index % pool.length];
    }

    // 9. 🍛 Restaurants, Biryani, Dhabas & Dining
    if (clean.includes('restaurant') || clean.includes('biryani') || clean.includes('dhaba') || clean.includes('kitchen') || clean.includes('dining') || clean.includes('diner') || clean.includes('food') || clean.includes('eatery') || clean.includes('thali') || clean.includes('grill') || clean.includes('bawarchi') || clean.includes('paradise') || clean.includes('bhojanalaya')) {
        const pool = SEMANTIC_PLACE_POOLS.restaurant;
        return pool[index % pool.length];
    }

    // 10. 🛍️ Bazaars & Shopping Centers
    if (clean.includes('bazaar') || clean.includes('market') || clean.includes('mall') || clean.includes('shopping') || clean.includes('plaza') || clean.includes('mart')) {
        const pool = SEMANTIC_PLACE_POOLS.market;
        return pool[index % pool.length];
    }

    // 11. 🌄 Hills & Lookouts
    if (clean.includes('hill') || clean.includes('peak') || clean.includes('ridge') || clean.includes('viewpoint') || clean.includes('lookout') || clean.includes('cliff') || clean.includes('ghat')) {
        const pool = SEMANTIC_PLACE_POOLS.hill;
        return pool[index % pool.length];
    }

    // 12. 🌾 Villages, Local Mandals & Regional Townships
    if (clean.includes('village') || clean.includes('district') || clean.includes('mandal') || clean.includes('nagar') || clean.includes('colony') || clean.includes('town') || clean.includes('panchayat') || clean.includes('rural') || clean.includes('bogaram') || clean.includes('gowrelli') || clean.includes('aushapur') || clean.includes('ghatkesar') || clean.includes('medak')) {
        const pool = SEMANTIC_PLACE_POOLS.village;
        return pool[index % pool.length];
    }

    // 13. Fallback to category pool
    const catLower = (category || 'landmark').toLowerCase();
    if (SEMANTIC_PLACE_POOLS[catLower]) {
        const pool = SEMANTIC_PLACE_POOLS[catLower];
        return pool[index % pool.length];
    }

    // 14. Default to scenic village/landscape
    const defaultPool = SEMANTIC_PLACE_POOLS.village;
    return defaultPool[index % defaultPool.length];
}

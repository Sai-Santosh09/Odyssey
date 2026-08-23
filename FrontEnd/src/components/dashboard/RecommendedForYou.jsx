import { Sparkles, Plus, Star } from 'lucide-react';
import { getDestinationPhoto } from '../../services/imageService';

const RECOMMENDATIONS = [
    {
        id: 'rec_trek',
        title: 'Mountain Trekking & Alpine Camping',
        location: 'Himachal & Manali Trails',
        vibe: '🏔️ Adventure',
        rating: 4.9,
        duration: 'Full Day',
        matchPercent: '98% Match',
        image: getDestinationPhoto('manali'),
        description: 'Guided high-altitude ascent through cedar forests with stargazing campfire.',
    },
    {
        id: 'rec_food',
        title: 'Secret Local Street Food Walk',
        location: 'Old Quarters & Spice Bazaars',
        vibe: '🍜 Food & Dining',
        rating: 4.8,
        duration: '3.5 Hours',
        matchPercent: '95% Match',
        image: getDestinationPhoto('jaipur'),
        description: 'Taste 8+ artisanal recipes, traditional clay-oven delicacies and local desserts.',
    },
    {
        id: 'rec_cruise',
        title: 'Golden Hour Sunset Coastal Cruise',
        location: 'River & Ocean Delta',
        vibe: '🌅 Relaxation',
        rating: 4.9,
        duration: '2 Hours',
        matchPercent: '94% Match',
        image: getDestinationPhoto('goa'),
        description: 'Catamaran cruise with acoustic melodies, sparkling drinks and sea breeze.',
    },
    {
        id: 'rec_heritage',
        title: 'Heritage Walk & Royal Architecture',
        location: 'Historic Monuments & Forts',
        vibe: '🏛️ Culture',
        rating: 4.7,
        duration: '3 Hours',
        matchPercent: '92% Match',
        image: getDestinationPhoto('paris'),
        description: 'Expert historian-led walk across ancient palaces, arches and vintage courtyards.',
    },
];

export function RecommendedForYou({ onAddToTrip, onSelectRecommendation }) {
    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-lg sm:text-xl font-bold text-odyssey-navy dark:text-odyssey-cream tracking-tight">
                            Picked for you
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy text-odyssey-brown dark:text-odyssey-tan flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI Matched
                        </span>
                    </div>
                    <p className="text-xs text-odyssey-slate dark:text-odyssey-tan">
                        Based on your travel preferences & past journeys.
                    </p>
                </div>
            </div>

            {/* Recommendations Grid / Scroll */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {RECOMMENDATIONS.map((rec) => (
                    <div
                        key={rec.id}
                        onClick={() => onSelectRecommendation?.(rec)}
                        className="group bg-white dark:bg-odyssey-slate rounded-3xl p-3.5 border border-odyssey-tan/40 dark:border-odyssey-brown/50 shadow-sm hover:shadow-lg hover:border-odyssey-tan/40 dark:hover:border-orange-900 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                    >
                        {/* Image Banner */}
                        <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-900 mb-3">
                            <img
                                src={rec.image}
                                alt={rec.title}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                            {/* Match Badge */}
                            <div className="absolute top-2.5 left-2.5">
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/90 backdrop-blur-md text-white shadow-xs">
                                    {rec.matchPercent}
                                </span>
                            </div>

                            {/* Vibe Pill */}
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs font-semibold">
                                <span>{rec.vibe}</span>
                                <div className="flex items-center gap-1 text-amber-300 text-xs font-bold bg-odyssey-navy/50 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                                    <Star className="w-3 h-3 fill-amber-300" />
                                    <span>{rec.rating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="space-y-1 flex-1">
                            <h4 className="text-sm font-bold text-odyssey-navy dark:text-odyssey-cream group-hover:text-odyssey-brown dark:text-odyssey-tan transition-colors leading-snug">
                                {rec.title}
                            </h4>
                            <p className="text-[11px] text-odyssey-slate dark:text-odyssey-tan line-clamp-2">
                                {rec.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 pt-2.5 border-t border-odyssey-tan/30 dark:border-odyssey-brown/50 flex items-center justify-between">
                            <span className="text-[11px] font-medium text-slate-400 dark:text-odyssey-tan/80">
                                ⏱️ {rec.duration}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToTrip?.(rec);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy hover:bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy text-odyssey-brown dark:text-odyssey-tan hover:text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                            >
                                <Plus className="w-3 h-3" />
                                <span>Add to Trip</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

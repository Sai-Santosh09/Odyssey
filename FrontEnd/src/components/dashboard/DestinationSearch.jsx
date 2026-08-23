import React, { useState } from 'react';
import { Search, X, ExternalLink } from 'lucide-react';
import { getGoogleSearchUrls } from '../../services/dynamicDestinationService';

const CATEGORY_FILTERS = [
    { id: 'all', label: 'All Places', icon: '✨' },
    { id: 'popular', label: 'Trending', icon: '🔥' },
    { id: 'nature', label: 'Nature & Parks', icon: '🌲' },
    { id: 'adventure', label: 'Adventure', icon: '🏔️' },
    { id: 'food', label: 'Food & Dining', icon: '🍜' },
    { id: 'culture', label: 'Heritage & Art', icon: '🏛️' },
    { id: 'relaxation', label: 'Relaxation', icon: '🏖️' },
];

export function DestinationSearch({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
}) {
    const [isFocused, setIsFocused] = useState(false);
    const googleUrls = getGoogleSearchUrls(searchQuery);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery) {
            document.getElementById('section-explore')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="space-y-4">
            {/* Fully Rounded Search Input Pill */}
            <div
                className={`relative flex items-center bg-white dark:bg-odyssey-slate rounded-full border transition-all duration-200 shadow-sm ${
                    isFocused
                        ? 'border-odyssey-brown dark:border-odyssey-tan ring-4 ring-odyssey-brown/15 dark:ring-odyssey-tan/15 shadow-md'
                        : 'border-odyssey-tan/40 dark:border-odyssey-brown/50 hover:border-odyssey-brown/60 dark:hover:border-odyssey-tan/60'
                }`}
            >
                <div className="absolute left-3.5 sm:left-4 text-odyssey-slate dark:text-odyssey-tan flex items-center pointer-events-none">
                    <Search className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isFocused ? 'text-odyssey-brown dark:text-odyssey-tan' : 'text-odyssey-slate dark:text-odyssey-tan'}`} />
                </div>
                <input
                    id="destination-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search any destination, country, city, spot, or hidden gem..."
                    className="w-full py-3 sm:py-3.5 pl-10 sm:pl-12 pr-14 sm:pr-24 text-xs sm:text-sm text-odyssey-navy dark:text-odyssey-cream placeholder:text-odyssey-slate/60 dark:placeholder:text-odyssey-tan/60 bg-transparent focus:outline-none font-medium"
                />

                {/* Quick Action Badges / Controls in Input */}
                <div className="absolute right-2.5 sm:right-3.5 flex items-center gap-1">
                    {searchQuery && (
                        <>
                            <a
                                href={googleUrls.search}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseDown={(e) => e.preventDefault()}
                                className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-odyssey-cream/50 dark:bg-odyssey-navy text-odyssey-navy dark:text-odyssey-cream hover:text-odyssey-brown border border-odyssey-tan/40 dark:border-odyssey-brown shadow-2xs transition-all active:scale-95"
                                title="Search Google directly"
                            >
                                <svg className="w-3 h-3" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span>Google</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="p-1.5 rounded-full bg-odyssey-cream/60 dark:bg-odyssey-navy hover:opacity-80 text-odyssey-navy dark:text-odyssey-cream transition-colors cursor-pointer"
                                aria-label="Clear search"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Scrollable Category Filter Rounded-Full Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
                {CATEGORY_FILTERS.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-150 active:scale-95 touch-manipulation cursor-pointer ${
                                isActive
                                    ? 'bg-odyssey-brown text-odyssey-cream hover:opacity-90 dark:bg-odyssey-tan dark:text-odyssey-navy dark:hover:opacity-90 shadow-md font-extrabold'
                                    : 'bg-white dark:bg-odyssey-slate hover:bg-odyssey-cream/30 dark:hover:bg-odyssey-navy/50 text-odyssey-navy dark:text-odyssey-cream border border-odyssey-tan/40 dark:border-odyssey-brown/50 shadow-xs font-semibold'
                            }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

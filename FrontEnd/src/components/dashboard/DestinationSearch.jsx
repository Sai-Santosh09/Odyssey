import React, { useState } from 'react';
import { Search, X, Sparkles, MapPin, ExternalLink } from 'lucide-react';
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
            // Scroll smoothly down to explore destinations section
            document.getElementById('section-explore')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="space-y-4">
            {/* Search Input Bar */}
            <div
                className={`relative flex items-center bg-slate-100 dark:bg-[#182238] rounded-2xl border transition-all duration-200 shadow-sm ${
                    isFocused
                        ? 'border-[#F06536] ring-4 ring-[#F06536]/15 shadow-md shadow-[#F06536]/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
            >
                <div className="pl-4 pr-2 text-slate-400 dark:text-slate-500 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-[#F06536]' : 'text-slate-400 dark:text-slate-500'}`} />
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
                    className="w-full py-3.5 pr-24 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent focus:outline-none font-medium"
                />

                {/* Quick Action Badges / Controls in Input */}
                <div className="absolute right-3 flex items-center gap-1.5">
                    {searchQuery && (
                        <>
                            <a
                                href={googleUrls.search}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseDown={(e) => e.preventDefault()}
                                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white dark:bg-[#222f4c] text-slate-700 dark:text-slate-200 hover:text-[#F06536] border border-slate-200 dark:border-slate-700 shadow-2xs transition-all active:scale-95"
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
                                className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Scrollable Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
                {CATEGORY_FILTERS.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 touch-manipulation ${
                                isActive
                                    ? 'bg-[#F06536] text-white shadow-md shadow-[#F06536]/25'
                                    : 'bg-white dark:bg-[#131B2E] hover:bg-slate-100 dark:hover:bg-[#182238] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-2xs'
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

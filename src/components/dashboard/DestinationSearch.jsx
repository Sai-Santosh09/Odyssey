import React, { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const CATEGORY_FILTERS = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'nearby', label: 'Nearby', icon: '📍' },
    { id: 'popular', label: 'Popular', icon: '🔥' },
    { id: 'nature', label: 'Nature', icon: '🌲' },
    { id: 'adventure', label: 'Adventure', icon: '🏔️' },
    { id: 'food', label: 'Food', icon: '🍜' },
    { id: 'culture', label: 'Culture', icon: '🏛️' },
    { id: 'relaxation', label: 'Relaxation', icon: '🏖️' },
];

export function DestinationSearch({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
}) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <section className="space-y-3 pt-2">
            {/* Interactive Search Bar */}
            <div
                className={`relative flex items-center bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
                    isFocused
                        ? 'border-[#F06536] ring-4 ring-[#F06536]/15 shadow-md shadow-[#F06536]/5'
                        : 'border-stone-200/90 hover:border-stone-300'
                }`}
            >
                <div className="pl-4 pr-2 text-stone-400 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-[#F06536]' : 'text-stone-400'}`} />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search destinations, places or activities..."
                    className="w-full py-3.5 pr-10 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none font-medium"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 p-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Horizontally Scrollable Quick Filters */}
            <div className="relative">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar touch-pan-x select-none -mx-4 px-4 sm:mx-0 sm:px-0">
                    {CATEGORY_FILTERS.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 touch-manipulation ${
                                    isActive
                                        ? 'bg-[#181A20] text-white shadow-md shadow-black/10'
                                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 shadow-xs'
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

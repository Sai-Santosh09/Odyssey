import React, { useState } from 'react';
import { Search, X, Sparkles, MapPin } from 'lucide-react';

const CATEGORY_FILTERS = [
    { id: 'all', label: 'All Places', icon: '✨' },
    { id: 'nearby', label: 'Near Me', icon: '📍' },
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
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search any destination, country, activity, or hidden spot..."
                    className="w-full py-3.5 pr-10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent focus:outline-none font-medium"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Scrollable Category Filter Pills (Hidden Scrollbar) */}
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

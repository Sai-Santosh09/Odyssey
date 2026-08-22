import React, { useState } from 'react';
import { X, MapPin, Check, Navigation, Search } from 'lucide-react';

const POPULAR_LOCATIONS = [
    { city: 'Hyderabad, India', tag: 'Current' },
    { city: 'Bengaluru, India', tag: 'Tech & Gardens' },
    { city: 'Mumbai, India', tag: 'Coast & Cinema' },
    { city: 'New Delhi, India', tag: 'Capital & Heritage' },
    { city: 'Goa, India', tag: 'Beaches & Shacks' },
    { city: 'Jaipur, India', tag: 'Palaces & Forts' },
    { city: 'Paris, France', tag: 'Art & Eiffel' },
    { city: 'London, United Kingdom', tag: 'Thames & Royals' },
];

export function ChangeLocationModal({
    isOpen,
    onClose,
    currentLocation,
    onSelectLocation
}) {
    const [query, setQuery] = useState('');

    if (!isOpen) return null;

    const filtered = POPULAR_LOCATIONS.filter((l) =>
        l.city.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-stone-200 p-5 space-y-4 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-orange-50 text-[#F06536] flex items-center justify-center">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-stone-900">
                            Change Location
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search city or country..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#F06536]"
                    />
                </div>

                {/* Locations List */}
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {filtered.map((item) => {
                        const isCurrent = currentLocation === item.city;
                        return (
                            <button
                                key={item.city}
                                onClick={() => {
                                    onSelectLocation(item.city);
                                    onClose();
                                }}
                                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-semibold transition-all ${
                                    isCurrent
                                        ? 'bg-orange-50/80 border border-[#F06536]/40 text-[#F06536]'
                                        : 'bg-stone-50/60 hover:bg-stone-100 text-stone-800'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#F06536]' : 'text-stone-400'}`} />
                                    <span>{item.city}</span>
                                </div>
                                {isCurrent ? (
                                    <Check className="w-4 h-4 text-[#F06536]" />
                                ) : (
                                    <span className="text-[10px] text-stone-400 font-normal">{item.tag}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { X, MapPin, Calendar, Users, Sparkles, ArrowRight, Loader2, Compass } from 'lucide-react';

const VIBE_OPTIONS = [
    { id: 'adventure', label: 'Adventure', icon: '🏔️' },
    { id: 'relaxation', label: 'Relaxation', icon: '🏖️' },
    { id: 'food', label: 'Food', icon: '🍜' },
    { id: 'culture', label: 'Culture', icon: '🏛️' },
    { id: 'nature', label: 'Nature', icon: '🌲' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
];

const SUGGESTED_PLACES = [
    'Goa, India',
    'Manali, Himachal Pradesh',
    'Jaipur, Rajasthan',
    'Paris, France',
    'Berlin, Germany',
    'Tromsø, Norway',
    'Bali, Indonesia',
    'Kyoto, Japan'
];

export function CreateTripModal({ isOpen, onClose, onCreateTrip }) {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [travelers, setTravelers] = useState(2);
    const [selectedVibes, setSelectedVibes] = useState(['adventure', 'food']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const toggleVibe = (vibeId) => {
        if (selectedVibes.includes(vibeId)) {
            setSelectedVibes(selectedVibes.filter((v) => v !== vibeId));
        } else {
            setSelectedVibes([...selectedVibes, vibeId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!destination.trim()) return;

        setIsSubmitting(true);
        setTimeout(() => {
            const start = startDate ? new Date(startDate) : new Date();
            const end = endDate ? new Date(endDate) : new Date(Date.now() + 4 * 86400000);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

            const formattedDates = `${start.getDate()} ${start.toLocaleString('default', { month: 'short' })} – ${end.getDate()} ${end.toLocaleString('default', { month: 'short' })}`;

            const newTrip = {
                id: 'trip_' + Date.now(),
                title: `${destination.split(',')[0].trim()} Expedition`,
                location: destination,
                dates: formattedDates,
                travelers: parseInt(travelers, 10),
                totalDays: diffDays,
                currentDay: 1,
                activitiesCount: diffDays * 3,
                status: 'upcoming',
                vibe: selectedVibes.map((v) => VIBE_OPTIONS.find((opt) => opt.id === v)?.label).join(' & ') || 'Exploration',
                daysRemaining: 14,
                itinerary: [
                    { time: '09:00 AM', title: `Arrival & check-in at ${destination.split(',')[0]}`, icon: '📍', category: 'Check-in', done: false },
                    { time: '11:30 AM', title: 'Local neighborhood cafe & welcome drinks', icon: '☕', category: 'Food', done: false },
                    { time: '03:00 PM', title: 'Guided scenic sightseeing & landmark tour', icon: '🏛️', category: 'Culture', done: false },
                    { time: '07:30 PM', title: 'Sunset dinner & cultural evening', icon: '🌅', category: 'Dining', done: false },
                ]
            };

            onCreateTrip(newTrip);
            setIsSubmitting(false);
            onClose();
        }, 400);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-5 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#F06536]/10 text-[#F06536] flex items-center justify-center">
                            <Compass className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#181A20] tracking-tight">
                                Create your trip
                            </h2>
                            <p className="text-xs text-stone-500">
                                Set up your destination, dates & travel style.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                        aria-label="Close dialog"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Destination Search */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                            Where are you going?
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F06536]" />
                            <input
                                type="text"
                                required
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Search destination (e.g. Goa, Paris, Manali)..."
                                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#F06536]/20 focus:border-[#F06536] transition-all"
                            />
                        </div>

                        {/* Quick Suggestions */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {SUGGESTED_PLACES.slice(0, 4).map((place) => (
                                <button
                                    type="button"
                                    key={place}
                                    onClick={() => setDestination(place)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                                >
                                    {place}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#F06536]/20 focus:border-[#F06536]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#F06536]/20 focus:border-[#F06536]"
                            />
                        </div>
                    </div>

                    {/* Number of Travelers */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                            Who's going?
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { count: 1, label: 'Solo 👤' },
                                { count: 2, label: 'Couple 👥' },
                                { count: 3, label: 'Group (3) 👨‍👩‍👧' },
                                { count: 4, label: 'Squad (4+) 🌟' },
                            ].map((item) => (
                                <button
                                    type="button"
                                    key={item.count}
                                    onClick={() => setTravelers(item.count)}
                                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                                        travelers === item.count
                                            ? 'bg-[#181A20] text-white border-[#181A20] shadow-sm'
                                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* What's Your Vibe? Multi-select */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                            What's your vibe?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {VIBE_OPTIONS.map((vibe) => {
                                const isSelected = selectedVibes.includes(vibe.id);
                                return (
                                    <button
                                        type="button"
                                        key={vibe.id}
                                        onClick={() => toggleVibe(vibe.id)}
                                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                                            isSelected
                                                ? 'bg-orange-50/80 border-[#F06536] text-[#F06536] shadow-xs'
                                                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                                        }`}
                                    >
                                        <span>{vibe.icon}</span>
                                        <span>{vibe.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={isSubmitting || !destination.trim()}
                            className="w-full bg-[#F06536] hover:bg-[#E05325] active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-[#F06536]/25 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Generating Your Odyssey...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create My Odyssey</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

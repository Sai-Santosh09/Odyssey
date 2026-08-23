import React, { useState } from 'react';
import { X, Luggage, MapPin, Star } from 'lucide-react';

export function TravelerProfileModal({
    isOpen,
    onClose,
    userEmail = 'explorer@odyssey.app',
    preferences = {
        budget: 'Moderate',
        travelStyle: ['Adventure', 'Foodie', 'Nature'],
        preferredTransport: 'Flight',
        pace: 'Balanced',
    },
    onUpdatePreferences,
    travelHistory = []
}) {
    const [activeSection, setActiveSection] = useState('preferences'); // 'preferences' | 'history'
    const [budget, setBudget] = useState(preferences.budget || 'Moderate');
    const [selectedStyles, setSelectedStyles] = useState(preferences.travelStyle || ['Adventure', 'Foodie', 'Nature']);
    const [transport, setTransport] = useState(preferences.preferredTransport || 'Flight');
    const [pace, setPace] = useState(preferences.pace || 'Balanced');

    if (!isOpen) return null;

    const toggleStyle = (style) => {
        if (selectedStyles.includes(style)) {
            setSelectedStyles(selectedStyles.filter((s) => s !== style));
        } else {
            setSelectedStyles([...selectedStyles, style]);
        }
    };

    const handleSave = () => {
        onUpdatePreferences?.({
            budget,
            travelStyle: selectedStyles,
            preferredTransport: transport,
            pace,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-odyssey-slate rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 p-5 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-odyssey-tan/30 dark:border-odyssey-brown/50 pb-3.5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F06536] to-amber-400 text-white font-black text-base flex items-center justify-center shadow-md shadow-[#F06536]/20">
                            {userEmail ? userEmail.charAt(0).toUpperCase() : 'E'}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-odyssey-navy dark:text-odyssey-cream tracking-tight">
                                Traveler Profile
                            </h2>
                            <p className="text-xs text-odyssey-slate dark:text-odyssey-tan truncate max-w-[200px] sm:max-w-xs">
                                {userEmail}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-odyssey-slate dark:hover:text-slate-200 transition-colors"
                        aria-label="Close dialog"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Sub-tab Switcher: Preferences vs Travel History */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-odyssey-navy rounded-2xl">
                    <button
                        onClick={() => setActiveSection('preferences')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                            activeSection === 'preferences'
                                ? 'bg-white dark:bg-odyssey-slate text-odyssey-brown dark:text-odyssey-tan shadow-sm'
                                : 'text-odyssey-slate dark:text-odyssey-tan hover:text-odyssey-navy dark:hover:text-white'
                        }`}
                    >
                        ✨ Travel Preferences
                    </button>
                    <button
                        onClick={() => setActiveSection('history')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                            activeSection === 'history'
                                ? 'bg-white dark:bg-odyssey-slate text-odyssey-brown dark:text-odyssey-tan shadow-sm'
                                : 'text-odyssey-slate dark:text-odyssey-tan hover:text-odyssey-navy dark:hover:text-white'
                        }`}
                    >
                        🧳 Travel History ({travelHistory.length})
                    </button>
                </div>

                {/* Section 1: Preferences */}
                {activeSection === 'preferences' ? (
                    <div className="space-y-4">
                        {/* Budget Preference */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-odyssey-slate dark:text-odyssey-tan uppercase tracking-wider">
                                Budget Tier
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Budget 💵', val: 'Budget', desc: 'Hostels & Local Cafes' },
                                    { label: 'Moderate 💳', val: 'Moderate', desc: 'Boutique & Quality' },
                                    { label: 'Luxury 💎', val: 'Luxury', desc: '5-Star & Private Tours' },
                                ].map((b) => (
                                    <button
                                        type="button"
                                        key={b.val}
                                        onClick={() => setBudget(b.val)}
                                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                                            budget === b.val
                                                ? 'bg-odyssey-cream/60 dark:bg-odyssey-navy/80 dark:bg-odyssey-navy border-odyssey-tan/40 dark:border-odyssey-brown/50 text-odyssey-brown dark:text-odyssey-tan shadow-xs'
                                                : 'bg-slate-50 dark:bg-odyssey-navy border-odyssey-tan/40 dark:border-odyssey-brown/50 text-odyssey-slate dark:text-odyssey-tan'
                                        }`}
                                    >
                                        <p className="font-bold">{b.label}</p>
                                        <p className="text-[10px] text-slate-400 font-normal mt-0.5">{b.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Travel Style (Vibe) */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-odyssey-slate dark:text-odyssey-tan uppercase tracking-wider">
                                Travel Styles & Passions
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {[
                                    { name: 'Adventure', icon: '🏔️' },
                                    { name: 'Relaxation', icon: '🏖️' },
                                    { name: 'Foodie', icon: '🍜' },
                                    { name: 'Culture', icon: '🏛️' },
                                    { name: 'Nature', icon: '🌲' },
                                    { name: 'Shopping', icon: '🛍️' },
                                ].map((st) => {
                                    const isSel = selectedStyles.includes(st.name);
                                    return (
                                        <button
                                            type="button"
                                            key={st.name}
                                            onClick={() => toggleStyle(st.name)}
                                            className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                                                isSel
                                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-odyssey-navy border-slate-900 dark:border-white shadow-xs'
                                                    : 'bg-slate-50 dark:bg-odyssey-navy border-odyssey-tan/40 dark:border-odyssey-brown/50 text-odyssey-slate dark:text-odyssey-tan'
                                            }`}
                                        >
                                            <span>{st.icon}</span>
                                            <span>{st.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Preferred Transport */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-odyssey-slate dark:text-odyssey-tan uppercase tracking-wider">
                                Preferred Transport
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { label: 'Flight ✈️', val: 'Flight' },
                                    { label: 'Train 🚆', val: 'Train' },
                                    { label: 'Rental Car 🚗', val: 'Rental Car' },
                                    { label: 'Transit 🚌', val: 'Transit' },
                                ].map((t) => (
                                    <button
                                        type="button"
                                        key={t.val}
                                        onClick={() => setTransport(t.val)}
                                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                                            transport === t.val
                                                ? 'bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy border-odyssey-tan/40 dark:border-odyssey-brown/50 text-odyssey-brown dark:text-odyssey-tan'
                                                : 'bg-slate-50 dark:bg-odyssey-navy border-odyssey-tan/40 dark:border-odyssey-brown/50 text-odyssey-slate dark:text-odyssey-tan'
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Travel Pace */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-odyssey-slate dark:text-odyssey-tan uppercase tracking-wider">
                                Travel Pace
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Fast-paced ⚡', val: 'Fast' },
                                    { label: 'Balanced ⚖️', val: 'Balanced' },
                                    { label: 'Relaxed 🧘', val: 'Relaxed' },
                                ].map((p) => (
                                    <button
                                        type="button"
                                        key={p.val}
                                        onClick={() => setPace(p.val)}
                                        className={`py-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                                            pace === p.val
                                                ? 'bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy text-white border-odyssey-tan/40 dark:border-odyssey-brown/50'
                                                : 'bg-slate-50 dark:bg-odyssey-navy border-odyssey-tan/40 dark:border-odyssey-brown/50 text-odyssey-slate dark:text-odyssey-tan'
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={handleSave}
                                className="w-full py-3 bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy hover:opacity-90 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#F06536]/25 transition-all"
                            >
                                Save Preferences & Update AI Recommendations
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Section 2: Travel History */
                    <div className="space-y-3">
                        {travelHistory.length === 0 ? (
                            <div className="bg-slate-50 dark:bg-odyssey-navy/70 rounded-2xl p-6 text-center border border-dashed border-odyssey-tan/40 dark:border-odyssey-brown/50 space-y-2">
                                <Luggage className="w-8 h-8 text-slate-400 mx-auto" />
                                <p className="text-xs font-bold text-odyssey-slate dark:text-odyssey-tan">No completed journeys yet</p>
                                <p className="text-[11px] text-odyssey-slate dark:text-odyssey-tan">Completed journeys will appear in your travel history log.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {travelHistory.map((h) => (
                                    <div
                                        key={h.id}
                                        className="bg-slate-50 dark:bg-odyssey-navy/70 rounded-2xl p-3 border border-odyssey-tan/40/80 dark:border-odyssey-brown/50 flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            {h.image && (
                                                <img
                                                    src={h.image}
                                                    alt={h.title}
                                                    className="w-12 h-12 rounded-xl object-cover object-center flex-shrink-0"
                                                />
                                            )}
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    <h4 className="text-xs font-bold text-odyssey-navy dark:text-odyssey-cream">
                                                        {h.title}
                                                    </h4>
                                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                                        Completed
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-odyssey-slate dark:text-odyssey-tan flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-odyssey-brown dark:text-odyssey-tan" />
                                                    <span>{h.destination}</span>
                                                </p>
                                                <p className="text-[10px] text-slate-400">
                                                    📅 {h.dates} • {h.vibe}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold flex-shrink-0">
                                            <Star className="w-3 h-3 fill-amber-400" />
                                            <span>{h.rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

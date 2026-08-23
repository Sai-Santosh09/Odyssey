import React, { useState, useEffect } from 'react';
import { 
    X, 
    Sparkles, 
    CheckCircle2, 
    Luggage, 
    Shield, 
    Calendar, 
    Loader2, 
    Lightbulb, 
    Building2, 
    ExternalLink, 
    Star, 
    Tag, 
    Check, 
    ArrowRight,
    MapPin,
    Plane,
    Train,
    Bus,
    Clock,
    Users,
    Edit3,
    Plus,
    Minus,
    Save
} from 'lucide-react';
import { generateGeminiTripBreakdown } from '../../services/geminiService';

const TRIP_VIBES = [
    'Adventure & Relaxation',
    'Cultural Heritage',
    'Luxury Leisure',
    'Foodie & Nightlife',
    'Beach & Chill',
    'Nature & Wildlife'
];

const BUDGET_TIERS = ['Budget', 'Moderate', 'Luxury'];

export function TripDetailsModal({
    trip,
    isOpen,
    onClose,
    onUpdateTrip
}) {
    const [activeTab, setActiveTab] = useState('gemini_ai'); // 'gemini_ai' | 'itinerary'
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    
    // Editable form state
    const [editForm, setEditForm] = useState({
        title: '',
        travelers: 2,
        totalDays: 3,
        dates: '',
        vibe: 'Adventure & Relaxation',
        budget: 'Moderate'
    });

    const [aiData, setAiData] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);
    const [bookingToast, setBookingToast] = useState(null);
    const [selectedTransitMode, setSelectedTransitMode] = useState('Flight');

    // Sync form state whenever trip changes
    useEffect(() => {
        if (trip) {
            setEditForm({
                title: trip.title || '',
                travelers: trip.travelers || 2,
                totalDays: trip.totalDays || 3,
                dates: trip.dates || 'Upcoming Journey',
                vibe: trip.vibe || 'Adventure & Relaxation',
                budget: trip.budget || 'Moderate'
            });
            setIsEditingDetails(false);
        }
    }, [trip]);

    // Recalculate AI breakdowns whenever destination, days, travelers, or budget changes
    useEffect(() => {
        if (!isOpen || !trip) return;

        let isMounted = true;
        setLoadingAi(true);

        const activeTravelers = editForm.travelers || trip.travelers || 2;
        const activeDays = editForm.totalDays || trip.totalDays || 3;
        const activeBudget = editForm.budget || trip.budget || 'Moderate';
        const activeVibe = editForm.vibe || trip.vibe || 'Adventure & Relaxation';

        generateGeminiTripBreakdown({
            destination: trip.location || trip.title,
            totalDays: activeDays,
            travelers: activeTravelers,
            budgetTier: activeBudget,
            vibe: activeVibe
        }).then((res) => {
            if (isMounted) {
                setAiData(res);
                setLoadingAi(false);
            }
        }).catch(() => {
            if (isMounted) setLoadingAi(false);
        });

        return () => {
            isMounted = false;
        };
    }, [isOpen, trip, editForm.travelers, editForm.totalDays, editForm.budget, editForm.vibe]);

    if (!isOpen || !trip) return null;

    const costs = aiData?.costs || { flights: 8500, hotels: 14000, food: 6500, activities: 4500, total: 33500 };
    const suggestions = aiData?.smartSuggestions;
    const accommodation = aiData?.accommodation;
    const hotelComparisons = accommodation?.hotel_comparisons || aiData?.hotel_comparisons || [];
    const transportComparisons = aiData?.transport_comparisons || [];

    const handleQuickTravelersChange = (delta) => {
        const newCount = Math.max(1, Math.min(20, (editForm.travelers || 2) + delta));
        const updated = {
            ...trip,
            travelers: newCount
        };
        setEditForm((prev) => ({ ...prev, travelers: newCount }));
        if (onUpdateTrip) onUpdateTrip(updated);
    };

    const handleSaveTripDetails = (e) => {
        e?.preventDefault();
        const updated = {
            ...trip,
            title: editForm.title.trim() || trip.title,
            travelers: Number(editForm.travelers) || 2,
            totalDays: Number(editForm.totalDays) || 3,
            dates: editForm.dates.trim() || trip.dates,
            vibe: editForm.vibe,
            budget: editForm.budget
        };

        if (onUpdateTrip) {
            onUpdateTrip(updated);
        }
        setIsEditingDetails(false);
        setBookingToast({
            title: `Trip Details Saved!`,
            description: `Updated itinerary for ${updated.travelers} traveler(s) in ${updated.title}.`,
            icon: 'save'
        });
        setTimeout(() => setBookingToast(null), 4000);
    };

    const handleSimulatedHotelBooking = (platform, pricePerNight, totalStayPrice) => {
        setBookingToast({
            title: `Hotel Reserved with ${platform.platform_name}!`,
            description: `Locked best rate of ₹${pricePerNight.toLocaleString()}/night (Total: ₹${totalStayPrice.toLocaleString()}) for ${accommodation?.hotel_name || 'Recommended Stay'}.`,
            icon: 'hotel'
        });
        setTimeout(() => {
            setBookingToast(null);
        }, 4500);
    };

    const handleSimulatedTransitBooking = (transit) => {
        setSelectedTransitMode(transit.mode);
        setBookingToast({
            title: `${transit.mode} Tickets Selected with ${transit.operator_name}!`,
            description: `${transit.estimated_duration} route for ${editForm.travelers} traveler(s) at ₹${transit.price_per_person.toLocaleString()}/person (Total: ₹${transit.total_price.toLocaleString()}).`,
            icon: transit.mode.toLowerCase()
        });
        setTimeout(() => {
            setBookingToast(null);
        }, 4500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-odyssey-navy/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white dark:bg-odyssey-slate rounded-[28px] max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-odyssey-tan/40 dark:border-odyssey-brown/50/90 p-5 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 transition-colors relative selection:bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy/20 selection:text-odyssey-brown dark:text-odyssey-tan">
                
                {/* Simulated Toast Notification */}
                {bookingToast && (
                    <div className="sticky top-0 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
                        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-3.5 rounded-2xl shadow-xl border border-white/20 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-xs space-y-0.5">
                                    <p className="font-extrabold text-sm">🎉 {bookingToast.title}</p>
                                    <p className="text-emerald-100 text-[11px] leading-snug">
                                        {bookingToast.description}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setBookingToast(null)}
                                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Header & Quick Edit Bar */}
                <div className="border-b border-odyssey-tan/30 dark:border-odyssey-brown/50 pb-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-lg sm:text-xl font-bold text-odyssey-navy dark:text-odyssey-cream tracking-tight">
                                    {trip.title}
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy text-odyssey-brown dark:text-odyssey-tan border border-odyssey-tan/40 dark:border-odyssey-brown/50">
                                    {editForm.vibe || trip.vibe || 'Odyssey Plan'}
                                </span>
                            </div>

                            <p className="text-xs text-odyssey-slate dark:text-odyssey-tan flex items-center gap-2 flex-wrap">
                                <span className="flex items-center gap-1 font-medium">
                                    <MapPin className="w-3 h-3 text-odyssey-brown dark:text-odyssey-tan" />
                                    {trip.location}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    {editForm.dates || trip.dates}
                                </span>
                                <span>•</span>
                                <span>{editForm.totalDays} Days</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                                onClick={() => setIsEditingDetails(!isEditingDetails)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                                    isEditingDetails
                                        ? 'bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy text-odyssey-brown dark:text-odyssey-tan border-odyssey-tan/50 dark:border-odyssey-brown/50'
                                        : 'bg-slate-100 dark:bg-odyssey-navy text-odyssey-slate dark:text-odyssey-tan border-odyssey-tan/40 dark:border-odyssey-brown/50 hover:text-odyssey-brown dark:text-odyssey-tan'
                                }`}
                                title="Edit trip details & number of travelers"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{isEditingDetails ? 'Close Editor' : 'Edit Details'}</span>
                            </button>

                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-odyssey-slate dark:hover:text-slate-200 transition-colors cursor-pointer"
                                aria-label="Close dialog"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Interactive Traveler Stepper Bar */}
                    <div className="bg-slate-50 dark:bg-odyssey-navy/80 p-2.5 rounded-2xl border border-odyssey-tan/40/80 dark:border-odyssey-brown/50 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy text-odyssey-brown dark:text-odyssey-tan flex items-center justify-center">
                                <Users className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-extrabold text-odyssey-navy dark:text-odyssey-cream">
                                    Number of People Traveling: <span className="text-odyssey-brown dark:text-odyssey-tan text-xs font-black">{editForm.travelers} {editForm.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                                </p>
                                <p className="text-[10px] text-slate-400">
                                    Prices & budget dynamically adjust in real time
                                </p>
                            </div>
                        </div>

                        {/* Increment / Decrement Stepper */}
                        <div className="flex items-center gap-1.5 bg-white dark:bg-odyssey-slate px-2 py-1 rounded-xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 shadow-xs">
                            <button
                                type="button"
                                disabled={editForm.travelers <= 1}
                                onClick={() => handleQuickTravelersChange(-1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-slate dark:text-odyssey-cream flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                                title="Decrease number of people"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black text-odyssey-navy dark:text-odyssey-cream w-5 text-center">
                                {editForm.travelers}
                            </span>
                            <button
                                type="button"
                                disabled={editForm.travelers >= 20}
                                onClick={() => handleQuickTravelersChange(1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-slate dark:text-odyssey-cream flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                                title="Increase number of people"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 📝 EXPANDABLE EDIT TRIP DETAILS DRAWER */}
                {isEditingDetails && (
                    <form 
                        onSubmit={handleSaveTripDetails}
                        className="bg-odyssey-cream/60 dark:bg-odyssey-navy/50 dark:bg-odyssey-navy border-2 border-odyssey-tan/40 dark:border-odyssey-brown/50 rounded-3xl p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                        <div className="flex items-center justify-between border-b border-orange-100 dark:border-odyssey-brown/50 pb-2.5">
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-odyssey-navy dark:text-odyssey-cream uppercase tracking-wider">
                                <Edit3 className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                                <span>Edit Journey Details</span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                                Real-time sync & auto-pricing
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Trip Title */}
                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-[11px] font-bold text-odyssey-slate dark:text-odyssey-tan">
                                    Trip Title
                                </label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-odyssey-slate border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-xs font-semibold text-odyssey-navy dark:text-odyssey-cream focus:outline-none focus:ring-2 focus:ring-[#F06536]/30"
                                    placeholder="e.g. Goa Beach Escape"
                                    required
                                />
                            </div>

                            {/* Travelers / Number of People */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-odyssey-slate dark:text-odyssey-tan flex items-center justify-between">
                                    <span>Number of Travelers</span>
                                    <span className="text-odyssey-brown dark:text-odyssey-tan font-extrabold">{editForm.travelers} people</span>
                                </label>
                                <div className="flex items-center gap-2 bg-white dark:bg-odyssey-slate p-1.5 rounded-xl border border-odyssey-tan/40 dark:border-odyssey-brown/50">
                                    <button
                                        type="button"
                                        disabled={editForm.travelers <= 1}
                                        onClick={() => setEditForm((prev) => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
                                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-slate dark:text-odyssey-cream flex items-center justify-center disabled:opacity-30 cursor-pointer"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={editForm.travelers}
                                        onChange={(e) => setEditForm({ ...editForm, travelers: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })}
                                        className="w-full text-center text-xs font-extrabold text-odyssey-navy dark:text-odyssey-cream bg-transparent focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        disabled={editForm.travelers >= 20}
                                        onClick={() => setEditForm((prev) => ({ ...prev, travelers: Math.min(20, prev.travelers + 1) }))}
                                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-slate dark:text-odyssey-cream flex items-center justify-center disabled:opacity-30 cursor-pointer"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Duration (Total Days) */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-odyssey-slate dark:text-odyssey-tan flex items-center justify-between">
                                    <span>Duration (Days)</span>
                                    <span className="text-odyssey-brown dark:text-odyssey-tan font-extrabold">{editForm.totalDays} Days</span>
                                </label>
                                <div className="flex items-center gap-2 bg-white dark:bg-odyssey-slate p-1.5 rounded-xl border border-odyssey-tan/40 dark:border-odyssey-brown/50">
                                    <button
                                        type="button"
                                        disabled={editForm.totalDays <= 1}
                                        onClick={() => setEditForm((prev) => ({ ...prev, totalDays: Math.max(1, prev.totalDays - 1) }))}
                                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-slate dark:text-odyssey-cream flex items-center justify-center disabled:opacity-30 cursor-pointer"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max="14"
                                        value={editForm.totalDays}
                                        onChange={(e) => setEditForm({ ...editForm, totalDays: Math.max(1, Math.min(14, Number(e.target.value) || 1)) })}
                                        className="w-full text-center text-xs font-extrabold text-odyssey-navy dark:text-odyssey-cream bg-transparent focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        disabled={editForm.totalDays >= 14}
                                        onClick={() => setEditForm((prev) => ({ ...prev, totalDays: Math.min(14, prev.totalDays + 1) }))}
                                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-slate dark:text-odyssey-cream flex items-center justify-center disabled:opacity-30 cursor-pointer"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Dates Text */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-odyssey-slate dark:text-odyssey-tan">
                                    Travel Dates
                                </label>
                                <input
                                    type="text"
                                    value={editForm.dates}
                                    onChange={(e) => setEditForm({ ...editForm, dates: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-odyssey-slate border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-xs font-semibold text-odyssey-navy dark:text-odyssey-cream focus:outline-none focus:ring-2 focus:ring-[#F06536]/30"
                                    placeholder="e.g. Nov 15 - 19, 2026"
                                />
                            </div>

                            {/* Budget Tier */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-odyssey-slate dark:text-odyssey-tan">
                                    Budget Tier
                                </label>
                                <select
                                    value={editForm.budget}
                                    onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-odyssey-slate border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-xs font-semibold text-odyssey-navy dark:text-odyssey-cream focus:outline-none focus:ring-2 focus:ring-[#F06536]/30"
                                >
                                    {BUDGET_TIERS.map((tier) => (
                                        <option key={tier} value={tier}>{tier} Budget</option>
                                    ))}
                                </select>
                            </div>

                            {/* Vibe Selection */}
                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-[11px] font-bold text-odyssey-slate dark:text-odyssey-tan">
                                    Travel Style & Vibe
                                </label>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {TRIP_VIBES.map((v) => (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => setEditForm({ ...editForm, vibe: v })}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                                editForm.vibe === v
                                                    ? 'bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy text-white shadow-xs'
                                                    : 'bg-white dark:bg-odyssey-slate text-odyssey-slate dark:text-odyssey-tan border border-odyssey-tan/40 dark:border-odyssey-brown/50 hover:border-odyssey-tan/60'
                                            }`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Save & Cancel Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-orange-100 dark:border-odyssey-brown/50">
                            <button
                                type="button"
                                onClick={() => setIsEditingDetails(false)}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold text-odyssey-slate dark:text-odyssey-tan hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy hover:opacity-90 active:scale-95 text-white transition-all shadow-md shadow-[#F06536]/25 flex items-center gap-1.5 cursor-pointer"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                )}

                {/* Sub Tab Navigation */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-odyssey-navy/90 rounded-2xl border border-odyssey-tan/40/50 dark:border-odyssey-brown/50/80">
                    <button
                        onClick={() => setActiveTab('gemini_ai')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'gemini_ai'
                                ? 'bg-white dark:bg-odyssey-slate text-odyssey-brown dark:text-odyssey-tan shadow-sm'
                                : 'text-odyssey-slate dark:text-odyssey-tan hover:text-odyssey-navy dark:hover:text-white'
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                        <span>AI Insights, Stays & Travel</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('itinerary')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'itinerary'
                                ? 'bg-white dark:bg-odyssey-slate text-odyssey-brown dark:text-odyssey-tan shadow-sm'
                                : 'text-odyssey-slate dark:text-odyssey-tan hover:text-odyssey-navy dark:hover:text-white'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                        <span>Day-Wise Stops ({trip.activitiesCount || 4})</span>
                    </button>
                </div>

                {/* Tab Content 1: Gemini AI Cost Breakdown, Stays & Transit Comparisons */}
                {activeTab === 'gemini_ai' && (
                    <div className="space-y-4">
                        {loadingAi ? (
                            <div className="py-14 text-center space-y-3">
                                <Loader2 className="w-8 h-8 animate-spin text-odyssey-brown dark:text-odyssey-tan mx-auto" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-odyssey-navy dark:text-odyssey-cream">
                                        Gemini AI is updating trip options for {editForm.travelers} traveler(s)...
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Recalculating real-time rates across Flight, Train, Bus & Hotels
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Estimated Cost Breakdown Section */}
                                <div className="bg-slate-50 dark:bg-odyssey-navy/80 rounded-2xl p-4 border border-odyssey-tan/40/80 dark:border-odyssey-brown/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                                                ₹
                                            </div>
                                            <h3 className="text-xs font-bold text-odyssey-navy dark:text-odyssey-cream uppercase tracking-wider">
                                                Estimated Trip Budget ({editForm.travelers} Pax)
                                            </h3>
                                        </div>
                                        <span className="text-xs font-extrabold text-odyssey-brown dark:text-odyssey-tan">
                                            Total: ₹{costs.total.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Cost Breakdown Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        <div className="bg-white dark:bg-odyssey-slate p-2.5 rounded-xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-center ring-1 ring-sky-500/20">
                                            <p className="text-[10px] text-sky-500 font-bold uppercase">Transit / Travel</p>
                                            <p className="text-xs font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">₹{costs.flights.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white dark:bg-odyssey-slate p-2.5 rounded-xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-center ring-1 ring-orange-500/20">
                                            <p className="text-[10px] text-odyssey-brown dark:text-odyssey-tan font-bold uppercase">Hotels / Stays</p>
                                            <p className="text-xs font-extrabold text-odyssey-brown dark:text-odyssey-tan mt-0.5">₹{costs.hotels.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white dark:bg-odyssey-slate p-2.5 rounded-xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Food & Dining</p>
                                            <p className="text-xs font-extrabold text-odyssey-navy dark:text-odyssey-cream mt-0.5">₹{costs.food.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white dark:bg-odyssey-slate p-2.5 rounded-xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Activities</p>
                                            <p className="text-xs font-extrabold text-odyssey-navy dark:text-odyssey-cream mt-0.5">₹{costs.activities.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ✈️🚆🚌 TRAVEL & TRANSIT BOOKING COMPARISON (Flight, Train, Bus) */}
                                {transportComparisons.length > 0 && (
                                    <div 
                                        id="transit-mode-comparison-card"
                                        className="bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 dark:from-[#151F33] dark:via-[#131B2E] dark:to-[#121929] rounded-3xl p-4 sm:p-5 border-2 border-sky-200/90 dark:border-sky-900/60 shadow-lg shadow-sky-500/5 space-y-4 transition-all"
                                    >
                                        {/* Transit Card Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-100 dark:border-odyssey-brown/50/80 pb-3">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500 text-white flex items-center gap-1 shadow-xs">
                                                        <Plane className="w-3 h-3" />
                                                        <span>Transit Booking Options</span>
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                                                        <span>Flight • Train • Bus</span>
                                                    </span>
                                                </div>
                                                <h3 className="text-sm sm:text-base font-extrabold text-odyssey-navy dark:text-odyssey-cream">
                                                    How to get to {trip.location || trip.title}
                                                </h3>
                                            </div>

                                            <p className="text-[11px] text-odyssey-slate dark:text-odyssey-tan font-medium">
                                                Prices for <strong className="text-odyssey-navy dark:text-odyssey-cream font-bold">{editForm.travelers} Traveler(s)</strong>
                                            </p>
                                        </div>

                                        {/* Transit Modes List */}
                                        <div className="space-y-2.5">
                                            {transportComparisons.map((transit, idx) => {
                                                const isSelected = selectedTransitMode === transit.mode;
                                                const isFastest = transit.badge_type === 'fastest';
                                                const isBudget = transit.badge_type === 'budget';

                                                return (
                                                    <div 
                                                        key={idx}
                                                        className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                                            isSelected
                                                                ? 'bg-gradient-to-r from-sky-50/95 via-white to-blue-50/90 dark:from-sky-950/30 dark:via-[#162136] dark:to-blue-950/20 border-sky-400 dark:border-sky-500/60 shadow-md shadow-sky-500/10 ring-2 ring-sky-500/30'
                                                                : 'bg-white dark:bg-odyssey-navy/90 border-odyssey-tan/40/90 dark:border-odyssey-brown/50 hover:border-odyssey-tan/60 dark:hover:border-slate-700'
                                                        }`}
                                                    >
                                                        {/* Transit Mode Info */}
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <div className="flex items-center gap-1.5">
                                                                    {transit.mode === 'Flight' && (
                                                                        <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-xs">
                                                                            <Plane className="w-3.5 h-3.5" />
                                                                        </div>
                                                                    )}
                                                                    {transit.mode === 'Train' && (
                                                                        <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                                                            <Train className="w-3.5 h-3.5" />
                                                                        </div>
                                                                    )}
                                                                    {transit.mode === 'Bus' && (
                                                                        <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                                                                            <Bus className="w-3.5 h-3.5" />
                                                                        </div>
                                                                    )}
                                                                    <span className="font-extrabold text-sm text-odyssey-navy dark:text-odyssey-cream">
                                                                        {transit.mode}: {transit.operator_name}
                                                                    </span>
                                                                </div>

                                                                {/* Badge */}
                                                                {transit.badge && (
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow-xs flex items-center gap-1 ${
                                                                        isFastest
                                                                            ? 'bg-sky-500 text-white'
                                                                            : isBudget
                                                                            ? 'bg-emerald-500 text-white'
                                                                            : 'bg-indigo-500 text-white'
                                                                    }`}>
                                                                        <span>★</span>
                                                                        <span>{transit.badge}</span>
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="text-[11px] text-odyssey-slate dark:text-odyssey-tan flex items-center gap-2 flex-wrap">
                                                                <span className="flex items-center gap-1 font-semibold text-odyssey-slate dark:text-odyssey-tan">
                                                                    <Clock className="w-3 h-3 text-odyssey-brown dark:text-odyssey-tan" />
                                                                    {transit.estimated_duration}
                                                                </span>
                                                                <span>•</span>
                                                                <span>{transit.route_details}</span>
                                                            </p>

                                                            {/* Transit Features */}
                                                            {transit.features && (
                                                                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                                                    {transit.features.map((feat, fidx) => (
                                                                        <span key={fidx} className="text-[10px] text-odyssey-slate dark:text-odyssey-tan bg-slate-100 dark:bg-odyssey-navy/80 px-2 py-0.5 rounded-md border border-odyssey-tan/40/50 dark:border-odyssey-brown/50/50 flex items-center gap-1">
                                                                            <Check className="w-2.5 h-2.5 text-emerald-500" />
                                                                            <span>{feat}</span>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Price & Book CTA */}
                                                        <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-odyssey-tan/30 dark:border-odyssey-brown/50 flex-shrink-0">
                                                            <div className="text-left sm:text-right">
                                                                <div className="flex items-baseline gap-1 sm:justify-end">
                                                                    <span className="text-base sm:text-lg font-black text-odyssey-navy dark:text-odyssey-cream">
                                                                        ₹{transit.price_per_person.toLocaleString()}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">/ person ({transit.mode === 'Flight' ? 'Round-trip' : 'Return'})</span>
                                                                </div>
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">
                                                                    ₹{(transit.price_per_person * editForm.travelers).toLocaleString()} total ({editForm.travelers} pax)
                                                                </span>
                                                            </div>

                                                            {/* Direct Search / Booking Link */}
                                                            {transit.booking_url && (
                                                                <a
                                                                    href={transit.booking_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title={`Search live ${transit.mode} tickets`}
                                                                    className="p-2 rounded-xl bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-slate dark:text-odyssey-tan transition-colors"
                                                                >
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </a>
                                                            )}

                                                            {/* Select / Book Ticket Button */}
                                                            <button
                                                                onClick={() => handleSimulatedTransitBooking(transit)}
                                                                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95 touch-manipulation cursor-pointer ${
                                                                    isSelected
                                                                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sky-500/25 ring-2 ring-sky-400/50'
                                                                        : 'bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-navy dark:text-odyssey-cream'
                                                                }`}
                                                            >
                                                                <span>{isSelected ? `Selected` : `Book ${transit.mode}`}</span>
                                                                <ArrowRight className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* 🏨 HOTEL & STAY PRICE COMPARISON CARD */}
                                {accommodation && (
                                    <div 
                                        id="hotel-price-comparison-card"
                                        className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 dark:from-[#151D30] dark:via-[#131B2E] dark:to-[#171A26] rounded-3xl p-4 sm:p-5 border-2 border-odyssey-tan/40 dark:border-odyssey-brown/50 shadow-lg shadow-orange-500/5 space-y-4 transition-all"
                                    >
                                        {/* Card Header & Recommended Hotel Info */}
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-orange-100 dark:border-odyssey-brown/50/80 pb-3.5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy text-white flex items-center gap-1 shadow-xs">
                                                        <Building2 className="w-3 h-3" />
                                                        <span>AI Hotel Match</span>
                                                    </span>
                                                    <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200/50 dark:border-amber-900/50">
                                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                        <span>{accommodation.rating || 4.8} / 5.0</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-sm sm:text-base font-extrabold text-odyssey-navy dark:text-odyssey-cream leading-snug">
                                                    {accommodation.hotel_name}
                                                </h3>
                                                <p className="text-[11px] text-odyssey-slate dark:text-odyssey-tan flex items-center gap-1 font-medium">
                                                    <MapPin className="w-3 h-3 text-odyssey-brown dark:text-odyssey-tan" />
                                                    <span>{accommodation.location || trip.location}</span>
                                                    <span>•</span>
                                                    <span className="text-odyssey-slate dark:text-odyssey-tan font-semibold">{accommodation.room_type || 'Deluxe Room'}</span>
                                                </p>
                                            </div>

                                            <div className="text-left sm:text-right flex-shrink-0">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Est. Total Stay
                                                </span>
                                                <span className="text-base sm:text-lg font-black text-odyssey-brown dark:text-odyssey-tan">
                                                    ₹{costs.hotels.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-slate-400 block">
                                                    for {editForm.totalDays} Nights
                                                </span>
                                            </div>
                                        </div>

                                        {/* Hotel Amenities Tags */}
                                        {accommodation.amenities && (
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {accommodation.amenities.map((amenity, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-odyssey-navy text-odyssey-slate dark:text-odyssey-tan border border-odyssey-tan/40/60 dark:border-odyssey-brown/50/60 flex items-center gap-1"
                                                    >
                                                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                                        <span>{amenity}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* 3-Platform Comparison List */}
                                        <div className="space-y-2 pt-1">
                                            <div className="flex items-center justify-between px-1">
                                                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-odyssey-slate dark:text-odyssey-tan uppercase tracking-wider">
                                                    <Tag className="w-3 h-3 text-odyssey-brown dark:text-odyssey-tan" />
                                                    <span>Live Grounded Price Comparison (3 Providers)</span>
                                                </div>
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                                    <span>Google Search Grounded</span>
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                {hotelComparisons.map((item, idx) => {
                                                    const isCheapest = item.is_cheapest || idx === 0;
                                                    const totalStay = item.price_per_night * editForm.totalDays;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                                                isCheapest
                                                                    ? 'bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/80 dark:from-emerald-950/30 dark:via-[#152033] dark:to-teal-950/20 border-emerald-400 dark:border-emerald-500/60 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                                                                    : 'bg-white dark:bg-odyssey-navy/90 border-odyssey-tan/40/90 dark:border-odyssey-brown/50 hover:border-odyssey-tan/60 dark:hover:border-slate-700'
                                                            }`}
                                                        >
                                                            {/* Platform Brand & Perks */}
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-extrabold text-sm text-odyssey-navy dark:text-odyssey-cream flex items-center gap-1.5">
                                                                        {item.platform_name === 'Agoda' && (
                                                                            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 via-amber-500 to-sky-500 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                                                                                a
                                                                            </span>
                                                                        )}
                                                                        {item.platform_name === 'Booking.com' && (
                                                                            <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                                                                                B.
                                                                            </span>
                                                                        )}
                                                                        {item.platform_name === 'Expedia' && (
                                                                            <span className="w-5 h-5 rounded-full bg-amber-400 text-odyssey-navy font-black text-[10px] flex items-center justify-center shadow-xs">
                                                                                E
                                                                            </span>
                                                                        )}
                                                                        <span>{item.platform_name}</span>
                                                                    </span>

                                                                    {/* Cheapest / Best Deal Badge */}
                                                                    {isCheapest && (
                                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-xs flex items-center gap-0.5">
                                                                            <span>★</span>
                                                                            <span>LOWEST RATE</span>
                                                                        </span>
                                                                    )}

                                                                    {item.discount_badge && !isCheapest && (
                                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-odyssey-navy text-odyssey-slate dark:text-odyssey-tan">
                                                                            {item.discount_badge}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p className="text-[11px] text-odyssey-slate dark:text-odyssey-tan flex items-center gap-1">
                                                                    <span className={isCheapest ? 'text-emerald-700 dark:text-emerald-300 font-semibold' : ''}>
                                                                        ✓ {item.booking_perk || 'Instant confirmation'}
                                                                    </span>
                                                                </p>
                                                            </div>

                                                            {/* Price Breakdown & Actions */}
                                                            <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-odyssey-tan/30 dark:border-odyssey-brown/50">
                                                                <div className="text-left sm:text-right">
                                                                    <div className="flex items-baseline gap-1 sm:justify-end">
                                                                        <span className={`text-base sm:text-lg font-black ${
                                                                            isCheapest ? 'text-emerald-600 dark:text-emerald-400' : 'text-odyssey-navy dark:text-odyssey-cream'
                                                                        }`}>
                                                                            ₹{item.price_per_night.toLocaleString()}
                                                                        </span>
                                                                        <span className="text-[10px] text-slate-400 font-medium">/ night</span>
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-400 block">
                                                                        ₹{totalStay.toLocaleString()} total ({editForm.totalDays}N)
                                                                    </span>
                                                                </div>

                                                                {/* Direct Real-Time Search Link */}
                                                                {item.direct_url && (
                                                                    <a
                                                                        href={item.direct_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        title={`Search live on ${item.platform_name}`}
                                                                        className="p-2 rounded-xl bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-slate dark:text-odyssey-tan transition-colors"
                                                                    >
                                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                                    </a>
                                                                )}

                                                                {/* Prominent Highlighted "Book Now" Button */}
                                                                <button
                                                                    onClick={() => handleSimulatedHotelBooking(item, item.price_per_night, totalStay)}
                                                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95 touch-manipulation cursor-pointer ${
                                                                        isCheapest
                                                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/50 hover:shadow-md'
                                                                            : 'bg-slate-100 dark:bg-odyssey-navy hover:bg-slate-200 dark:hover:bg-slate-700 text-odyssey-navy dark:text-odyssey-cream'
                                                                    }`}
                                                                >
                                                                    <span>{isCheapest ? 'Book Now' : 'Select'}</span>
                                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Smart Suggestions: Packing, Etiquette, Hidden Gems */}
                                {suggestions && (
                                    <div className="space-y-3 pt-1">
                                        {/* Packing Tips */}
                                        <div className="space-y-1.5">
                                            <h4 className="text-xs font-bold text-odyssey-slate dark:text-odyssey-tan flex items-center gap-1.5">
                                                <Luggage className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                                                <span>Smart Packing Checklist</span>
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                {suggestions.packingTips.map((tip, idx) => (
                                                    <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-odyssey-navy border border-odyssey-tan/40/80 dark:border-odyssey-brown/50 text-[11px] font-medium text-odyssey-slate dark:text-odyssey-tan flex items-center gap-2">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                        <span>{tip}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Local Etiquette */}
                                        <div className="space-y-1.5">
                                            <h4 className="text-xs font-bold text-odyssey-slate dark:text-odyssey-tan flex items-center gap-1.5">
                                                <Shield className="w-3.5 h-3.5 text-sky-500" />
                                                <span>Local Etiquette & Customs</span>
                                            </h4>
                                            <div className="space-y-1">
                                                {suggestions.localEtiquette.map((etq, idx) => (
                                                    <div key={idx} className="p-2 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 text-[11px] text-sky-900 dark:text-sky-200 leading-snug">
                                                        • {etq}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Hidden Gems */}
                                        <div className="space-y-1.5">
                                            <h4 className="text-xs font-bold text-odyssey-slate dark:text-odyssey-tan flex items-center gap-1.5">
                                                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                                <span>Hidden Gems & Local Secrets</span>
                                            </h4>
                                            <div className="space-y-1">
                                                {suggestions.hiddenGems.map((gem, idx) => (
                                                    <div key={idx} className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
                                                        ✨ {gem}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Tab Content 2: Day-Wise Stops */}
                {activeTab === 'itinerary' && (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {trip.itinerary && trip.itinerary.length > 0 ? (
                            trip.itinerary.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 rounded-2xl bg-slate-50 dark:bg-odyssey-navy border border-odyssey-tan/40 dark:border-odyssey-brown/50 flex items-center justify-between text-xs"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-sm">{item.icon || '📍'}</span>
                                        <div>
                                            <p className="font-bold text-odyssey-navy dark:text-odyssey-cream">{item.title}</p>
                                            <p className="text-[10px] text-slate-400">
                                                ⏰ {item.startTime || item.time || '09:00 AM'} – {item.endTime || '11:00 AM'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-odyssey-navy text-odyssey-slate dark:text-odyssey-tan border border-odyssey-tan/40 dark:border-odyssey-brown/50">
                                        {item.category || 'Stop'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-6 text-center text-xs text-slate-400">
                                No custom stops added yet. Use "Add Stop" in Itinerary section.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TripDetailsModal;

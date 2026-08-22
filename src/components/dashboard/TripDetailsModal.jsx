import React, { useState, useEffect } from 'react';
import { X, Sparkles, DollarSign, CheckCircle2, Luggage, Shield, Compass, Clock, MapPin, Calendar, Users, Loader2, ArrowRight, Lightbulb } from 'lucide-react';
import { generateGeminiTripBreakdown } from '../../services/geminiService';

export function TripDetailsModal({
    trip,
    isOpen,
    onClose,
    onUpdateTrip
}) {
    const [activeTab, setActiveTab] = useState('gemini_ai'); // 'gemini_ai' | 'itinerary'
    const [aiData, setAiData] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);

    useEffect(() => {
        if (!isOpen || !trip) return;

        let isMounted = true;
        setLoadingAi(true);

        generateGeminiTripBreakdown({
            destination: trip.location || trip.title,
            totalDays: trip.totalDays || 3,
            travelers: trip.travelers || 2,
            vibe: trip.vibe || 'Adventure & Relaxation'
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
    }, [isOpen, trip]);

    if (!isOpen || !trip) return null;

    const costs = aiData?.costs || { flights: 8500, hotels: 14000, food: 6500, activities: 4500, total: 33500 };
    const suggestions = aiData?.smartSuggestions;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#131B2E] rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                {trip.title}
                            </h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#F06536]">
                                {trip.vibe || 'Odyssey Plan'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <span>📍 {trip.location}</span>
                            <span>•</span>
                            <span>📅 {trip.dates}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        aria-label="Close dialog"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Sub Tab Navigation */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('gemini_ai')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'gemini_ai'
                                ? 'bg-white dark:bg-[#131B2E] text-[#F06536] shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#F06536]" />
                        <span>Gemini AI Insights & Cost</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('itinerary')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'itinerary'
                                ? 'bg-white dark:bg-[#131B2E] text-[#F06536] shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5 text-[#F06536]" />
                        <span>Day-Wise Stops ({trip.activitiesCount || 4})</span>
                    </button>
                </div>

                {/* Tab Content 1: Gemini AI Cost Breakdown & Smart Suggestions */}
                {activeTab === 'gemini_ai' && (
                    <div className="space-y-4">
                        {loadingAi ? (
                            <div className="py-12 text-center space-y-2">
                                <Loader2 className="w-6 h-6 animate-spin text-[#F06536] mx-auto" />
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Gemini AI is analyzing cost breakdown & smart suggestions...
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Estimated Cost Breakdown Section */}
                                <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                                                ₹
                                            </div>
                                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                                Estimated Trip Costs (Gemini AI)
                                            </h3>
                                        </div>
                                        <span className="text-xs font-extrabold text-[#F06536]">
                                            Total: ₹{costs.total.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Cost Breakdown Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        <div className="bg-white dark:bg-[#131B2E] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Flights/Transit</p>
                                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">₹{costs.flights.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white dark:bg-[#131B2E] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Hotels/Stays</p>
                                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">₹{costs.hotels.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white dark:bg-[#131B2E] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Food & Dining</p>
                                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">₹{costs.food.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white dark:bg-[#131B2E] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Activities</p>
                                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">₹{costs.activities.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Smart Suggestions: Packing, Etiquette, Hidden Gems */}
                                {suggestions && (
                                    <div className="space-y-3">
                                        {/* Packing Tips */}
                                        <div className="space-y-1.5">
                                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <Luggage className="w-3.5 h-3.5 text-[#F06536]" />
                                                <span>Smart Packing Checklist</span>
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                {suggestions.packingTips.map((tip, idx) => (
                                                    <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                        <span>{tip}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Local Etiquette */}
                                        <div className="space-y-1.5">
                                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
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
                                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
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
                                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-sm">{item.icon || '📍'}</span>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                                            <p className="text-[10px] text-slate-400">
                                                ⏰ {item.startTime || item.time || '09:00 AM'} – {item.endTime || '11:00 AM'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
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

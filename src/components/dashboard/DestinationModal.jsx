import React from 'react';
import { X, Star, MapPin, Calendar, Compass, ArrowRight, Sparkles, Check } from 'lucide-react';

export function DestinationModal({
    destination,
    isOpen,
    onClose,
    onPlanTripWithDestination
}) {
    if (!isOpen || !destination) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-0 animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Hero Image */}
                <div className="relative h-56 sm:h-64 bg-stone-900">
                    <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Top Tag */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F06536] text-white shadow-md">
                            {destination.badge || 'Popular Destination'}
                        </span>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-extrabold tracking-tight">
                                {destination.name}
                            </h3>
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-xl text-amber-300 font-bold text-xs">
                                <Star className="w-3.5 h-3.5 fill-amber-300" />
                                <span>{destination.rating}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/80 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#F06536]" />
                            <span>{destination.region}</span>
                            <span>•</span>
                            <span>Best in {destination.bestTime || 'Autumn – Spring'}</span>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-4">
                    {/* Description */}
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                            About Destination
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                            {destination.description}
                        </p>
                    </div>

                    {/* Highlights */}
                    {destination.highlights && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                                Odyssey Highlights
                            </h4>
                            <div className="space-y-1.5">
                                {destination.highlights.map((h, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-2.5 h-2.5" />
                                        </div>
                                        <span className="font-semibold">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-2">
                        <button
                            onClick={() => {
                                onPlanTripWithDestination(destination);
                                onClose();
                            }}
                            className="w-full bg-[#F06536] hover:bg-[#E05325] active:scale-[0.99] text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-[#F06536]/25 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Plan Trip to {destination.name}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

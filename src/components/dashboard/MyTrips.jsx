import React from 'react';
import { Plus, MapPin, Calendar, Users, ArrowRight, Compass, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import goaImg from '../../assets/goa_streets.jpg';
import manaliImg from '../../assets/odyssey-mountains.jpg';

export function MyTrips({
    trips = [],
    onOpenCreateModal,
    onSelectTrip
}) {
    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header with Create Trip CTA */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#181A20] tracking-tight">
                        My Trips
                    </h2>
                    <p className="text-xs text-stone-500">
                        Manage your active itineraries & journeys.
                    </p>
                </div>

                <button
                    onClick={onOpenCreateModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F06536] hover:bg-[#E05325] active:scale-95 text-white text-xs font-semibold shadow-md shadow-[#F06536]/20 transition-all duration-150 touch-manipulation"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Trip</span>
                </button>
            </div>

            {/* Trips List / Cards */}
            {trips.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-3xl p-7 text-center border border-dashed border-stone-300 space-y-3 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F06536] mx-auto flex items-center justify-center">
                        <Compass className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-stone-800">
                            Your next adventure starts here.
                        </h3>
                        <p className="text-xs text-stone-500 max-w-xs mx-auto">
                            Pick a destination, choose dates, and let Odyssey craft your personalized day-wise itinerary.
                        </p>
                    </div>
                    <button
                        onClick={onOpenCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F06536] hover:bg-[#E05325] text-white text-xs font-semibold shadow-md shadow-[#F06536]/20 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create your first trip</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-3.5">
                    {trips.map((trip) => {
                        const progressPercent = trip.totalDays
                            ? Math.min(100, Math.round((trip.currentDay / trip.totalDays) * 100))
                            : 0;

                        return (
                            <div
                                key={trip.id}
                                onClick={() => onSelectTrip?.(trip)}
                                className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-200 cursor-pointer space-y-3.5 group"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    {/* Left Details */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base sm:text-lg font-bold text-[#181A20] tracking-tight group-hover:text-[#F06536] transition-colors">
                                                {trip.title}
                                            </h3>
                                            {trip.status === 'in_progress' && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Active
                                                </span>
                                            )}
                                            {trip.status === 'upcoming' && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                    Upcoming
                                                </span>
                                            )}
                                        </div>

                                        {/* Metadata Row */}
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-stone-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 text-[#F06536]" />
                                                <span className="font-medium text-stone-700">{trip.location}</span>
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                                <span>{trip.dates}</span>
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5 text-stone-400" />
                                                <span>{trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Activity & Days Summary Badge */}
                                    <div className="text-left sm:text-right flex-shrink-0">
                                        <p className="text-xs font-semibold text-stone-800">
                                            {trip.totalDays} days • {trip.activitiesCount} activities
                                        </p>
                                        <p className="text-[11px] text-stone-400">
                                            {trip.vibe || '🌴 Adventure & Relaxation'}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar / Timeline */}
                                <div className="space-y-1.5 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-[#F06536]" />
                                            {trip.progressLabel || (trip.status === 'in_progress' ? `Day ${trip.currentDay} of ${trip.totalDays}` : `Upcoming in ${trip.daysRemaining || 18} days`)}
                                        </span>
                                        <span className="text-[11px] font-bold text-stone-500">
                                            {trip.status === 'in_progress' ? `${progressPercent}% complete` : 'Ready to depart'}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-stone-200/80 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#F06536] to-amber-500 rounded-full transition-all duration-500"
                                            style={{ width: `${trip.status === 'in_progress' ? progressPercent : 15}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Bottom Action */}
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-stone-400 font-medium">
                                        Cloud Synced ✓
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectTrip?.(trip);
                                        }}
                                        className="text-xs font-bold text-[#F06536] hover:text-[#E05325] flex items-center gap-1.5 group-hover:underline underline-offset-2 transition-all"
                                    >
                                        <span>Continue Planning</span>
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

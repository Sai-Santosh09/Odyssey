import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Users, ArrowRight, Compass, Sparkles, CheckCircle2, Clock, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { CancelTripModal } from './CancelTripModal';

export function MyTrips({
    trips = [],
    onOpenCreateModal,
    onSelectTrip,
    onCancelTrip,
    onRestoreTrip
}) {
    const [selectedTripToCancel, setSelectedTripToCancel] = useState(null);
    const [showCancelled, setShowCancelled] = useState(false);

    const activeOrUpcomingTrips = trips.filter((t) => t.status !== 'cancelled');
    const cancelledTrips = trips.filter((t) => t.status === 'cancelled');

    const displayedTrips = showCancelled ? trips : activeOrUpcomingTrips;

    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header with Create Trip CTA */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            My Trips
                        </h2>
                        {cancelledTrips.length > 0 && (
                            <button
                                onClick={() => setShowCancelled(!showCancelled)}
                                className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-[#F06536] underline"
                            >
                                {showCancelled ? 'Hide Cancelled' : `Show Cancelled (${cancelledTrips.length})`}
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
            {displayedTrips.length === 0 ? (
                /* Empty State */
                <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-7 text-center border border-dashed border-slate-300 dark:border-slate-700 space-y-3 shadow-sm transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#F06536] mx-auto flex items-center justify-center">
                        <Compass className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Your next adventure starts here.
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
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
                    {displayedTrips.map((trip) => {
                        const isCancelled = trip.status === 'cancelled';
                        const progressPercent = trip.totalDays
                            ? Math.min(100, Math.round((trip.currentDay / trip.totalDays) * 100))
                            : 0;

                        return (
                            <div
                                key={trip.id}
                                onClick={() => !isCancelled && onSelectTrip?.(trip)}
                                className={`bg-white dark:bg-[#131B2E] rounded-3xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer space-y-3.5 group ${
                                    isCancelled
                                        ? 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50 dark:bg-slate-900/30'
                                        : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    {/* Left Details */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                                                isCancelled
                                                    ? 'line-through text-slate-400'
                                                    : 'text-slate-900 dark:text-white group-hover:text-[#F06536]'
                                            }`}>
                                                {trip.title}
                                            </h3>
                                            {trip.status === 'in_progress' && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Active
                                                </span>
                                            )}
                                            {trip.status === 'upcoming' && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                                    Upcoming
                                                </span>
                                            )}
                                            {trip.status === 'cancelled' && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                                    Cancelled
                                                </span>
                                            )}
                                        </div>

                                        {/* Metadata Row */}
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 text-[#F06536]" />
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{trip.location}</span>
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{trip.dates}</span>
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Activity & Days Summary Badge */}
                                    <div className="text-left sm:text-right flex-shrink-0">
                                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                            {trip.totalDays} days • {trip.activitiesCount} activities
                                        </p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                            {trip.vibe || '🌴 Adventure & Relaxation'}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar / Timeline */}
                                {!isCancelled && (
                                    <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-[#F06536]" />
                                                {trip.progressLabel || (trip.status === 'in_progress' ? `Day ${trip.currentDay} of ${trip.totalDays}` : `Upcoming in ${trip.daysRemaining || 18} days`)}
                                            </span>
                                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                {trip.status === 'in_progress' ? `${progressPercent}% complete` : 'Ready to depart'}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#F06536] to-amber-500 rounded-full transition-all duration-500"
                                                style={{ width: `${trip.status === 'in_progress' ? progressPercent : 15}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Action Buttons */}
                                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                                    {/* Left: Cancellation / Restore Action */}
                                    {isCancelled ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRestoreTrip?.(trip.id);
                                            }}
                                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span>Restore Trip</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTripToCancel(trip);
                                            }}
                                            className="text-xs font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            <span>Cancel Trip</span>
                                        </button>
                                    )}

                                    {/* Right: Continue Planning CTA */}
                                    {!isCancelled && (
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
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Cancel Confirmation Dialog */}
            <CancelTripModal
                isOpen={!!selectedTripToCancel}
                trip={selectedTripToCancel}
                onClose={() => setSelectedTripToCancel(null)}
                onConfirmCancel={(id) => onCancelTrip?.(id)}
            />
        </section>
    );
}

import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Users, ArrowRight, Compass, Clock, XCircle, RotateCcw, Edit3, Minus } from 'lucide-react';
import { CancelTripModal } from './CancelTripModal';

export function MyTrips({
    trips = [],
    onOpenCreateModal,
    onSelectTrip,
    onCancelTrip,
    onRestoreTrip,
    onUpdateTrip
}) {
    const [selectedTripToCancel, setSelectedTripToCancel] = useState(null);
    const [showCancelled, setShowCancelled] = useState(false);

    const activeOrUpcomingTrips = trips.filter((t) => t.status !== 'cancelled');
    const cancelledTrips = trips.filter((t) => t.status === 'cancelled');

    const displayedTrips = showCancelled ? trips : activeOrUpcomingTrips;

    const handleTravelerCountChange = (e, trip, delta) => {
        e.stopPropagation();
        const currentCount = trip.travelers || 2;
        const newCount = Math.max(1, Math.min(20, currentCount + delta));
        if (newCount !== currentCount && onUpdateTrip) {
            onUpdateTrip({
                ...trip,
                travelers: newCount
            });
        }
    };

    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header with Create Trip CTA */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-odyssey-navy dark:text-odyssey-cream tracking-tight">
                            My Trips
                        </h2>
                        {cancelledTrips.length > 0 && (
                            <button
                                onClick={() => setShowCancelled(!showCancelled)}
                                className="text-[11px] font-semibold text-odyssey-slate dark:text-odyssey-tan hover:text-odyssey-brown dark:text-odyssey-tan underline"
                            >
                                {showCancelled ? 'Hide Cancelled' : `Show Cancelled (${cancelledTrips.length})`}
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-odyssey-slate dark:text-odyssey-tan">
                        Manage your active itineraries, dates & number of travelers.
                    </p>
                </div>

                <button
                    onClick={onOpenCreateModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy hover:opacity-90 active:scale-95 text-white text-xs font-semibold shadow-md shadow-[#F06536]/20 transition-all duration-150 touch-manipulation cursor-pointer"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Trip</span>
                </button>
            </div>

            {/* Trips List / Cards */}
            {displayedTrips.length === 0 ? (
                /* Empty State */
                <div className="bg-white dark:bg-odyssey-slate rounded-3xl p-7 text-center border border-dashed border-odyssey-tan/60 dark:border-odyssey-brown/50 space-y-3 shadow-sm transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-odyssey-cream/60 dark:bg-odyssey-navy dark:bg-odyssey-navy text-odyssey-brown dark:text-odyssey-tan mx-auto flex items-center justify-center">
                        <Compass className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-odyssey-navy dark:text-odyssey-cream">
                            Your next adventure starts here.
                        </h3>
                        <p className="text-xs text-odyssey-slate dark:text-odyssey-tan max-w-xs mx-auto">
                            Pick a destination, choose dates, adjust traveler count, and let Odyssey craft your personalized itinerary.
                        </p>
                    </div>
                    <button
                        onClick={onOpenCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy hover:opacity-90 text-white text-xs font-semibold shadow-md shadow-[#F06536]/20 transition-colors cursor-pointer"
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
                        const travelers = trip.travelers || 2;

                        return (
                            <div
                                key={trip.id}
                                onClick={() => !isCancelled && onSelectTrip?.(trip)}
                                className={`bg-white dark:bg-odyssey-slate rounded-3xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer space-y-3.5 group ${
                                    isCancelled
                                        ? 'border-odyssey-tan/40 dark:border-odyssey-brown/50 opacity-60 bg-slate-50/50 dark:bg-odyssey-navy/30'
                                        : 'border-odyssey-tan/40 dark:border-odyssey-brown/50 shadow-sm hover:shadow-lg hover:border-odyssey-tan/40 dark:hover:border-orange-900'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    {/* Left Details */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                                                isCancelled
                                                    ? 'line-through text-slate-400'
                                                    : 'text-odyssey-navy dark:text-odyssey-cream group-hover:text-odyssey-brown dark:text-odyssey-tan'
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

                                        {/* Metadata Row with Interactive Quick-Traveler Stepper */}
                                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-odyssey-slate dark:text-odyssey-tan">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                                                <span className="font-medium text-odyssey-slate dark:text-odyssey-tan">{trip.location}</span>
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{trip.dates}</span>
                                            </span>
                                            <span>•</span>
                                            
                                            {/* Interactive Traveler Count Stepper */}
                                            {!isCancelled ? (
                                                <div 
                                                    onClick={(e) => e.stopPropagation()} 
                                                    className="flex items-center gap-1 bg-slate-100 dark:bg-odyssey-navy px-2 py-0.5 rounded-lg border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-odyssey-slate dark:text-odyssey-tan font-semibold"
                                                    title="Adjust number of travelers"
                                                >
                                                    <Users className="w-3 h-3 text-odyssey-brown dark:text-odyssey-tan" />
                                                    <span>{travelers} {travelers === 1 ? 'person' : 'people'}</span>
                                                    <div className="flex items-center gap-0.5 ml-1 border-l border-odyssey-tan/60 dark:border-slate-600 pl-1">
                                                        <button
                                                            type="button"
                                                            disabled={travelers <= 1}
                                                            onClick={(e) => handleTravelerCountChange(e, trip, -1)}
                                                            className="w-4 h-4 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-odyssey-slate dark:text-odyssey-tan disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                            title="Decrease travelers"
                                                        >
                                                            <Minus className="w-2.5 h-2.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={travelers >= 20}
                                                            onClick={(e) => handleTravelerCountChange(e, trip, 1)}
                                                            className="w-4 h-4 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-odyssey-slate dark:text-odyssey-tan disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                            title="Increase travelers"
                                                        >
                                                            <Plus className="w-2.5 h-2.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{travelers} {travelers === 1 ? 'traveler' : 'travelers'}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Activity & Days Summary Badge */}
                                    <div className="text-left sm:text-right flex-shrink-0">
                                        <p className="text-xs font-semibold text-odyssey-navy dark:text-odyssey-cream">
                                            {trip.totalDays} days • {trip.activitiesCount} activities
                                        </p>
                                        <p className="text-[11px] text-slate-400 dark:text-odyssey-tan/80">
                                            {trip.vibe || '🌴 Adventure & Relaxation'}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar / Timeline */}
                                {!isCancelled && (
                                    <div className="space-y-1.5 bg-slate-50 dark:bg-odyssey-navy/60 p-3 rounded-2xl border border-odyssey-tan/30 dark:border-odyssey-brown/50">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-odyssey-slate dark:text-odyssey-tan flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                                                {trip.progressLabel || (trip.status === 'in_progress' ? `Day ${trip.currentDay} of ${trip.totalDays}` : `Upcoming in ${trip.daysRemaining || 18} days`)}
                                            </span>
                                            <span className="text-[11px] font-bold text-odyssey-slate dark:text-odyssey-tan">
                                                {trip.status === 'in_progress' ? `${progressPercent}% complete` : 'Ready to depart'}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200/80 dark:bg-odyssey-navy rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#F06536] to-amber-500 rounded-full transition-all duration-500"
                                                style={{ width: `${trip.status === 'in_progress' ? progressPercent : 15}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Action Buttons */}
                                <div className="flex items-center justify-between pt-1 border-t border-odyssey-tan/30 dark:border-odyssey-brown/50">
                                    {/* Left: Cancellation / Restore Action */}
                                    {isCancelled ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRestoreTrip?.(trip.id);
                                            }}
                                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
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
                                            className="text-xs font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            <span>Cancel Trip</span>
                                        </button>
                                    )}

                                    {/* Right: Edit & Continue Planning CTAs */}
                                    {!isCancelled && (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectTrip?.(trip);
                                                }}
                                                className="text-xs font-medium text-odyssey-slate dark:text-odyssey-tan hover:text-odyssey-brown dark:text-odyssey-tan flex items-center gap-1 transition-colors cursor-pointer"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>Edit Details</span>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectTrip?.(trip);
                                                }}
                                                className="text-xs font-bold text-odyssey-brown dark:text-odyssey-tan hover:text-odyssey-brown dark:text-odyssey-tan flex items-center gap-1.5 group-hover:underline underline-offset-2 transition-all cursor-pointer"
                                            >
                                                <span>View Odyssey</span>
                                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </div>
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

export default MyTrips;

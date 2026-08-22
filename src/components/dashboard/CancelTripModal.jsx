import React from 'react';
import { X, AlertTriangle, Luggage } from 'lucide-react';

export function CancelTripModal({
    isOpen,
    trip,
    onClose,
    onConfirmCancel
}) {
    if (!isOpen || !trip) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#131B2E] rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 transition-colors">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Cancel Odyssey Trip?
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                        Are you sure you want to cancel your planned journey to <strong className="text-slate-900 dark:text-white">{trip.title}</strong> ({trip.dates})?
                    </p>
                    <p className="text-[11px] text-slate-400">
                        Your itinerary and notes will be marked as cancelled. You can restore this trip anytime from your trips list.
                    </p>
                </div>

                <div className="pt-2 flex gap-2.5">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors"
                    >
                        Keep Trip
                    </button>
                    <button
                        onClick={() => {
                            onConfirmCancel(trip.id);
                            onClose();
                        }}
                        className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-colors"
                    >
                        Yes, Cancel Trip
                    </button>
                </div>
            </div>
        </div>
    );
}

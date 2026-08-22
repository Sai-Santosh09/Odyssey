import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
    if (!toast) return null;

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] sm:max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
            <div className="bg-[#181A20]/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                    {(!toast.type || toast.type === 'info') && <Info className="w-4 h-4 text-[#F06536] flex-shrink-0" />}
                    <p className="text-xs sm:text-sm font-medium text-stone-100">{toast.message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-stone-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

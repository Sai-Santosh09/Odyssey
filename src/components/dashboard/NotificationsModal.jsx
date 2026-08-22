import React from 'react';
import { X, Bell, Cloud, Calendar, Sparkles, CheckCheck } from 'lucide-react';

const SAMPLE_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Trip Synced to Cloud ☁️',
        desc: 'Goa Escape itinerary was successfully synchronized across devices.',
        time: '5 mins ago',
        unread: true,
        type: 'sync'
    },
    {
        id: 2,
        title: 'Sunset Weather Alert 🌅',
        desc: 'Clear skies expected at 04:30 PM for Chapora Fort panoramic views.',
        time: '1 hour ago',
        unread: true,
        type: 'weather'
    },
    {
        id: 3,
        title: 'Personalized Pick for You ✨',
        desc: 'We added Mountain Trekking to your recommendations based on past trips.',
        time: 'Yesterday',
        unread: false,
        type: 'recommendation'
    }
];

export function NotificationsModal({ isOpen, onClose, onClearAll }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-stone-200 p-5 space-y-4 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-orange-50 text-[#F06536] flex items-center justify-center">
                            <Bell className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-stone-900">
                            Notifications
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Notifications list */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {SAMPLE_NOTIFICATIONS.map((n) => (
                        <div
                            key={n.id}
                            className={`p-3 rounded-2xl border transition-all text-xs ${
                                n.unread
                                    ? 'bg-orange-50/40 border-[#F06536]/30 shadow-xs'
                                    : 'bg-stone-50 border-stone-100 opacity-80'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-stone-900">{n.title}</h4>
                                <span className="text-[10px] text-stone-400">{n.time}</span>
                            </div>
                            <p className="text-stone-600 mt-1 leading-snug">{n.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Clear action */}
                <button
                    onClick={() => {
                        onClearAll?.();
                        onClose();
                    }}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors"
                >
                    Mark all as read
                </button>
            </div>
        </div>
    );
}

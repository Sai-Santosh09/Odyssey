import React, { useState } from 'react';
import { Calendar, Clock, Check, Plus, ArrowRight, Sparkles, MapPin, GripVertical, CheckCircle2 } from 'lucide-react';

const INITIAL_ACTIVITIES = [
    { id: 1, time: '09:00 AM', title: 'Breakfast at a local café', subtitle: 'Fontainhas Portuguese bakery & espresso', icon: '☕', category: 'Food', completed: true },
    { id: 2, time: '11:00 AM', title: 'Baga Beach', subtitle: 'Parasailing, coastal breeze & swimming', icon: '🏖️', category: 'Relaxation', completed: false },
    { id: 3, time: '02:00 PM', title: 'Lunch', subtitle: 'Authentic coastal Goan fish curry & kokum', icon: '🍛', category: 'Dining', completed: false },
    { id: 4, time: '04:30 PM', title: 'Sunset Point', subtitle: 'Panoramic cliff views from Chapora Fort', icon: '🌅', category: 'Sightseeing', completed: false },
    { id: 5, time: '07:30 PM', title: 'Dinner', subtitle: 'Live acoustic music by the beach shack', icon: '🍽️', category: 'Nightlife', completed: false },
];

export function UpcomingItinerary({
    currentTripTitle = 'Goa Escape',
    dayTitle = 'Day 2 — Exploring Goa',
    onViewFullItinerary,
    onActivityUpdated
}) {
    const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
    const [isAddingActivity, setIsAddingActivity] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('06:00 PM');

    const toggleActivity = (id) => {
        const updated = activities.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        setActivities(updated);
        onActivityUpdated?.('Itinerary updated ✓');
    };

    const handleAddActivity = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        const newAct = {
            id: Date.now(),
            time: newTime,
            title: newTitle,
            subtitle: 'Added activity',
            icon: '✨',
            category: 'Custom',
            completed: false,
        };

        const updated = [...activities, newAct].sort((a, b) => a.time.localeCompare(b.time));
        setActivities(updated);
        setNewTitle('');
        setIsAddingActivity(false);
        onActivityUpdated?.('Activity added to itinerary ✓');
    };

    const completedCount = activities.filter((a) => a.completed).length;

    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#181A20] tracking-tight">
                        Your next adventure
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                        <span className="font-semibold text-[#F06536]">{dayTitle}</span>
                        <span>•</span>
                        <span>{completedCount}/{activities.length} done</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsAddingActivity(!isAddingActivity)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                >
                    <Plus className="w-3.5 h-3.5 text-[#F06536]" />
                    <span>Add Item</span>
                </button>
            </div>

            {/* Quick Add Inline Form */}
            {isAddingActivity && (
                <form
                    onSubmit={handleAddActivity}
                    className="bg-white p-3.5 rounded-2xl border border-[#F06536]/40 shadow-md space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span>New Itinerary Activity</span>
                        <button
                            type="button"
                            onClick={() => setIsAddingActivity(false)}
                            className="text-stone-400 hover:text-stone-600"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                            type="text"
                            required
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Activity title (e.g. Scuba diving, Museum)..."
                            className="sm:col-span-2 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#F06536]"
                        />
                        <input
                            type="text"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            placeholder="Time (e.g. 04:00 PM)"
                            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#F06536]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#F06536] hover:bg-[#E05325] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                        Save to Itinerary
                    </button>
                </form>
            )}

            {/* Itinerary Timeline Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-sm space-y-3">
                {/* Timeline Items */}
                <div className="space-y-2.5 relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[39px] sm:left-[43px] top-4 bottom-4 w-0.5 bg-stone-100 z-0"></div>

                    {activities.map((item) => (
                        <div
                            key={item.id}
                            className={`relative z-10 flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-150 ${
                                item.completed
                                    ? 'bg-stone-50/60 opacity-60'
                                    : 'bg-stone-50 hover:bg-stone-100/80 border border-stone-100'
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                {/* Drag Grip Handle Icon */}
                                <div className="cursor-grab active:cursor-grabbing text-stone-300 hover:text-stone-500 hidden sm:block">
                                    <GripVertical className="w-3.5 h-3.5" />
                                </div>

                                {/* Time pill */}
                                <div className="px-2 py-1 bg-white rounded-lg border border-stone-200/80 text-[10px] sm:text-[11px] font-bold text-stone-700 whitespace-nowrap shadow-xs">
                                    {item.time}
                                </div>

                                {/* Icon + Text */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm">{item.icon}</span>
                                        <h4 className={`text-xs sm:text-sm font-bold truncate ${item.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                                            {item.title}
                                        </h4>
                                    </div>
                                    {item.subtitle && (
                                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                                            {item.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Checkbox completion trigger */}
                            <button
                                onClick={() => toggleActivity(item.id)}
                                className={`ml-2 p-1.5 rounded-xl border transition-all ${
                                    item.completed
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'bg-white border-stone-300 hover:border-[#F06536] text-transparent hover:text-stone-300'
                                }`}
                                aria-label="Mark completed"
                            >
                                <Check className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bottom View Full Itinerary Action */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-medium">
                        3-day plan for {currentTripTitle}
                    </span>
                    <button
                        onClick={onViewFullItinerary}
                        className="text-xs font-bold text-[#F06536] hover:text-[#E05325] flex items-center gap-1 hover:underline underline-offset-2 transition-colors"
                    >
                        <span>View Full Itinerary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </section>
    );
}

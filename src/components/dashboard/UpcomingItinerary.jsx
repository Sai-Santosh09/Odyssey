import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, Plus, ArrowRight, Sparkles, MapPin, GripVertical, CheckCircle2, Edit3, X, Compass } from 'lucide-react';

export function UpcomingItinerary({
    currentTrip,
    onOpenCreateTrip,
    onViewFullItinerary,
    onActivityUpdated
}) {
    const [activities, setActivities] = useState(() => currentTrip?.itinerary || []);
    const [isAddingActivity, setIsAddingActivity] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newStartTime, setNewStartTime] = useState('09:00 AM');
    const [newEndTime, setNewEndTime] = useState('10:30 AM');

    useEffect(() => {
        setActivities(currentTrip?.itinerary || []);
    }, [currentTrip]);

    if (!currentTrip) {
        return (
            <section className="space-y-3.5 pt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Upcoming Itinerary
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Day-by-day scheduled stops and timeline.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 text-center border border-dashed border-slate-300 dark:border-slate-700 space-y-2.5 shadow-sm transition-colors">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#F06536] mx-auto flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            No active itinerary
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                            Create a trip to view and manage your scheduled timeline and day stops.
                        </p>
                    </div>
                    {onOpenCreateTrip && (
                        <button
                            onClick={onOpenCreateTrip}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F06536] hover:bg-[#E05325] text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create a trip</span>
                        </button>
                    )}
                </div>
            </section>
        );
    }

    const currentTripTitle = currentTrip.title || currentTrip.location || 'Your Journey';
    const dayTitle = currentTrip.status === 'in_progress'
        ? `Day ${currentTrip.currentDay || 1} — Exploring ${currentTrip.location || currentTrip.title}`
        : `Day 1 — Arrival & Exploration`;

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
            startTime: newStartTime,
            endTime: newEndTime,
            title: newTitle,
            subtitle: 'Custom planned activity',
            icon: '✨',
            category: 'Custom',
            completed: false,
        };

        const updated = [...activities, newAct];
        setActivities(updated);
        setNewTitle('');
        setIsAddingActivity(false);
        onActivityUpdated?.('Activity added with time slot ✓');
    };

    const handleSaveTimeEdit = (e) => {
        e.preventDefault();
        if (!editingActivity) return;

        const updated = activities.map((act) =>
            act.id === editingActivity.id
                ? { ...act, startTime: editingActivity.startTime, endTime: editingActivity.endTime, title: editingActivity.title }
                : act
        );
        setActivities(updated);
        setEditingActivity(null);
        onActivityUpdated?.('Activity schedule updated ✓');
    };

    const completedCount = activities.filter((a) => a.completed).length;

    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Your next adventure
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-[#F06536]">{dayTitle}</span>
                        <span>•</span>
                        <span>{completedCount}/{activities.length} done</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsAddingActivity(!isAddingActivity)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                >
                    <Plus className="w-3.5 h-3.5 text-[#F06536]" />
                    <span>Add Stop</span>
                </button>
            </div>

            {/* Quick Add Inline Form with Time Selector */}
            {isAddingActivity && (
                <form
                    onSubmit={handleAddActivity}
                    className="bg-white dark:bg-[#131B2E] p-4 rounded-2xl border border-[#F06536]/40 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100">
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#F06536]" />
                            Schedule New Activity / Stop
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsAddingActivity(false)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Activity title (e.g. Visit local museum, beach walk)..."
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#F06536]"
                    />

                    {/* Start Time and End Time Selector */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                                Start Time
                            </label>
                            <input
                                type="text"
                                value={newStartTime}
                                onChange={(e) => setNewStartTime(e.target.value)}
                                placeholder="09:00 AM"
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-[#F06536]"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                                End Time
                            </label>
                            <input
                                type="text"
                                value={newEndTime}
                                onChange={(e) => setNewEndTime(e.target.value)}
                                placeholder="10:30 AM"
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-[#F06536]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 bg-[#F06536] hover:bg-[#E05325] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                        Save Activity Schedule
                    </button>
                </form>
            )}

            {/* Edit Activity Modal */}
            {editingActivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <form
                        onSubmit={handleSaveTimeEdit}
                        className="bg-white dark:bg-[#131B2E] rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-[#F06536]" />
                                Edit Time & Schedule
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditingActivity(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Activity Title</label>
                            <input
                                type="text"
                                value={editingActivity.title}
                                onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Start Time</label>
                                <input
                                    type="text"
                                    value={editingActivity.startTime}
                                    onChange={(e) => setEditingActivity({ ...editingActivity, startTime: e.target.value })}
                                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-semibold"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">End Time</label>
                                <input
                                    type="text"
                                    value={editingActivity.endTime}
                                    onChange={(e) => setEditingActivity({ ...editingActivity, endTime: e.target.value })}
                                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-semibold"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setEditingActivity(null)}
                                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2 bg-[#F06536] hover:bg-[#E05325] text-white text-xs font-bold rounded-xl shadow-xs"
                            >
                                Update Schedule
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Itinerary Timeline Card */}
            <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
                {/* Timeline Items */}
                {activities.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                        <p>No stops scheduled yet for this trip.</p>
                        <button
                            onClick={() => setIsAddingActivity(true)}
                            className="text-xs font-bold text-[#F06536] hover:underline"
                        >
                            + Add first stop
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2.5 relative">
                        {/* Vertical connecting line */}
                        <div className="absolute left-[39px] sm:left-[43px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800 z-0"></div>

                        {activities.map((item) => (
                            <div
                                key={item.id}
                                className={`relative z-10 flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-150 ${
                                    item.completed
                                        ? 'bg-slate-50/60 dark:bg-slate-900/30 opacity-60'
                                        : 'bg-slate-50 dark:bg-[#182238] hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800'
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    {/* Drag Grip Handle Icon */}
                                    <div className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 hidden sm:block">
                                        <GripVertical className="w-3.5 h-3.5" />
                                    </div>

                                    {/* Start and End Time Pill Selector */}
                                    <button
                                        onClick={() => setEditingActivity(item)}
                                        title="Click to edit start and end times"
                                        className="px-2 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap shadow-xs hover:border-[#F06536] transition-colors flex items-center gap-1 group/time"
                                    >
                                        <Clock className="w-3 h-3 text-[#F06536]" />
                                        <span>{item.startTime} – {item.endTime}</span>
                                        <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover/time:opacity-100 text-slate-400" />
                                    </button>

                                    {/* Icon + Text */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm">{item.icon || '📍'}</span>
                                            <h4 className={`text-xs sm:text-sm font-bold truncate ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                                                {item.title}
                                            </h4>
                                        </div>
                                        {item.subtitle && (
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
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
                                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-[#F06536] text-transparent hover:text-slate-300'
                                    }`}
                                    aria-label="Mark completed"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom View Full Itinerary Action */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {currentTrip.totalDays ? `${currentTrip.totalDays}-day plan for ${currentTripTitle}` : `Plan for ${currentTripTitle}`}
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

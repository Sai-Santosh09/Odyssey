import React from 'react';
import { Compass, Trophy, TrendingUp, MapPin, Calendar, Activity, Luggage, Sparkles } from 'lucide-react';

export function TravelInsights({
    stats = {
        trips: 0,
        places: 0,
        activities: 0,
        days: 0,
    }
}) {
    const totalActivities = stats.activities || 0;
    const categoryBreakdown = totalActivities > 0 ? [
        { name: 'Adventure', percent: 38, icon: '🏔️', color: 'from-orange-500 to-amber-500' },
        { name: 'Food & Dining', percent: 24, icon: '🍜', color: 'from-amber-500 to-yellow-400' },
        { name: 'Nature & Parks', percent: 20, icon: '🌲', color: 'from-emerald-500 to-teal-400' },
        { name: 'Culture & Arts', percent: 18, icon: '🏛️', color: 'from-sky-500 to-indigo-500' },
    ] : [
        { name: 'Adventure', percent: 0, icon: '🏔️', color: 'from-orange-500 to-amber-500' },
        { name: 'Food & Dining', percent: 0, icon: '🍜', color: 'from-amber-500 to-yellow-400' },
        { name: 'Nature & Parks', percent: 0, icon: '🌲', color: 'from-emerald-500 to-teal-400' },
        { name: 'Culture & Arts', percent: 0, icon: '🏛️', color: 'from-sky-500 to-indigo-500' },
    ];

    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Your travel insights
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Personal travel journal & exploration stats.
                    </p>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
                    <Trophy className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>{stats.trips > 0 ? `Level ${Math.min(5, stats.trips + 1)} Explorer` : 'New Explorer'}</span>
                </div>
            </div>

            {/* Main Stats Card */}
            <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
                {/* 4 Stat Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-0.5">
                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{stats.trips}</span>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                            <Luggage className="w-3 h-3 text-[#F06536]" /> Trips
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-0.5">
                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{stats.places}</span>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                            <MapPin className="w-3 h-3 text-sky-500" /> Places
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-0.5">
                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{stats.activities}</span>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                            <Activity className="w-3 h-3 text-emerald-500" /> Activities
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-0.5">
                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{stats.days}</span>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-500" /> Days
                        </p>
                    </div>
                </div>

                {/* Visual Category Breakdown Chart */}
                <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span>Activities by category</span>
                        <span className="text-[11px] text-slate-400 font-medium">{totalActivities} logged</span>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-2">
                        {categoryBreakdown.map((cat) => (
                            <div key={cat.name} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                                        <span>{cat.icon}</span>
                                        <span>{cat.name}</span>
                                    </span>
                                    <span className="font-bold text-slate-900 dark:text-white">{cat.percent}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-700`}
                                        style={{ width: `${cat.percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Milestone Quote Badge */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30 rounded-2xl p-3 border border-orange-100 dark:border-orange-900/60 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F06536] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-slate-900 dark:text-white">
                            {stats.trips > 0 ? 'Next Badge: Global Trailblazer' : 'Next Badge: First Odyssey'}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                            {stats.trips > 0
                                ? 'Visit 2 more destinations to unlock Level 5 perks.'
                                : 'Create your first trip to start your Odyssey journey.'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

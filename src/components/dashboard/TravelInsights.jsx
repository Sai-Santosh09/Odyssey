import React from 'react';
import { Compass, Trophy, TrendingUp, MapPin, Calendar, Activity, Luggage, Sparkles } from 'lucide-react';

export function TravelInsights({
    stats = {
        trips: 12,
        places: 28,
        activities: 46,
        days: 37,
    }
}) {
    const categoryBreakdown = [
        { name: 'Adventure', percent: 38, count: 18, color: 'from-orange-500 to-amber-500', barBg: 'bg-orange-500', icon: '🏔️' },
        { name: 'Food & Dining', percent: 24, count: 11, color: 'from-amber-500 to-yellow-400', barBg: 'bg-amber-500', icon: '🍜' },
        { name: 'Nature & Parks', percent: 20, count: 9, color: 'from-emerald-500 to-teal-400', barBg: 'bg-emerald-500', icon: '🌲' },
        { name: 'Culture & Arts', percent: 18, count: 8, color: 'from-sky-500 to-indigo-500', barBg: 'bg-sky-500', icon: '🏛️' },
    ];

    return (
        <section className="space-y-3.5 pt-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#181A20] tracking-tight">
                        Your travel insights
                    </h2>
                    <p className="text-xs text-stone-500">
                        Personal travel journal & exploration stats.
                    </p>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 text-[11px] font-bold">
                    <Trophy className="w-3 h-3 text-amber-600" />
                    <span>Level 4 Explorer</span>
                </div>
            </div>

            {/* Main Stats Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-sm space-y-4">
                {/* 4 Stat Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100/90 text-center space-y-0.5">
                        <span className="text-lg font-black text-[#181A20] tracking-tight">{stats.trips}</span>
                        <p className="text-[11px] font-semibold text-stone-500 flex items-center justify-center gap-1">
                            <Luggage className="w-3 h-3 text-[#F06536]" /> Trips
                        </p>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100/90 text-center space-y-0.5">
                        <span className="text-lg font-black text-[#181A20] tracking-tight">{stats.places}</span>
                        <p className="text-[11px] font-semibold text-stone-500 flex items-center justify-center gap-1">
                            <MapPin className="w-3 h-3 text-sky-500" /> Places
                        </p>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100/90 text-center space-y-0.5">
                        <span className="text-lg font-black text-[#181A20] tracking-tight">{stats.activities}</span>
                        <p className="text-[11px] font-semibold text-stone-500 flex items-center justify-center gap-1">
                            <Activity className="w-3 h-3 text-emerald-500" /> Activities
                        </p>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100/90 text-center space-y-0.5">
                        <span className="text-lg font-black text-[#181A20] tracking-tight">{stats.days}</span>
                        <p className="text-[11px] font-semibold text-stone-500 flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-500" /> Days
                        </p>
                    </div>
                </div>

                {/* Visual Category Breakdown Chart */}
                <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span>Activities by category</span>
                        <span className="text-[11px] text-stone-400 font-medium">46 logged</span>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-2">
                        {categoryBreakdown.map((cat) => (
                            <div key={cat.name} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-stone-700 font-medium flex items-center gap-1.5">
                                        <span>{cat.icon}</span>
                                        <span>{cat.name}</span>
                                    </span>
                                    <span className="font-bold text-stone-900">{cat.percent}%</span>
                                </div>
                                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
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
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 border border-orange-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F06536] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-stone-900">Next Badge: Global Trailblazer</p>
                        <p className="text-stone-600 text-[11px]">Visit 2 more destinations to unlock Level 5 perks.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

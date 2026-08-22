<<<<<<< HEAD
import React from 'react';
import { useAuth } from './context/Authcontext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
=======
import React, { useState } from 'react';
import { useAuth } from './context/Authcontext';
import LandingPage from './pages/LandingPage';
import { supabase } from './services/supabaseClient';
import api from './services/api';

const INTERESTS_OPTIONS = [
    { label: '🏛️ Culture & Museums', value: 'Culture' },
    { label: '🍔 Food & Culinary', value: 'Food' },
    { label: '⛰️ Nature & Adventure', value: 'Adventure' },
    { label: '💆 Relaxation & Wellness', value: 'Relaxation' },
    { label: '🛍️ Shopping', value: 'Shopping' },
    { label: '🎵 Nightlife', value: 'Nightlife' },
    { label: '📸 Sightseeing', value: 'Sightseeing' },
];

const CATEGORY_COLORS = {
    'Food': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Sightseeing': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    'Culture': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Relaxation': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Transit': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    'Nightlife': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};
>>>>>>> 63b22b64e98fd29913de55b2ed441b8f6b968831

function App() {
    const { user } = useAuth();
    const [destination, setDestination] = useState('');
    const [days, setDays] = useState(3);
    const [budget, setBudget] = useState(500);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState('');
    const [activeDay, setActiveDay] = useState(0);

<<<<<<< HEAD
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {!user ? <LandingPage /> : <Dashboard />}
=======
    if (!user) {
        return <LandingPage />;
    }

    const toggleInterest = (value) => {
        if (selectedInterests.includes(value)) {
            setSelectedInterests(selectedInterests.filter((i) => i !== value));
        } else {
            setSelectedInterests([...selectedInterests, value]);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setItinerary(null);
        setActiveDay(0);

        try {
            const response = await api.post('/itinerary', {
                destination,
                days: parseInt(days),
                budget: parseFloat(budget),
                interests: selectedInterests,
            });
            setItinerary(response.data);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.detail || 'Failed to generate itinerary. Ensure your backend is running and GEMINI_API_KEY is configured.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white pb-16">
            {/* Top Navigation */}
            <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🌌</span>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Odyssey Travel Concierge
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-xs text-slate-400 hidden sm:inline">
                            Logged in: <strong className="text-slate-300">{user.email}</strong>
                        </span>
                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs px-3.5 py-2 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Request Parameters */}
                <section className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                        <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
                            <span>🧭</span>
                            <span>Configure Your Trip</span>
                        </h2>

                        <form onSubmit={handleGenerate} className="space-y-4">
                            {/* Destination */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Destination
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="e.g. Kyoto, Paris, Iceland"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
                                />
                            </div>

                            {/* Row: Duration & Budget */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Duration (Days)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="14"
                                        value={days}
                                        onChange={(e) => setDays(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Budget (USD)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Interests */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                                    What are your interests?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {INTERESTS_OPTIONS.map((opt) => {
                                        const isSelected = selectedInterests.includes(opt.value);
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => toggleInterest(opt.value)}
                                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                                    isSelected
                                                        ? 'bg-indigo-600 border-indigo-500 text-white font-medium shadow-md shadow-indigo-600/20'
                                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 mt-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        <span>Consulting Travel Concierge...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>✨</span>
                                        <span>Build Itinerary</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Troubleshooting / Instruction helper */}
                    <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            🔧 Configuration Requirements
                        </h4>
                        <ul className="text-xs text-slate-500 space-y-2 list-disc list-inside">
                            <li>Ensure FastAPI backend is running locally on port <code className="text-slate-300">8000</code>.</li>
                            <li>Set your <code className="text-slate-300">GEMINI_API_KEY</code> in <code className="text-slate-300">BackEnd/.env</code> file.</li>
                        </ul>
                    </div>
                </section>

                {/* Right Panel: Output Display */}
                <section className="lg:col-span-8">
                    {/* Error Banner */}
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-400 text-sm mb-6 flex items-start space-x-3">
                            <span className="text-lg">⚠️</span>
                            <div>
                                <h3 className="font-semibold text-rose-300">Generation Error</h3>
                                <p className="mt-0.5 text-xs text-rose-400/90 leading-relaxed">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Loading State Skeleton */}
                    {loading && (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-10 bg-slate-900/50 rounded-lg w-1/3"></div>
                            <div className="h-4 bg-slate-900/50 rounded w-1/4"></div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="h-10 bg-slate-900/50 rounded-lg"></div>
                                <div className="h-10 bg-slate-900/50 rounded-lg"></div>
                                <div className="h-10 bg-slate-900/50 rounded-lg"></div>
                            </div>
                            <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 space-y-4">
                                <div className="h-6 bg-slate-900/50 rounded w-1/2"></div>
                                <div className="space-y-2">
                                    <div className="h-20 bg-slate-900/50 rounded"></div>
                                    <div className="h-20 bg-slate-900/50 rounded"></div>
                                    <div className="h-20 bg-slate-900/50 rounded"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Welcome state when no itinerary is loaded */}
                    {!itinerary && !loading && !error && (
                        <div className="bg-slate-900/20 border border-slate-900/50 rounded-2xl p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
                            <div className="text-5xl animate-bounce duration-1000">🛫</div>
                            <h3 className="text-xl font-bold text-slate-300">Your adventure starts here</h3>
                            <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                                Enter a destination, trip duration, budget constraint, and select your interests. Our AI travel concierge will design a balanced, geolocated itinerary for you.
                            </p>
                        </div>
                    )}

                    {/* Generated Itinerary Display */}
                    {itinerary && !loading && (
                        <div className="space-y-6">
                            {/* Summary Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                                        Tailored Itinerary
                                    </span>
                                    <h3 className="text-2xl font-extrabold tracking-tight text-white capitalize">
                                        ✨ {itinerary.destination}
                                    </h3>
                                </div>
                                <div className="flex items-center space-x-6 text-sm">
                                    <div className="bg-slate-950 border border-slate-900 px-4 py-2.5 rounded-xl">
                                        <div className="text-xs text-slate-400 uppercase font-semibold">Total Cost</div>
                                        <div className="text-base font-bold text-emerald-400">${itinerary.total_cost.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-slate-950 border border-slate-900 px-4 py-2.5 rounded-xl">
                                        <div className="text-xs text-slate-400 uppercase font-semibold">Max Budget</div>
                                        <div className="text-base font-bold text-slate-300">${budget}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Day Tabs Navigation */}
                            <div className="flex space-x-1 border-b border-slate-900 overflow-x-auto pb-1">
                                {itinerary.days.map((day, idx) => (
                                    <button
                                        key={day.day_number}
                                        onClick={() => setActiveDay(idx)}
                                        className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                                            activeDay === idx
                                                ? 'border-indigo-500 text-indigo-400 bg-slate-900/20'
                                                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-800'
                                        }`}
                                    >
                                        Day {day.day_number}
                                    </button>
                                ))}
                            </div>

                            {/* Active Day Content */}
                            {itinerary.days[activeDay] && (
                                <div className="space-y-6">
                                    {/* Day Theme */}
                                    <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-xl px-5 py-4 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                                                Focus of the day
                                            </span>
                                            <span className="text-sm font-bold text-slate-200">
                                                {itinerary.days[activeDay].theme}
                                            </span>
                                        </div>
                                        <span className="text-2xl">⚡</span>
                                    </div>

                                    {/* Activities Timeline */}
                                    <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-850">
                                        {/* Morning Section */}
                                        {itinerary.days[activeDay].morning.map((act, index) => (
                                            <ActivityCard key={`morning-${index}`} activity={act} period="🌅 Morning" />
                                        ))}

                                        {/* Afternoon Section */}
                                        {itinerary.days[activeDay].afternoon.map((act, index) => (
                                            <ActivityCard key={`afternoon-${index}`} activity={act} period="☀️ Afternoon" />
                                        ))}

                                        {/* Evening Section */}
                                        {itinerary.days[activeDay].evening.map((act, index) => (
                                            <ActivityCard key={`evening-${index}`} activity={act} period="🌙 Evening" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

// Activity Card Subcomponent
function ActivityCard({ activity, period }) {
    const badgeColor = CATEGORY_COLORS[activity.category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

    return (
        <div className="relative pl-10 group">
            {/* Timeline bullet dot */}
            <div className="absolute left-1.5 top-5 w-4 h-4 bg-slate-900 border-2 border-indigo-500 rounded-full z-10 transition-transform group-hover:scale-125"></div>

            <div className="bg-slate-900/30 hover:bg-slate-900/50 border border-slate-900 hover:border-slate-800 rounded-2xl p-5 transition-all duration-300 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Activity name and period */}
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
                            <span>{period}</span>
                            <span>•</span>
                            <span>📍 {activity.location}</span>
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {activity.name}
                        </h4>
                    </div>

                    {/* Category Badge & Cost */}
                    <div className="flex items-center space-x-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeColor}`}>
                            {activity.category}
                        </span>
                        <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-lg">
                            {activity.estimated_cost === 0 ? 'Free' : `$${activity.estimated_cost.toFixed(2)}`}
                        </span>
                    </div>
                </div>

                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    {activity.description}
                </p>
            </div>
>>>>>>> 63b22b64e98fd29913de55b2ed441b8f6b968831
        </div>
    );
}

export default App;
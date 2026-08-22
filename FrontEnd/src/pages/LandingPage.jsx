import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import mountainImage from '../assets/odyssey-mountains.jpg';
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle.jsx';

const HERO_HEADLINES = [
    "The world is waiting. 🌍",
    "Your journey begins here. 🧭",
    "Where will you go next? ✈️",
    "Ready to get a little lost? 🗺️",
    "Your next story starts here. ✨",
    "Adventure is closer than you think. 🏔️",
    "Leave ordinary behind. 🌅",
    "Pack your curiosity. 🎒",
    "The map is calling. 📍",
    "Go somewhere unforgettable. 🌎",
    "Turn someday into let's go. 🚀",
    "Find a place worth getting lost in. 🧭",
    "What's your next adventure? ✈️",
    "The world has more stories for you. 📖",
    "Pick a direction. Start exploring. 🌍",
    "Your next escape is waiting. 🏝️",
    "Dream it. Plan it. Live it. ✨",
    "Every great story starts somewhere. 🗺️",
    "Maybe it's time to go somewhere new. 🌄",
    "Let's find your next favorite place. 📍",
    "Got your salary? Then checkout. 💰",
];

function LandingPage() {
    // Random headline selected once on initial mount/page load
    const [headline] = useState(() => {
        const randomIndex = Math.floor(Math.random() * HERO_HEADLINES.length);
        return HERO_HEADLINES[randomIndex];
    });

    const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (authMode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage({
                    type: 'success',
                    text: 'Account created! Please check your email for the confirmation link.',
                });
            } else if (authMode === 'signin') {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else if (authMode === 'forgot') {
                const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin,
                });
                if (error) throw error;
                setMessage({
                    type: 'success',
                    text: 'Password reset link sent! Check your inbox.',
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'An error occurred during authentication.',
            });
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (mode) => {
        setAuthMode(mode);
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-6 sm:px-6 sm:py-10 md:py-12 font-sans selection:bg-[#F06536]/20 selection:text-[#F06536] transition-colors duration-200 relative">
            {/* Theme Toggle Button */}
            <div className="absolute top-4 right-4 z-20">
                <ThemeToggle />
            </div>

            {/* Main Center Container */}
            <div className="w-full max-w-[420px] sm:max-w-[440px] md:max-w-[460px] flex flex-col space-y-5 sm:space-y-6 my-auto">
                
                {/* Hero Card with Mountain Image Banner */}
                <div className="relative rounded-[28px] overflow-hidden shadow-xl shadow-black/10 bg-slate-900 dark:bg-slate-950 aspect-[4/4.4] sm:aspect-[4/4.2] flex flex-col justify-between p-6 sm:p-7 select-none">
                    {/* Background Image */}
                    <img
                        src={mountainImage}
                        alt="Odyssey Mountain Landscape"
                        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                    />

                    {/* Gradient Overlay for Crisp Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

                    {/* Top Header / Brand Logo */}
                    <div className="relative z-10 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#F06536] flex items-center justify-center shadow-md shadow-[#F06536]/40">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4 text-white"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path d="m14.5 9.5-2.5 5-2.5-5 5 2.5z" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="text-white text-xl font-bold tracking-tight drop-shadow-sm">
                            Odyssey
                        </span>
                    </div>

                    {/* Bottom Hero Headline & Subtitle */}
                    <div className="relative z-10 space-y-2 pt-16">
                        <h1 className="text-2xl sm:text-[28px] font-extrabold text-white leading-[1.2] tracking-tight animate-hero-fade">
                            {headline}
                        </h1>
                        <p className="text-white/80 text-[13px] sm:text-[13.5px] leading-relaxed font-normal">
                            Discover new places. Plan unforgettable adventures. Create your own Odyssey.
                        </p>
                    </div>
                </div>

                {/* Authentication Form Card Section */}
                <div className="w-full space-y-5 px-1 sm:px-2">
                    {/* Form Header */}
                    <div>
                        <h2 className="text-[22px] sm:text-[24px] font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                            {authMode === 'signin' && (
                                <>Welcome back, explorer 👋</>
                            )}
                            {authMode === 'signup' && (
                                <>Start your Odyssey 🧭</>
                            )}
                            {authMode === 'forgot' && (
                                <>Forgot your way? 🗺️</>
                            )}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-[13.5px] mt-1">
                            {authMode === 'signin' && 'Ready to discover somewhere new?'}
                            {authMode === 'signup' && 'Create your account to start planning journeys.'}
                            {authMode === 'forgot' && 'Enter your email to receive password reset instructions.'}
                        </p>
                    </div>

                    {/* Status Message Notification */}
                    {message.text && (
                        <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
                                message.type === 'success'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-850'
                                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-850'
                            }`}
                        >
                            {message.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">{message.text}</div>
                        </div>
                    )}

                    {/* Auth Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F06536]/20 focus:border-[#F06536] shadow-sm transition-all duration-150"
                            />
                        </div>

                        {/* Password Input (Hidden for forgot password mode) */}
                        {authMode !== 'forgot' && (
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Password
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 pr-11 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F06536]/20 focus:border-[#F06536] shadow-sm transition-all duration-150"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Forgot Password Link (Only in Sign In mode) */}
                        {authMode === 'signin' && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => switchMode('forgot')}
                                    className="text-xs font-medium text-[#0284C7] dark:text-sky-400 hover:text-[#0369A1] transition-colors hover:underline"
                                >
                                    Forgot your way?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-[#F06536] hover:bg-[#E05325] active:scale-[0.99] text-white font-semibold text-sm sm:text-base py-3.5 sm:py-4 px-4 rounded-xl sm:rounded-2xl shadow-lg shadow-[#F06536]/25 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>
                                        {authMode === 'signin' && 'Continue your Odyssey'}
                                        {authMode === 'signup' && 'Create your Odyssey'}
                                        {authMode === 'forgot' && 'Send Reset Instructions'}
                                    </span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Mode Toggle Footer */}
                    <div className="text-center pt-2 sm:pt-3">
                        {authMode === 'signin' && (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                New here?{' '}
                                <button
                                    type="button"
                                    onClick={() => switchMode('signup')}
                                    className="text-[#F06536] hover:text-[#E05325] font-semibold transition-colors hover:underline touch-manipulation"
                                >
                                    Start your Odyssey →
                                </button>
                            </p>
                        )}
                        {authMode === 'signup' && (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => switchMode('signin')}
                                    className="text-[#F06536] hover:text-[#E05325] font-semibold transition-colors hover:underline touch-manipulation"
                                >
                                    Sign In →
                                </button>
                            </p>
                        )}
                        {authMode === 'forgot' && (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                Remembered your password?{' '}
                                <button
                                    type="button"
                                    onClick={() => switchMode('signin')}
                                    className="text-[#F06536] hover:text-[#E05325] font-semibold transition-colors hover:underline touch-manipulation"
                                >
                                    Back to Sign In →
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;



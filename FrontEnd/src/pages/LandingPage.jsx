import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

function LandingPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState('');
    const [message, setMessage] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Success! Check your email for verification link.');
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (error) {
            setMessage(error.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = async (provider) => {
        setOauthLoading(provider);
        setMessage('');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (error) {
            setMessage(error.message || `Failed to sign in with ${provider}.`);
            setOauthLoading('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl space-y-6 relative z-10">
                {/* Logo & Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25 mb-2">
                        <span className="text-2xl">🌌</span>
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Odyssey
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isSignUp ? 'Create your account to start planning' : 'Sign in to plan your next adventure'}
                    </p>
                </div>

                {/* OAuth Buttons */}
                <div className="space-y-3">
                    {/* Continue with Google */}
                    <button
                        type="button"
                        id="google-oauth-btn"
                        disabled={oauthLoading === 'google'}
                        onClick={() => handleOAuthLogin('google')}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2.5 px-4 rounded-lg shadow-sm border border-gray-200 transition-all hover:translate-y-[-1px] hover:shadow-md active:translate-y-[0px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {oauthLoading === 'google' ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600"></div>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        )}
                        <span>{oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}</span>
                    </button>

                    {/* Continue with Apple */}
                    <button
                        type="button"
                        id="apple-oauth-btn"
                        disabled={oauthLoading === 'apple'}
                        onClick={() => handleOAuthLogin('apple')}
                        className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm border border-gray-700 transition-all hover:translate-y-[-1px] hover:shadow-md active:translate-y-[0px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {oauthLoading === 'apple' ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.24 16.7 4.89 10.33 9 10.08c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.48 4.31zM12.03 10c-.16-2.23 1.72-4.07 3.97-4.27.29 2.59-2.34 4.5-3.97 4.27z"/>
                            </svg>
                        )}
                        <span>{oauthLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-wider">or continue with email</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            id="email-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950/60 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            id="password-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950/60 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm font-medium ${
                            message.toLowerCase().includes('success') 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        id="email-submit-btn"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg shadow-indigo-600/20 transition-all hover:translate-y-[-1px] hover:shadow-indigo-500/30 active:translate-y-[0px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                Processing...
                            </span>
                        ) : (
                            isSignUp ? 'Create Account' : 'Sign In'
                        )}
                    </button>
                </form>

                {/* Toggle Sign Up / Sign In */}
                <div className="text-center pt-1">
                    <button
                        type="button"
                        id="toggle-auth-mode-btn"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage('');
                        }}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-[11px] text-slate-600 pt-2">
                    By continuing, you agree to Odyssey's Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}

export default LandingPage;


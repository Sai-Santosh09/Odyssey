import React, { useState } from 'react';
import { Bell, MapPin, Cloud, LogOut, User, Settings, Check, Sparkles, ChevronDown } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export function Header({
    currentLocation = 'Hyderabad, India',
    onChangeLocation,
    onOpenNotifications,
    unreadNotificationsCount = 2,
    syncStatus = 'Trips synced',
    userEmail = 'explorer@odyssey.app'
}) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (e) {
            console.error('Sign out error', e);
        }
    };

    return (
        <header className="w-full pt-4 pb-2">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between gap-3 mb-6">
                {/* Brand Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#F06536] flex items-center justify-center shadow-md shadow-[#F06536]/30">
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
                    <span className="text-xl font-extrabold text-[#181A20] tracking-tight">
                        Odyssey
                    </span>
                </div>

                {/* Right Actions: Sync Status, Bell, Avatar */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Cloud Sync Status Indicator */}
                    <div className="hidden xs:flex sm:flex items-center gap-1.5 px-2.5 py-1 bg-stone-100/90 rounded-full border border-stone-200/60 text-[11px] font-medium text-stone-600 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <Cloud className="w-3.5 h-3.5 text-stone-500" />
                        <span className="hidden sm:inline">{syncStatus}</span>
                    </div>

                    {/* Notification Bell */}
                    <button
                        onClick={onOpenNotifications}
                        className="relative p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200/80 text-stone-700 shadow-sm transition-all duration-150 active:scale-95 touch-manipulation"
                        aria-label="Notifications"
                    >
                        <Bell className="w-4 h-4" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F06536] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#FAF8F5]">
                                {unreadNotificationsCount}
                            </span>
                        )}
                    </button>

                    {/* User Profile Avatar with Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-white hover:bg-stone-50 border border-stone-200/80 shadow-sm transition-all duration-150 active:scale-95 touch-manipulation"
                        >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#F06536] to-amber-400 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                                {userEmail ? userEmail.charAt(0).toUpperCase() : 'E'}
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
                        </button>

                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowProfileMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 py-2 border-b border-stone-100">
                                        <p className="text-xs text-stone-400 font-medium">Signed in as</p>
                                        <p className="text-xs font-semibold text-stone-800 truncate">{userEmail}</p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            onClick={() => setShowProfileMenu(false)}
                                            className="w-full px-4 py-2 text-left text-xs sm:text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition-colors"
                                        >
                                            <User className="w-4 h-4 text-stone-500" />
                                            Traveler Profile
                                        </button>
                                        <button
                                            onClick={() => setShowProfileMenu(false)}
                                            className="w-full px-4 py-2 text-left text-xs sm:text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition-colors"
                                        >
                                            <Sparkles className="w-4 h-4 text-[#F06536]" />
                                            Odyssey Club VIP
                                        </button>
                                    </div>
                                    <div className="pt-1 border-t border-stone-100">
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full px-4 py-2 text-left text-xs sm:text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors font-medium"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Greeting / Callout */}
            <div className="space-y-1 sm:space-y-1.5 mt-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#181A20] tracking-tight leading-tight">
                    Where are you going next?
                </h1>
                <p className="text-stone-500 text-xs sm:text-sm">
                    Let's turn your next idea into an adventure.
                </p>

                {/* Location Indicator */}
                <div className="flex items-center gap-1.5 pt-1 text-xs text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-[#F06536]" />
                    <span className="font-semibold text-stone-800">{currentLocation}</span>
                    <span className="text-stone-300">•</span>
                    <button
                        onClick={onChangeLocation}
                        className="text-[#0284C7] hover:text-[#0369A1] font-medium underline underline-offset-2 hover:opacity-80 transition-colors"
                    >
                        Change
                    </button>
                </div>
            </div>
        </header>
    );
}

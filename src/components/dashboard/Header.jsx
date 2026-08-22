import React, { useState } from 'react';
import { Bell, MapPin, Cloud, LogOut, User, ChevronDown, Compass } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export function Header({
    currentLocation = 'Hyderabad, India',
    onChangeLocation,
    onOpenNotifications,
    onOpenProfile,
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
        <header className="sticky top-0 z-30 w-full glass-header border-b border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Brand Logo & Location */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#F06536] to-amber-500 flex items-center justify-center shadow-md shadow-[#F06536]/30">
                                <Compass className="w-5 h-5 text-white stroke-[2.2]" />
                            </div>
                            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Odyssey
                            </span>
                        </div>

                        {/* Location Quick Badge on Desktop/Tablet */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                            <MapPin className="w-3.5 h-3.5 text-[#F06536]" />
                            <span>{currentLocation}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <button
                                onClick={onChangeLocation}
                                className="text-[#F06536] hover:underline transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    </div>

                    {/* Right Actions: Sync, Notifications, Profile */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Cloud Sync Status */}
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-full border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <Cloud className="w-3.5 h-3.5" />
                            <span>{syncStatus}</span>
                        </div>

                        {/* Notification Bell */}
                        <button
                            onClick={onOpenNotifications}
                            className="relative p-2.5 rounded-2xl bg-white dark:bg-[#131B2E] hover:bg-slate-100 dark:hover:bg-[#182238] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-150 active:scale-95 touch-manipulation"
                            aria-label="Notifications"
                        >
                            <Bell className="w-4 h-4" />
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F06536] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#131B2E]">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </button>

                        {/* User Profile Avatar with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white dark:bg-[#131B2E] hover:bg-slate-50 dark:hover:bg-[#182238] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-150 active:scale-95 touch-manipulation"
                            >
                                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#F06536] to-amber-400 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                                    {userEmail ? userEmail.charAt(0).toUpperCase() : 'E'}
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline max-w-[100px] truncate">
                                    {userEmail.split('@')[0]}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {showProfileMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowProfileMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#131B2E] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                                            <p className="text-[11px] text-slate-400 font-medium">Signed in as</p>
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{userEmail}</p>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    onOpenProfile?.();
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#182238] flex items-center gap-2.5 transition-colors"
                                            >
                                                <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                Traveler Profile & History
                                            </button>
                                        </div>
                                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors"
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
            </div>
        </header>
    );
}

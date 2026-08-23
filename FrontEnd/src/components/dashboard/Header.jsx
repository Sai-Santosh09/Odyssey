import React, { useState } from 'react';
import { Bell, MapPin, Cloud, LogOut, User, ChevronDown, Compass, Smartphone, Sun, Moon } from 'lucide-react';
import { supabase } from '../../services/supabaseClient.js';
import { ThemeToggle } from '../common/ThemeToggle.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export function Header({
    currentLocation = 'Hyderabad, India',
    onChangeLocation,
    onOpenNotifications,
    onOpenProfile,
    unreadNotificationsCount = 2,
    syncStatus = 'Trips synced',
    userEmail = 'explorer@odyssey.app',
    isMobileFrame = false,
    onToggleMobileFrame
}) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { isDarkMode, toggleDarkMode } = useTheme();

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (e) {
            console.error('Sign out error', e);
        }
    };

    return (
        <header className="sticky top-0 z-30 w-full glass-header border-b border-odyssey-tan/40 dark:border-odyssey-brown/50 transition-colors">
            <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3">
                <div className="flex items-center justify-between gap-3">
                    {/* Brand Logo & Location */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-odyssey-brown to-odyssey-tan flex items-center justify-center shadow-md shadow-odyssey-brown/30">
                                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-odyssey-cream stroke-[2.2]" />
                            </div>
                            <span className="text-lg sm:text-xl font-extrabold text-odyssey-navy dark:text-odyssey-cream tracking-tight">
                                Odyssey
                            </span>
                        </div>

                        {/* Location Quick Badge on Desktop/Tablet */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-odyssey-slate border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-xs font-semibold text-odyssey-slate dark:text-odyssey-tan shadow-2xs">
                            <MapPin className="w-3.5 h-3.5 text-odyssey-brown dark:text-odyssey-tan" />
                            <span className="max-w-[120px] truncate">{currentLocation}</span>
                            <span className="text-odyssey-tan/60 dark:text-odyssey-brown">•</span>
                            <button
                                onClick={onChangeLocation}
                                className="text-odyssey-brown dark:text-odyssey-tan hover:underline font-bold transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    </div>

                    {/* Right Actions: App Layout Toggle, Light/Dark Theme, Sync, Notifications, Profile */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                        {/* Mobile App Mode Toggle (Desktop Only) */}
                        {onToggleMobileFrame && (
                            <button
                                onClick={onToggleMobileFrame}
                                className={`hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-bold transition-all active:scale-95 shadow-2xs ${
                                    isMobileFrame
                                        ? 'bg-odyssey-brown text-odyssey-cream border-odyssey-brown dark:bg-odyssey-tan dark:text-odyssey-navy dark:border-odyssey-tan shadow-sm shadow-odyssey-brown/25'
                                        : 'bg-white dark:bg-odyssey-slate text-odyssey-slate dark:text-odyssey-tan border-odyssey-tan/40 dark:border-odyssey-brown/50 hover:border-odyssey-brown dark:hover:border-odyssey-tan'
                                }`}
                                title={isMobileFrame ? 'Exit Mobile App Simulator' : 'Preview in Mobile App Frame'}
                            >
                                <Smartphone className="w-3.5 h-3.5 text-inherit" />
                                <span>{isMobileFrame ? 'App View' : 'App Mode'}</span>
                            </button>
                        )}

                        {/* Light / Dark Mode Theme Toggle */}
                        <ThemeToggle />

                        {/* Cloud Sync Status */}
                        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-full border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
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
                            className="relative p-2 sm:p-2.5 rounded-full bg-white dark:bg-odyssey-slate hover:bg-odyssey-cream/40 dark:hover:bg-odyssey-navy/60 border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-odyssey-navy dark:text-odyssey-cream shadow-sm transition-all duration-150 active:scale-95 touch-manipulation cursor-pointer"
                            aria-label="Notifications"
                        >
                            <Bell className="w-4 h-4" />
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-odyssey-slate">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </button>

                        {/* User Profile Avatar with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-full bg-white dark:bg-odyssey-slate hover:bg-odyssey-cream/40 dark:hover:bg-odyssey-navy/60 border border-odyssey-tan/40 dark:border-odyssey-brown/50 shadow-sm transition-all duration-150 active:scale-95 touch-manipulation cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-odyssey-brown to-odyssey-tan text-odyssey-cream font-bold text-xs flex items-center justify-center shadow-inner">
                                    {userEmail ? userEmail.charAt(0).toUpperCase() : 'E'}
                                </div>
                                <span className="text-xs font-semibold text-odyssey-navy dark:text-odyssey-cream hidden sm:inline max-w-[100px] truncate">
                                    {userEmail.split('@')[0]}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-odyssey-slate dark:text-odyssey-tan hidden sm:block" />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {showProfileMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowProfileMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-odyssey-slate rounded-2xl shadow-2xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-4 py-2.5 border-b border-odyssey-tan/30 dark:border-odyssey-brown/50">
                                            <p className="text-[11px] text-odyssey-slate dark:text-odyssey-tan font-medium">Signed in as</p>
                                            <p className="text-xs font-bold text-odyssey-navy dark:text-odyssey-cream truncate">{userEmail}</p>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    onOpenProfile?.();
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-odyssey-navy dark:text-odyssey-cream hover:bg-odyssey-cream/40 dark:hover:bg-odyssey-navy/40 flex items-center gap-2.5 transition-colors cursor-pointer"
                                            >
                                                <User className="w-4 h-4 text-odyssey-slate dark:text-odyssey-tan" />
                                                Traveler Profile & History
                                            </button>
                                            <button
                                                onClick={() => {
                                                    toggleDarkMode();
                                                    setShowProfileMenu(false);
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-odyssey-navy dark:text-odyssey-cream hover:bg-odyssey-cream/40 dark:hover:bg-odyssey-navy/40 flex items-center justify-between transition-colors cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-odyssey-slate" />}
                                                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                                                </span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-odyssey-cream/60 dark:bg-odyssey-navy text-odyssey-navy dark:text-odyssey-cream font-bold uppercase border border-odyssey-tan/40 dark:border-odyssey-brown">
                                                    {isDarkMode ? 'Dark' : 'Light'}
                                                </span>
                                            </button>
                                        </div>
                                        <div className="pt-1 border-t border-odyssey-tan/30 dark:border-odyssey-brown/50">
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
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

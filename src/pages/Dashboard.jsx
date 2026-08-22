import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/Authcontext';
import { Header } from '../components/dashboard/Header';
import { DestinationSearch } from '../components/dashboard/DestinationSearch';
import { ExploreDestinations } from '../components/dashboard/ExploreDestinations';
import { MyTrips } from '../components/dashboard/MyTrips';
import { CreateTripModal } from '../components/dashboard/CreateTripModal';
import { UpcomingItinerary } from '../components/dashboard/UpcomingItinerary';
import { NearYou } from '../components/dashboard/NearYou';
import { RecommendedForYou } from '../components/dashboard/RecommendedForYou';
import { PlacesInMind } from '../components/dashboard/PlacesInMind';
import { TravelInsights } from '../components/dashboard/TravelInsights';
import { BottomNav } from '../components/dashboard/BottomNav';
import { Toast } from '../components/dashboard/Toast';
import { DestinationModal } from '../components/dashboard/DestinationModal';
import { ChangeLocationModal } from '../components/dashboard/ChangeLocationModal';
import { NotificationsModal } from '../components/dashboard/NotificationsModal';
import { TravelerProfileModal } from '../components/dashboard/TravelerProfileModal';
import { TripDetailsModal } from '../components/dashboard/TripDetailsModal';
import { PlaceMapModal } from '../components/dashboard/PlaceMapModal';
import { getCoordinatesForLocation } from '../services/locationService';
import { Sparkles, MapPin, Compass, Plus, Plane, Calendar } from 'lucide-react';

const DEFAULT_PREFERENCES = {
    budget: 'Moderate',
    travelStyle: ['Adventure', 'Foodie', 'Nature'],
    preferredTransport: 'Flight',
    pace: 'Balanced',
};

const INITIAL_NOTIFICATIONS = [
    {
        id: 'notif_welcome',
        title: 'Welcome to Odyssey! 🧭',
        desc: 'Start planning your journeys and exploring tailored destinations.',
        time: 'Just now',
        isRead: false,
        type: 'recommendation'
    }
];

const loadScopedData = (userId, key, fallback) => {
    try {
        const item = localStorage.getItem(`odyssey_${userId}_${key}`);
        if (item !== null) {
            return JSON.parse(item);
        }
    } catch (e) {
        console.error(`Error loading ${key} for user ${userId}`, e);
    }
    return fallback;
};

const saveScopedData = (userId, key, value) => {
    try {
        localStorage.setItem(`odyssey_${userId}_${key}`, JSON.stringify(value));
    } catch (e) {
        console.error(`Error saving ${key} for user ${userId}`, e);
    }
};

export default function Dashboard() {
    const { user } = useAuth();
    const userEmail = user?.email || 'explorer@odyssey.app';
    const userId = user?.id || userEmail;

    // Navigation and Filtering State
    const [activeTab, setActiveTab] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Scoped User State
    const [currentLocation, setCurrentLocation] = useState(() => {
        return localStorage.getItem(`odyssey_${userId}_location`) || 'Hyderabad, India';
    });
    const [currentCoords, setCurrentCoords] = useState(() => {
        return loadScopedData(userId, 'coords', { lat: 17.3850, lng: 78.4867 });
    });
    const [favorites, setFavorites] = useState(() => loadScopedData(userId, 'favorites', []));
    const [notifications, setNotifications] = useState(() => loadScopedData(userId, 'notifications', INITIAL_NOTIFICATIONS));
    const [preferences, setPreferences] = useState(() => loadScopedData(userId, 'preferences', DEFAULT_PREFERENCES));
    const [trips, setTrips] = useState(() => loadScopedData(userId, 'trips', []));

    // Reload all scoped data whenever the active user changes
    useEffect(() => {
        const loc = localStorage.getItem(`odyssey_${userId}_location`) || 'Hyderabad, India';
        setCurrentLocation(loc);
        setCurrentCoords(loadScopedData(userId, 'coords', getCoordinatesForLocation(loc)));
        setFavorites(loadScopedData(userId, 'favorites', []));
        setNotifications(loadScopedData(userId, 'notifications', INITIAL_NOTIFICATIONS));
        setPreferences(loadScopedData(userId, 'preferences', DEFAULT_PREFERENCES));
        setTrips(loadScopedData(userId, 'trips', []));
    }, [userId]);

    // Save scoped data on updates
    useEffect(() => {
        saveScopedData(userId, 'trips', trips);
    }, [trips, userId]);

    useEffect(() => {
        saveScopedData(userId, 'notifications', notifications);
    }, [notifications, userId]);

    useEffect(() => {
        saveScopedData(userId, 'preferences', preferences);
    }, [preferences, userId]);

    useEffect(() => {
        saveScopedData(userId, 'favorites', favorites);
    }, [favorites, userId]);

    useEffect(() => {
        localStorage.setItem(`odyssey_${userId}_location`, currentLocation);
    }, [currentLocation, userId]);

    useEffect(() => {
        saveScopedData(userId, 'coords', currentCoords);
    }, [currentCoords, userId]);

    const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

    // Stats State dynamically calculated from active trips
    const [stats, setStats] = useState({
        trips: 0,
        places: 0,
        activities: 0,
        days: 0,
    });

    useEffect(() => {
        const activeTrips = trips.filter((t) => t.status !== 'cancelled');
        const totalActivities = activeTrips.reduce(
            (acc, t) => acc + (t.activitiesCount || (t.itinerary ? t.itinerary.length : 0)),
            0
        );
        const totalDays = activeTrips.reduce((acc, t) => acc + (t.totalDays || 0), 0);
        const uniquePlaces = new Set(activeTrips.map((t) => t.location || t.title)).size;

        setStats({
            trips: activeTrips.length,
            places: uniquePlaces,
            activities: totalActivities,
            days: totalDays,
        });
    }, [trips]);

    // Modals State
    const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
    const [isChangeLocationOpen, setIsChangeLocationOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedTripDetails, setSelectedTripDetails] = useState(null);
    const [selectedPlaceForMap, setSelectedPlaceForMap] = useState(null);

    // Toast Notification System
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast((prev) => (prev?.message === message ? null : prev));
        }, 3500);
    };

    // Notification Handlers
    const handleMarkAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        showToast('All notifications marked as read ✓', 'info');
    };

    // Trip Handlers
    const handleCreateTrip = (newTrip) => {
        setTrips([newTrip, ...trips]);
        setStats((prev) => ({
            ...prev,
            trips: prev.trips + 1,
            activities: prev.activities + (newTrip.activitiesCount || 6),
            days: prev.days + (newTrip.totalDays || 3)
        }));
        showToast('Trip created! Your Odyssey begins now. 🧭', 'success');
        setTimeout(() => {
            showToast('Your trip is synced ☁️', 'info');
        }, 1800);
    };

    const handleCancelTrip = (tripId) => {
        setTrips((prev) =>
            prev.map((t) => (t.id === tripId ? { ...t, status: 'cancelled' } : t))
        );
        showToast('Trip cancelled. You can restore it anytime.', 'info');
    };

    const handleRestoreTrip = (tripId) => {
        setTrips((prev) =>
            prev.map((t) => (t.id === tripId ? { ...t, status: 'upcoming' } : t))
        );
        showToast('Trip restored to upcoming journeys! 🧳', 'success');
    };

    const handleSelectDestination = (dest) => {
        setSelectedDestination(dest);
        setIsDestinationModalOpen(true);
    };

    const handlePlanTripWithDestination = (dest) => {
        setIsCreateTripOpen(true);
    };

    const handleToggleFavorite = (destId) => {
        if (favorites.includes(destId)) {
            setFavorites(favorites.filter((id) => id !== destId));
            showToast('Removed from saved places', 'info');
        } else {
            setFavorites([...favorites, destId]);
            showToast('Saved to your Odyssey wishlist ❤️', 'success');
        }
    };

    const handleSelectLocation = (newLoc, coords) => {
        const resolvedCoords = coords || getCoordinatesForLocation(newLoc);
        setCurrentLocation(newLoc);
        setCurrentCoords(resolvedCoords);
        showToast(`Location updated to ${newLoc} 📍`, 'success');
    };

    const handleAddToTrip = (rec) => {
        showToast(`Added "${rec.title || rec.name}" to your itinerary ✓`, 'success');
        setStats((prev) => ({ ...prev, activities: prev.activities + 1 }));
    };

    const handleSelectTrip = (trip) => {
        setSelectedTripDetails(trip);
    };

    const handleSelectPlaceForMap = (place) => {
        setSelectedPlaceForMap(place);
    };

    const handleUpdatePreferences = (newPrefs) => {
        setPreferences(newPrefs);
        saveScopedData(userId, 'preferences', newPrefs);
        showToast('Travel preferences saved & AI recommendations refreshed ✨', 'success');
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        if (tabId === 'explore') {
            document.getElementById('section-explore')?.scrollIntoView({ behavior: 'smooth' });
        } else if (tabId === 'trips') {
            document.getElementById('section-trips')?.scrollIntoView({ behavior: 'smooth' });
        } else if (tabId === 'itinerary') {
            document.getElementById('section-itinerary')?.scrollIntoView({ behavior: 'smooth' });
        } else if (tabId === 'profile') {
            setIsProfileOpen(true);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#F06536]/20 selection:text-[#F06536] transition-colors duration-200">
            {/* Toast System */}
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* 1. Global Responsive Header */}
            <Header
                currentLocation={currentLocation}
                onChangeLocation={() => setIsChangeLocationOpen(true)}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                unreadNotificationsCount={unreadNotificationsCount}
                userEmail={userEmail}
                syncStatus="Trips synced"
            />

            {/* Main Full-Width Responsive Workspace */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
                {/* Hero Greeting & Action Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#F06536] via-amber-500 to-[#E05325] dark:from-[#131B2E] dark:via-[#182238] dark:to-[#0B0F17] text-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-orange-500/10 dark:shadow-none dark:border dark:border-slate-800 transition-all duration-300">
                    <div className="relative z-10 max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 dark:bg-orange-500/20 text-white dark:text-[#FB923C] border border-white/20 dark:border-orange-500/30 text-xs font-bold shadow-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI-Powered Travel Planning</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                            Where are you going next?
                        </h1>
                        <p className="text-sm sm:text-base text-white/90 dark:text-slate-300 leading-relaxed font-medium">
                            Discover tailored destinations, build smart day-wise itineraries, and experience effortless travel.
                        </p>
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setIsCreateTripOpen(true)}
                                className="px-5 py-3 rounded-2xl bg-slate-900 dark:bg-[#F06536] hover:bg-black dark:hover:bg-[#E05325] text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create New Trip</span>
                            </button>
                            <div className="flex items-center gap-2 text-xs font-semibold text-white/90 dark:text-slate-300 bg-black/20 dark:bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15">
                                <MapPin className="w-4 h-4 text-amber-300" />
                                <span>Current: <strong>{currentLocation}</strong></span>
                                <button
                                    onClick={() => setIsChangeLocationOpen(true)}
                                    className="text-amber-200 dark:text-amber-300 hover:underline font-bold"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/15 dark:from-[#F06536]/15 via-transparent to-transparent pointer-events-none hidden md:block" />
                </div>

                {/* 2. Destination Search & Filters */}
                <DestinationSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                {/* 3. Responsive 2-Column Dashboard Grid on Desktop / Large Screens */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left / Main Content Column (8 cols on desktop) */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* 3.1 Explore Destinations Grid */}
                        <div id="section-explore">
                            <ExploreDestinations
                                currentLocation={currentLocation}
                                currentCoords={currentCoords}
                                selectedCategory={selectedCategory}
                                searchQuery={searchQuery}
                                onSelectDestination={handleSelectDestination}
                                onToggleFavorite={handleToggleFavorite}
                                favorites={favorites}
                            />
                        </div>

                        {/* 3.2 Places in Mind (Personalized AI Engine) */}
                        <PlacesInMind
                            currentLocation={currentLocation}
                            currentCoords={currentCoords}
                            preferences={preferences}
                            onPlanTripWithDestination={handlePlanTripWithDestination}
                        />

                        {/* 3.3 Near You (Location Aware & Leaflet Map Radar) */}
                        <div id="section-nearyou">
                            <NearYou
                                currentLocation={currentLocation}
                                currentCoords={currentCoords}
                                onSelectPlace={handleSelectPlaceForMap}
                                onLocationUpdate={(newLoc, coords) => handleSelectLocation(newLoc, coords)}
                            />
                        </div>

                        {/* 3.4 Recommended Activities */}
                        <div id="section-recommended">
                            <RecommendedForYou
                                onAddToTrip={handleAddToTrip}
                                onSelectRecommendation={(rec) => showToast(`Viewing ${rec.title} ✨`, 'info')}
                            />
                        </div>
                    </div>

                    {/* Right Sticky Sidebar Column (4 cols on desktop) */}
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-20">
                        {/* 3.5 My Trips Widget */}
                        <div id="section-trips">
                            <MyTrips
                                trips={trips}
                                onOpenCreateModal={() => setIsCreateTripOpen(true)}
                                onSelectTrip={handleSelectTrip}
                                onCancelTrip={handleCancelTrip}
                                onRestoreTrip={handleRestoreTrip}
                            />
                        </div>

                        {/* 3.6 Upcoming Itinerary Timeline */}
                        <div id="section-itinerary">
                            <UpcomingItinerary
                                currentTrip={trips.find((t) => t.status !== 'cancelled')}
                                onOpenCreateTrip={() => setIsCreateTripOpen(true)}
                                onViewFullItinerary={() => {
                                    const active = trips.find((t) => t.status !== 'cancelled');
                                    if (active) setSelectedTripDetails(active);
                                }}
                                onActivityUpdated={(msg) => showToast(msg, 'success')}
                            />
                        </div>

                        {/* 3.7 Travel Insights & Analytics */}
                        <div id="section-insights">
                            <TravelInsights stats={stats} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Navigation for Mobile Devices */}
            <BottomNav activeTab={activeTab} onChangeTab={handleTabChange} />

            {/* Modals & Dialogs */}
            <CreateTripModal
                isOpen={isCreateTripOpen}
                onClose={() => setIsCreateTripOpen(false)}
                onCreateTrip={handleCreateTrip}
                currentLocation={currentLocation}
                currentCoords={currentCoords}
            />

            <DestinationModal
                destination={selectedDestination}
                isOpen={isDestinationModalOpen}
                onClose={() => setIsDestinationModalOpen(false)}
                onPlanTripWithDestination={handlePlanTripWithDestination}
                currentLocation={currentLocation}
                currentCoords={currentCoords}
            />

            <ChangeLocationModal
                isOpen={isChangeLocationOpen}
                onClose={() => setIsChangeLocationOpen(false)}
                currentLocation={currentLocation}
                onSelectLocation={handleSelectLocation}
            />

            <NotificationsModal
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
            />

            <TravelerProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                userEmail={userEmail}
                preferences={preferences}
                travelHistory={trips.filter((t) => t.status === 'completed')}
                onUpdatePreferences={handleUpdatePreferences}
            />

            <TripDetailsModal
                trip={selectedTripDetails}
                isOpen={!!selectedTripDetails}
                onClose={() => setSelectedTripDetails(null)}
            />

            <PlaceMapModal
                place={selectedPlaceForMap}
                isOpen={!!selectedPlaceForMap}
                onClose={() => setSelectedPlaceForMap(null)}
                onAddToTrip={handleAddToTrip}
                userGpsCoords={currentCoords}
            />
        </div>
    );
}

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
import { MobileDeviceFrame } from '../components/dashboard/MobileDeviceFrame.jsx';
import { getCoordinatesForLocation } from '../services/locationService.js';
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

    // Navigation and Filtering State (Defaults directly to 'explore')
    const [activeTab, setActiveTab] = useState('explore');
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

    // Reload all scoped data whenever the active user changes / on login
    useEffect(() => {
        setActiveTab('explore');
        const loc = localStorage.getItem(`odyssey_${userId}_location`) || 'Hyderabad, India';
        setCurrentLocation(loc);
        setCurrentCoords(loadScopedData(userId, 'coords', getCoordinatesForLocation(loc)));
        setFavorites(loadScopedData(userId, 'favorites', []));
        setNotifications(loadScopedData(userId, 'notifications', INITIAL_NOTIFICATIONS));
        setPreferences(loadScopedData(userId, 'preferences', DEFAULT_PREFERENCES));
        setTrips(loadScopedData(userId, 'trips', []));
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Modals & Layout State
    const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
    const [prefilledDestination, setPrefilledDestination] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
    const [isChangeLocationOpen, setIsChangeLocationOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedTripDetails, setSelectedTripDetails] = useState(null);
    const [selectedPlaceForMap, setSelectedPlaceForMap] = useState(null);
    const [isMobileFrame, setIsMobileFrame] = useState(() => localStorage.getItem('odyssey_mobile_frame_mode') === 'true');

    // Toast Notification System
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast((prev) => (prev?.message === message ? null : prev));
        }, 3500);
    };

    const handleToggleMobileFrame = () => {
        setIsMobileFrame((prev) => {
            const next = !prev;
            localStorage.setItem('odyssey_mobile_frame_mode', String(next));
            showToast(next ? 'Switched to Mobile App Simulator 📱' : 'Switched to Full Screen Layout 💻', 'info');
            return next;
        });
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
        setPrefilledDestination(dest);
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
        const title = rec.title || rec.name || 'Exciting Experience';
        const activeTripIndex = trips.findIndex((t) => t.status !== 'cancelled');

        if (activeTripIndex !== -1) {
            const activeTrip = trips[activeTripIndex];
            const currentItinerary = activeTrip.itinerary || [];

            // Calculate formatted progressive timeline slot
            const baseHour = 9 + (currentItinerary.length * 2) % 12;
            const ampm = (9 + (currentItinerary.length * 2)) >= 12 ? 'PM' : 'AM';
            const displayHour = baseHour > 12 ? baseHour - 12 : (baseHour === 0 ? 12 : baseHour);
            const startTime = `${displayHour < 10 ? '0' : ''}${displayHour}:00 ${ampm}`;
            const endHourVal = (displayHour % 12) + 2;
            const endHour = endHourVal === 0 ? 12 : endHourVal;
            const endTime = `${endHour < 10 ? '0' : ''}${endHour}:00 ${ampm}`;

            const newActivity = {
                id: 'act_' + Date.now(),
                startTime: rec.startTime || startTime,
                endTime: rec.endTime || endTime,
                title: title,
                subtitle: rec.description || rec.subtitle || rec.category || 'Scheduled stop',
                icon: rec.icon || (rec.vibe?.includes('🏔️') ? '🏔️' : rec.vibe?.includes('🍜') ? '🍜' : rec.vibe?.includes('🏛️') ? '🏛️' : rec.vibe?.includes('🏖️') ? '🏖️' : '📍'),
                category: rec.category || rec.vibe || 'Activity',
                completed: false,
            };

            const updatedItinerary = [...currentItinerary, newActivity];
            const updatedTrip = {
                ...activeTrip,
                itinerary: updatedItinerary,
                activitiesCount: updatedItinerary.length,
            };

            const updatedTrips = [...trips];
            updatedTrips[activeTripIndex] = updatedTrip;
            setTrips(updatedTrips);
            showToast(`Added "${title}" to your ${activeTrip.title} itinerary ✓`, 'success');
        } else {
            // Auto-create initial journey so it appears instantly in My Trips and Upcoming Itinerary
            const locationName = rec.location || rec.name || currentLocation;
            const coords = (rec.lat && rec.lng)
                ? { lat: rec.lat, lng: rec.lng }
                : (rec.coordinates?.lat && rec.coordinates?.lng)
                    ? rec.coordinates
                    : getCoordinatesForLocation(locationName);

            const newActivity = {
                id: 'act_' + Date.now(),
                startTime: '10:00 AM',
                endTime: '12:30 PM',
                title: title,
                subtitle: rec.description || rec.subtitle || 'Scheduled exploration',
                icon: rec.icon || '📍',
                category: rec.category || 'Activity',
                completed: false,
            };

            const newTrip = {
                id: 'trip_' + Date.now(),
                title: `${locationName.split(',')[0].trim()} Adventure`,
                location: locationName,
                coordinates: coords,
                dates: 'Upcoming Journey',
                travelers: 2,
                totalDays: 3,
                currentDay: 1,
                activitiesCount: 1,
                status: 'upcoming',
                vibe: rec.vibe || 'Exploration',
                daysRemaining: 7,
                itinerary: [newActivity],
            };

            setTrips([newTrip, ...trips]);
            showToast(`Created new trip "${newTrip.title}" & added "${title}" to your itinerary! 🧳`, 'success');
        }
    };

    const handleItineraryActivityUpdated = (msg, updatedActivities) => {
        if (msg) showToast(msg, 'success');
        if (updatedActivities && Array.isArray(updatedActivities)) {
            const activeIndex = trips.findIndex((t) => t.status !== 'cancelled');
            if (activeIndex !== -1) {
                const updatedTrips = [...trips];
                updatedTrips[activeIndex] = {
                    ...updatedTrips[activeIndex],
                    itinerary: updatedActivities,
                    activitiesCount: updatedActivities.length,
                };
                setTrips(updatedTrips);
            }
        }
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#F06536]/20 selection:text-[#F06536] transition-colors duration-200">
            {/* Toast System */}
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* Mobile Device Frame Wrapper (App View Mode) */}
            <MobileDeviceFrame
                isMobileFrame={isMobileFrame}
                onToggleFrame={handleToggleMobileFrame}
                currentLocation={currentLocation}
            >
                {/* 1. Global Mobile App Header */}
                <Header
                    currentLocation={currentLocation}
                    onChangeLocation={() => setIsChangeLocationOpen(true)}
                    onOpenNotifications={() => setIsNotificationsOpen(true)}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    unreadNotificationsCount={unreadNotificationsCount}
                    userEmail={userEmail}
                    syncStatus="Trips synced"
                    isMobileFrame={isMobileFrame}
                    onToggleMobileFrame={handleToggleMobileFrame}
                />

                {/* Main Mobile-First Workspace Container */}
                <main className={`mx-auto ${isMobileFrame ? 'w-full px-3 py-3.5 pb-28 space-y-5' : 'max-w-3xl px-3.5 sm:px-6 py-4 sm:py-6 pb-28 sm:pb-32 space-y-6 sm:space-y-7'} animate-in fade-in duration-200`}>
                {/* 1. Explore Tab: Destination Discovery, Search, Live Travel Hub */}
                {activeTab === 'explore' && (
                    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        {/* Hero Greeting & Action Banner */}
                        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#F06536] via-amber-500 to-[#E05325] dark:from-[#131B2E] dark:via-[#182238] dark:to-[#0B0F17] text-white p-4.5 sm:p-6 shadow-xl shadow-orange-500/10 dark:shadow-none dark:border dark:border-slate-800 transition-all duration-300">
                            <div className="relative z-10 space-y-2.5">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 dark:bg-orange-500/20 text-white dark:text-[#FB923C] border border-white/20 dark:border-orange-500/30 text-[11px] font-bold shadow-xs">
                                    <Sparkles className="w-3 h-3" />
                                    <span>AI-Powered Travel Planning</span>
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                                    Where are you going next?
                                </h1>
                                <p className="text-xs sm:text-sm text-white/90 dark:text-slate-300 leading-relaxed font-medium">
                                    Discover tailored destinations, build smart day-wise itineraries, and experience effortless travel.
                                </p>
                                <div className="pt-1 flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setPrefilledDestination(null);
                                            setIsCreateTripOpen(true);
                                        }}
                                        className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-[#F06536] hover:bg-black dark:hover:bg-[#E05325] text-white font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Create Trip</span>
                                    </button>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90 dark:text-slate-300 bg-black/20 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
                                        <MapPin className="w-3.5 h-3.5 text-amber-300" />
                                        <span>{currentLocation.split(',')[0]}</span>
                                        <button
                                            onClick={() => setIsChangeLocationOpen(true)}
                                            className="text-amber-200 dark:text-amber-300 hover:underline font-bold ml-0.5 text-[11px]"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Destination Search & Filter Chips */}
                        <DestinationSearch
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />

                        {/* Explore Destinations Catalog */}
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
                )}

                {/* 2. Trips & Itinerary Tab: Active Journeys & Timeline */}
                {activeTab === 'trips' && (
                    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        {/* Quick Stats Pill */}
                        <div className="p-3 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-around text-center">
                            <div>
                                <p className="text-base sm:text-lg font-extrabold text-[#F06536]">{stats.trips}</p>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-slate-500">Journeys</p>
                            </div>
                            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
                            <div>
                                <p className="text-base sm:text-lg font-extrabold text-[#F06536]">{stats.activities}</p>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-slate-500">Stops</p>
                            </div>
                            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
                            <div>
                                <p className="text-base sm:text-lg font-extrabold text-[#F06536]">{stats.days}</p>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-slate-500">Days Out</p>
                            </div>
                        </div>

                        {/* Upcoming Itinerary Day Timeline */}
                        <UpcomingItinerary
                            currentTrip={trips.find((t) => t.status !== 'cancelled')}
                            onOpenCreateTrip={() => {
                                setPrefilledDestination(null);
                                setIsCreateTripOpen(true);
                            }}
                            onViewFullItinerary={() => {
                                const active = trips.find((t) => t.status !== 'cancelled');
                                if (active) setSelectedTripDetails(active);
                            }}
                            onActivityUpdated={handleItineraryActivityUpdated}
                        />

                        {/* My Trips List */}
                        <MyTrips
                            trips={trips}
                            onOpenCreateModal={() => {
                                setPrefilledDestination(null);
                                setIsCreateTripOpen(true);
                            }}
                            onSelectTrip={handleSelectTrip}
                            onCancelTrip={handleCancelTrip}
                            onRestoreTrip={handleRestoreTrip}
                        />
                    </div>
                )}

                {/* 3. Near You Tab: Live GPS Radar & Leaflet Map */}
                {activeTab === 'nearyou' && (
                    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <NearYou
                            currentLocation={currentLocation}
                            currentCoords={currentCoords}
                            onSelectPlace={handleSelectPlaceForMap}
                            onLocationUpdate={(newLoc, coords) => handleSelectLocation(newLoc, coords)}
                        />
                    </div>
                )}

                {/* 4. For You Tab: AI Recommendation Engine, Picked Activities, Insights */}
                {activeTab === 'foryou' && (
                    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        {/* Places in Mind (Personalized AI Matrix) */}
                        <PlacesInMind
                            currentLocation={currentLocation}
                            currentCoords={currentCoords}
                            preferences={preferences}
                            onPlanTripWithDestination={handlePlanTripWithDestination}
                        />

                        {/* Recommended Activities */}
                        <RecommendedForYou
                            onAddToTrip={handleAddToTrip}
                            onSelectRecommendation={(rec) => showToast(`Viewing ${rec.title} ✨`, 'info')}
                        />

                        {/* Travel Insights & Analytics */}
                        <TravelInsights stats={stats} />
                    </div>
                )}
            </main>

            {/* Floating Action Button (Quick Create Trip FAB) */}
            <button
                onClick={() => {
                    setPrefilledDestination(null);
                    setIsCreateTripOpen(true);
                }}
                className={`${
                    isMobileFrame
                        ? 'sticky float-right bottom-20 mr-3 z-30 w-11 h-11'
                        : 'fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40 w-12 h-12'
                } rounded-full bg-gradient-to-tr from-[#F06536] to-amber-500 hover:from-[#E05325] hover:to-orange-500 active:scale-90 text-white shadow-xl shadow-[#F06536]/40 flex items-center justify-center transition-all duration-200 group touch-manipulation border border-white/20`}
                aria-label="Create Trip"
                title="Create New Trip"
            >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* 4-Feature Floating Action Navigation Dock */}
            <BottomNav
                activeTab={activeTab}
                onChangeTab={handleTabChange}
                tripsCount={trips.filter((t) => t.status !== 'cancelled').length}
                isMobileFrame={isMobileFrame}
            />
            </MobileDeviceFrame>

            {/* Modals & Dialogs */}
            <CreateTripModal
                isOpen={isCreateTripOpen}
                onClose={() => {
                    setIsCreateTripOpen(false);
                    setPrefilledDestination(null);
                }}
                onCreateTrip={handleCreateTrip}
                currentLocation={currentLocation}
                currentCoords={currentCoords}
                initialDestination={prefilledDestination}
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

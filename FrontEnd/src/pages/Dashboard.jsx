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
import { Toast } from '../components/common/Toast';
import { DestinationModal } from '../components/dashboard/DestinationModal';
import { ChangeLocationModal } from '../components/dashboard/ChangeLocationModal';
import { NotificationsModal } from '../components/dashboard/NotificationsModal';
import { TravelerProfileModal } from '../components/dashboard/TravelerProfileModal';
import { TripDetailsModal } from '../components/dashboard/TripDetailsModal';
import { PlaceMapModal } from '../components/dashboard/PlaceMapModal';
import { getCoordinatesForLocation } from '../services/locationService.js';
import { Sparkles, MapPin, Plus } from 'lucide-react';

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

    const handleUpdateTrip = (updatedTrip) => {
        setTrips((prev) =>
            prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
        );
        setSelectedTripDetails((prev) => (prev?.id === updatedTrip.id ? updatedTrip : prev));
        showToast(`Trip details updated (${updatedTrip.travelers} traveler${updatedTrip.travelers > 1 ? 's' : ''}) ✨`, 'success');
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
        <div className="min-h-screen bg-odyssey-blue-poppy dark:bg-odyssey-navy text-odyssey-navy dark:text-odyssey-cream font-sans selection:bg-odyssey-brown/20 selection:text-odyssey-brown transition-colors duration-200">
            {/* Toast System */}
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* 1. Global Sticky Header */}
            <Header
                currentLocation={currentLocation}
                onChangeLocation={() => setIsChangeLocationOpen(true)}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                unreadNotificationsCount={unreadNotificationsCount}
                userEmail={userEmail}
                syncStatus="Trips synced"
            />

            {/* Main Full-Width Responsive Workspace Container */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-28 sm:pb-32 space-y-6 sm:space-y-8 animate-in fade-in duration-200 w-full">
                {/* 1. Explore Tab: Destination Discovery, Search, Live Travel Hub */}
                {activeTab === 'explore' && (
                    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        {/* Clean, Spacious Stippl-Style Centered Hero Section */}
                        <div className="text-center py-6 sm:py-10 space-y-4 max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-odyssey-slate border border-odyssey-tan/40 dark:border-odyssey-brown/50 text-xs font-extrabold text-odyssey-brown dark:text-odyssey-tan shadow-xs">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>AI-Powered Travel Experience</span>
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-odyssey-navy dark:text-odyssey-cream leading-tight">
                                Where are you going next?
                            </h1>
                            
                            <p className="text-sm sm:text-base text-odyssey-slate dark:text-odyssey-tan font-medium max-w-lg mx-auto leading-relaxed">
                                Discover tailored destinations, build smart day-wise itineraries, and experience effortless travel.
                            </p>
                            
                            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                                <button
                                    onClick={() => {
                                        setPrefilledDestination(null);
                                        setIsCreateTripOpen(true);
                                    }}
                                    className="px-8 py-3.5 rounded-full bg-odyssey-brown text-odyssey-cream hover:opacity-90 dark:bg-odyssey-tan dark:text-odyssey-navy dark:hover:opacity-90 font-extrabold text-sm sm:text-base shadow-lg shadow-odyssey-brown/25 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                                >
                                    <Plus className="w-4 h-4 stroke-[2.5]" />
                                    <span>Create Trip</span>
                                </button>
                                
                                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-odyssey-navy dark:text-odyssey-cream bg-white dark:bg-odyssey-slate px-6 py-3 rounded-full border border-odyssey-tan/40 dark:border-odyssey-brown/50 shadow-xs">
                                    <MapPin className="w-4 h-4 text-odyssey-brown dark:text-odyssey-tan" />
                                    <span>{currentLocation.split(',')[0]}</span>
                                    <button
                                        onClick={() => setIsChangeLocationOpen(true)}
                                        className="text-odyssey-brown dark:text-odyssey-tan hover:underline font-extrabold ml-1 cursor-pointer text-xs"
                                    >
                                        Change
                                    </button>
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
                        <div className="p-3 rounded-2xl bg-white dark:bg-odyssey-slate border border-odyssey-tan dark:border-odyssey-brown shadow-sm flex items-center justify-around text-center">
                            <div>
                                <p className="text-base sm:text-lg font-extrabold text-odyssey-brown dark:text-odyssey-tan">{stats.trips}</p>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-odyssey-slate dark:text-odyssey-tan/80">Journeys</p>
                            </div>
                            <div className="h-6 w-[1px] bg-odyssey-tan/30 dark:bg-odyssey-brown/50" />
                            <div>
                                <p className="text-base sm:text-lg font-extrabold text-odyssey-brown dark:text-odyssey-tan">{stats.activities}</p>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-odyssey-slate dark:text-odyssey-tan/80">Stops</p>
                            </div>
                            <div className="h-6 w-[1px] bg-odyssey-tan/30 dark:bg-odyssey-brown/50" />
                            <div>
                                <p className="text-base sm:text-lg font-extrabold text-odyssey-brown dark:text-odyssey-tan">{stats.days}</p>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-odyssey-slate dark:text-odyssey-tan/80">Days Out</p>
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
                            onUpdateTrip={handleUpdateTrip}
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

            {/* 4-Feature Floating Action Navigation Dock */}
            <BottomNav
                activeTab={activeTab}
                onChangeTab={handleTabChange}
                tripsCount={trips.filter((t) => t.status !== 'cancelled').length}
            />

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
                onUpdateTrip={handleUpdateTrip}
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

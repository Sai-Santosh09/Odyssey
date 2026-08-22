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
import { TravelInsights } from '../components/dashboard/TravelInsights';
import { BottomNav } from '../components/dashboard/BottomNav';
import { Toast } from '../components/dashboard/Toast';
import { DestinationModal } from '../components/dashboard/DestinationModal';
import { ChangeLocationModal } from '../components/dashboard/ChangeLocationModal';
import { NotificationsModal } from '../components/dashboard/NotificationsModal';

const INITIAL_TRIPS = [
    {
        id: 'trip_goa_1',
        title: 'Goa Escape',
        location: 'Goa, India',
        dates: '12 Sep – 15 Sep',
        travelers: 3,
        totalDays: 3,
        currentDay: 2,
        activitiesCount: 8,
        status: 'in_progress',
        vibe: '🏖️ Relaxation & Food',
        progressLabel: 'Day 2 of 3',
    },
    {
        id: 'trip_manali_2',
        title: 'Manali Adventure',
        location: 'Himachal Pradesh, India',
        dates: '20 Oct – 25 Oct',
        travelers: 2,
        totalDays: 6,
        currentDay: 1,
        activitiesCount: 14,
        status: 'upcoming',
        vibe: '🏔️ Alpine Trekking',
        daysRemaining: 18,
        progressLabel: 'Upcoming in 18 days',
    }
];

export default function Dashboard() {
    const { user } = useAuth();
    const userEmail = user?.email || 'explorer@odyssey.app';

    // Navigation and Filtering State
    const [activeTab, setActiveTab] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentLocation, setCurrentLocation] = useState('Hyderabad, India');
    const [favorites, setFavorites] = useState(['goa', 'paris']);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);

    // Trips & Stats State
    const [trips, setTrips] = useState(INITIAL_TRIPS);
    const [stats, setStats] = useState({
        trips: 12,
        places: 28,
        activities: 46,
        days: 37,
    });

    // Modals State
    const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
    const [isChangeLocationOpen, setIsChangeLocationOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Toast Notification System
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast((prev) => (prev?.message === message ? null : prev));
        }, 3500);
    };

    // Handlers
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

    const handleSelectLocation = (newLoc) => {
        setCurrentLocation(newLoc);
        showToast(`Location updated to ${newLoc} 📍`, 'success');
    };

    const handleAddToTrip = (rec) => {
        showToast(`Added "${rec.title}" to your itinerary ✓`, 'success');
        setStats((prev) => ({ ...prev, activities: prev.activities + 1 }));
    };

    const handleSelectTrip = (trip) => {
        showToast(`Opening planner for ${trip.title} 🧳`, 'info');
        // Scroll smoothly to itinerary
        const itineraryEl = document.getElementById('section-itinerary');
        if (itineraryEl) {
            itineraryEl.scrollIntoView({ behavior: 'smooth' });
        }
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
            document.getElementById('section-insights')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans pb-24 sm:pb-16 selection:bg-[#F06536]/20 selection:text-[#F06536]">
            {/* Toast System */}
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* Main Application Container */}
            <main className="max-w-xl mx-auto px-4 sm:px-6 py-2 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
                {/* 1. Header */}
                <Header
                    currentLocation={currentLocation}
                    onChangeLocation={() => setIsChangeLocationOpen(true)}
                    onOpenNotifications={() => setIsNotificationsOpen(true)}
                    unreadNotificationsCount={unreadNotificationsCount}
                    userEmail={userEmail}
                    syncStatus="Trips synced"
                />

                {/* 2. Destination Search & Filters */}
                <DestinationSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                {/* 3. Explore Destinations */}
                <div id="section-explore">
                    <ExploreDestinations
                        selectedCategory={selectedCategory}
                        searchQuery={searchQuery}
                        onSelectDestination={handleSelectDestination}
                        onToggleFavorite={handleToggleFavorite}
                        favorites={favorites}
                    />
                </div>

                {/* 4. My Trips */}
                <div id="section-trips">
                    <MyTrips
                        trips={trips}
                        onOpenCreateModal={() => setIsCreateTripOpen(true)}
                        onSelectTrip={handleSelectTrip}
                    />
                </div>

                {/* 5. Upcoming Itinerary */}
                <div id="section-itinerary">
                    <UpcomingItinerary
                        currentTripTitle={trips[0]?.title || 'Goa Escape'}
                        dayTitle={trips[0]?.status === 'in_progress' ? 'Day 2 — Exploring Goa' : 'Day 1 — Arrival & Exploration'}
                        onViewFullItinerary={() => showToast('Full interactive itinerary synced ✓', 'info')}
                        onActivityUpdated={(msg) => showToast(msg, 'success')}
                    />
                </div>

                {/* 6. Near You (Location Aware) */}
                <div id="section-nearyou">
                    <NearYou
                        currentLocation={currentLocation}
                        onSelectPlace={(place) => showToast(`Selected ${place.name} 📍`, 'info')}
                    />
                </div>

                {/* 7. Recommended For You */}
                <div id="section-recommended">
                    <RecommendedForYou
                        onAddToTrip={handleAddToTrip}
                        onSelectRecommendation={(rec) => showToast(`Viewing ${rec.title} ✨`, 'info')}
                    />
                </div>

                {/* 8. Travel Insights (Personal Analytics) */}
                <div id="section-insights">
                    <TravelInsights stats={stats} />
                </div>
            </main>

            {/* Bottom Navigation for Mobile */}
            <BottomNav activeTab={activeTab} onChangeTab={handleTabChange} />

            {/* Modals & Dialogs */}
            <CreateTripModal
                isOpen={isCreateTripOpen}
                onClose={() => setIsCreateTripOpen(false)}
                onCreateTrip={handleCreateTrip}
            />

            <DestinationModal
                destination={selectedDestination}
                isOpen={isDestinationModalOpen}
                onClose={() => setIsDestinationModalOpen(false)}
                onPlanTripWithDestination={handlePlanTripWithDestination}
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
                onClearAll={() => {
                    setUnreadNotificationsCount(0);
                    showToast('Notifications marked as read ✓', 'info');
                }}
            />
        </div>
    );
}

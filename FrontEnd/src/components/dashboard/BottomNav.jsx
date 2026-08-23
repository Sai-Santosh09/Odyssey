import { Compass, Luggage, MapPin, Sparkles } from 'lucide-react';

export function BottomNav({ activeTab = 'explore', onChangeTab, tripsCount = 0 }) {
    const tabs = [
        { id: 'explore', label: 'Explore', icon: Compass, count: null },
        { id: 'trips', label: 'My Trips', icon: Luggage, count: tripsCount > 0 ? tripsCount : null },
        { id: 'nearyou', label: 'Near You', icon: MapPin, count: null },
        { id: 'foryou', label: 'For You', icon: Sparkles, count: null },
    ];

    const positionClass = 'fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm sm:max-w-md px-1 sm:px-2 pointer-events-none';

    return (
        <div className={positionClass}>
            <nav className="pointer-events-auto mx-auto bg-white/95 dark:bg-odyssey-slate/95 backdrop-blur-2xl border border-odyssey-tan/40 dark:border-odyssey-brown/50 shadow-2xl shadow-black/25 rounded-full p-1 sm:p-1.5 flex items-center justify-between gap-0.5 sm:gap-1 transition-all duration-200">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            id={`tab-btn-${tab.id}`}
                            onClick={() => onChangeTab(tab.id)}
                            className={`relative flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-full transition-all duration-200 active:scale-95 touch-manipulation select-none cursor-pointer ${
                                isActive
                                    ? 'bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy shadow-md shadow-odyssey-brown/35 font-bold'
                                    : 'text-odyssey-slate dark:text-odyssey-tan/90 hover:text-odyssey-navy dark:hover:text-odyssey-cream hover:bg-odyssey-cream/40 dark:hover:bg-odyssey-navy/50 font-semibold'
                            }`}
                        >
                            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                            <span className="text-[10px] sm:text-xs tracking-tight whitespace-nowrap">
                                {tab.label}
                            </span>

                            {/* Badge Indicator */}
                            {tab.count !== null && (
                                <span
                                    className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                        isActive
                                            ? 'bg-odyssey-cream text-odyssey-brown dark:bg-odyssey-navy dark:text-odyssey-tan'
                                            : 'bg-odyssey-brown text-odyssey-cream dark:bg-odyssey-tan dark:text-odyssey-navy'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
